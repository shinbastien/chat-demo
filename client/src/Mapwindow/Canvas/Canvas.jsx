import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";

const CanvasWrapper = styled.canvas`
	position: absolute;
	z-index: 20;
`;

const Canvas = ({ width, height }) => {
	const canvasRef = useRef(null);
	const [isPainting, setIsPainting] = useState(false);
	const [mousePosition, setMousePosition] = useState(undefined);

	const startPoint = useCallback((event) => {
		const coordinates = getCoordinate(event);
		if (coordinates) {
			setMousePosition(coordinates);
			setIsPainting(true);
		}
	}, []);

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
					setMousePosition(newMousePosition);
				}
			}
		},
		[isPainting, mousePosition],
	);

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
		setIsPainting(false);
		setMousePosition(undefined);
	}, []);

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

	useEffect(() => {
		if (!canvasRef.current) {
			return;
		}

		const canvas = canvasRef.current;
		canvas.addEventListener("mouseup", exitPaint);
		canvas.addEventListener("mouseleave", exitPaint);

		return () => {
			canvas.removeEventListener("mouseup", exitPaint);

			canvas.removeEventListener("mouseleave", exitPaint);
		};
	}, [exitPaint]);

	return (
		<CanvasWrapper
			ref={canvasRef}
			width={width}
			height={height}
		></CanvasWrapper>
	);
};

export default Canvas;
