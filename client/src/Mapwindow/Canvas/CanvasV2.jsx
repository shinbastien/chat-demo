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
	const [drawing, setDrawing] = useState([]);

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
		const subcanvas = subcanvasRef.current;

		// //when mouse-up set the canvas:
		const image = new Image();
		image.src = subcanvas.toDataUrl();
		image.onload = () =>
			setDrawing((drawing) => [
				...drawing,
				{ image: image, createdAt: new Date().getTime(), opacity: 1 },
			]);

		setIsPainting(false);
		setMousePosition(undefined);
	}, [socket, connected]);

	const updateMain = useCallback(() => {
		const t = new Date().getTime();
		for (let i = 0; i < drawing.length; i++) {
			if (t - drawing[i]["createdAt"] > 2000) {
				// 드로잉 후 2초 후 지워지기 시작
				drawing[i]["opacity"] -= 0.015;
			}
		}
		setDrawing(drawing.filter((drawing) => drawing.opacity > 0)); // 다 지워진 오브젝트 삭제
	});

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
		const subcanvas = subcanvasRef.current;
		const ctx = canvas.getContext("2d");
		const subctx = subcanvas.getContext("2d");
		const stageWidth = subcanvasRef.width;
		const stageHeight = subcanvasRef.height;

		if (ctx == null && subctx == null) throw new Error("Could not get context");
		if (subctx && ctx) {
			subctx.strokeStyle = "#151ca2";
			subctx.lineJoin = "round";
			subctx.lineWidth = 3;

			subctx.beginPath();
			subctx.moveTo(originalMousePosition[0], originalMousePosition[1]);
			subctx.lineTo(newMousePosition[0], newMousePosition[1]);
			subctx.closePath();
			subctx.clearRect(0, 0, stageWidth, stageHeight);
			subctx.stroke();
		}
	};

	useEffect(() => {
		if (!canvasRef.current) {
			return;
		}

		const canvas = canvasRef.current;
		const subcanvas = subcanvasRef.current;
		subcanvas.addEventListener("mouseup", exitPaint);
		subcanvas.addEventListener("mouseleave", exitPaint);
		updateMain();

		return () => {
			subcanvas.removeEventListener("mouseup", exitPaint);
			subcanvas.removeEventListener("mouseleave", exitPaint);
		};
	}, [exitPaint]);

	return (
		<CanvasWrapper
			ref={subcanvasRef}
			width={width}
			height={height}
		></CanvasWrapper>
	);
};

export default Canvas;
