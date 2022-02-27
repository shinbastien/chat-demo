import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import { useSocket } from "../../lib/socket";

const CanvasWrapper = styled.canvas`
	position: absolute;
	z-index: 20;
`;

const Canvas = ({ width, height }) => {
	const canvasRef = useRef(null);
	const subcanvasRef = useRef(null);
	const [isPainting, setIsPainting] = useState(false);
	const [otherIsPainting, setOtherIsPainting] = useState(false);
	const [mousePosition, setMousePosition] = useState(undefined);
	const { socket, connected } = useSocket();
	const [drawings, setDrawings] = useState([]);
	const [count, setCount] = React.useState(0);

	const requestRef = React.useRef();
	const previousTimeRef = React.useRef();

	const startPoint = useCallback(
		(event) => {
			const coordinates = getCoordinate(event);
			if (coordinates) {
				setMousePosition(coordinates);
				setIsPainting(true);
				if (socket && connected) {
					socket.emit("start drawing");
				}
			}
		},
		[socket, connected],
	);

	useEffect(() => {
		if (!canvasRef.current) {
			return;
		}
		const canvas = canvasRef.current;
		canvas.addEventListener("mousedown", startPoint);

		return () => {
			canvas.removeEventListener("mousedown", startPoint);
		};
	}, [startPoint]);

	const paint = useCallback(
		(event) => {
			if (isPainting) {
				const newMousePosition = getCoordinate(event);

				if (mousePosition && newMousePosition) {
					drawLine(mousePosition, newMousePosition);
					if (socket && connected) {
						socket.emit("send paint", mousePosition, newMousePosition);
						console.log("send paint from:", mousePosition);
						console.log("send paint to: ", newMousePosition);
					}
					setMousePosition(newMousePosition);
				}
			}
		},
		[isPainting, mousePosition, socket, connected],
	);

	useEffect(() => {
		if (socket && connected) {
			socket.on("other start drawing", () => {
				setOtherIsPainting(true);
			});
			socket.on("other stopped drawing", () => {
				setOtherIsPainting(false);
			});
		}
		return () => {
			if (socket && connected) {
				socket.off("other start drawing", () => {
					setOtherIsPainting(true);
				});
				socket.off("other stopped drawing", () => {
					setOtherIsPainting(false);
				});
			}
		};
	}, [otherIsPainting, socket, connected]);

	useEffect(() => {
		const handlePainting = async (mousePosition, newMousePosition) => {
			drawLine(mousePosition, newMousePosition);
			console.log("drawing line");
		};
		if (socket && connected) {
			socket.on("receive paint", handlePainting);
		}
		return () => {
			if (socket && connected) {
				socket.off("receive paint", handlePainting);
			}
		};
	}, [otherIsPainting, socket, connected]);

	useEffect(() => {
		if (!canvasRef.current) {
			return;
		}
		const canvas = canvasRef.current;
		canvas.addEventListener("mousemove", paint);

		return () => {
			canvas.removeEventListener("mousemove", paint);
		};
	}, [paint]);

	const exitPaint = useCallback(() => {
		if (socket && connected) {
			if (isPainting) {
				socket.emit("stop drawing");
				console.log("stop drawing");
			}
		}
		const canvas = canvasRef.current;

		const ctx = canvas.getContext("2d");
		const image = new Image();
		image.src = canvasRef.current.toDataURL();
		image.onload = () =>
			setDrawings((drawings) => [
				...drawings,
				{ image: image, createdAt: new Date().getTime(), opacity: 1 },
			]);

		ctx.clearRect(0, 0, width, height);
		console.log("clear");

		setIsPainting(false);
		setMousePosition(undefined);
	}, [socket, connected]);

	const getCoordinate = (event) => {
		if (!canvasRef.current) {
			return;
		}

		const canvas = canvasRef.current;

		return [event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop];
	};

	const drawLine = (originalMousePosition, newMousePosition) => {
		if (!canvasRef.current) {
			return;
		}
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");

		if (ctx == null) throw new Error("Could not get context");
		if (ctx) {
			ctx.strokeStyle = "#151ca2";
			ctx.lineJoin = "round";
			ctx.lineWidth = 3;

			ctx.beginPath();
			ctx.moveTo(originalMousePosition[0], originalMousePosition[1]);
			ctx.lineTo(newMousePosition[0], newMousePosition[1]);

			ctx.closePath();

			ctx.stroke();
		}
	};

	const update = () => {
		const t = new Date().getTime();

		for (let i = 0; i < drawings.length; i++) {
			console.log(t - drawings[i]["createdAt"]);
			if (t - drawings[i]["createdAt"] > 2000) {
				// 드로잉 후 2초 후 지워지기 시작

				drawings[i]["opacity"] -= 0.015;
			}
		}
		setDrawings((drawings) => [
			drawings.filter((drawings) => drawings.opacity > 0),
		]);
	};

	const animate = (time) => {
		// update();
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		const subctx = subcanvasRef.current.getContext("2d");

		subctx.putImageData(ctx.getImageData(0, 0, width, height), 0, 0);
		console.log(drawings);
		drawings.forEach((drawing) => {
			subctx.save();
			subctx.globalAlpha = drawing.opacity;
			subctx.drawImage(drawing.image, 0, 0);
			subctx.restore();
		});
		previousTimeRef.current = time;
		requestRef.current = requestAnimationFrame(animate);
	};

	useEffect(() => {
		requestRef.current = requestAnimationFrame(animate);

		return () => cancelAnimationFrame(requestRef.current);
	}, []); // Make sure the effect runs only once

	useEffect(() => {
		if (!canvasRef.current) {
			return;
		}

		const canvas = canvasRef.current;

		// update();
		canvas.addEventListener("mouseup", exitPaint);
		canvas.addEventListener("mouseleave", exitPaint);

		return () => {
			canvas.removeEventListener("mouseup", exitPaint);
			canvas.removeEventListener("mouseleave", exitPaint);
		};
	}, [exitPaint]);

	return (
		<>
			<CanvasWrapper
				ref={subcanvasRef}
				width={width}
				height={height}
			></CanvasWrapper>
			<CanvasWrapper
				ref={canvasRef}
				width={width}
				height={height}
			></CanvasWrapper>
		</>
	);
};

export default Canvas;
