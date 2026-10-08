import React, { useEffect, useMemo, useRef, useState } from "react";

// Animate UI-style typewriter: progressive substring plus a blinking cursor.
// Reserves final dimensions, and segments Vietnamese graphemes without splitting accents.
export function TypingTitle({ text, speed = 65, italicLastLine = false }) {
	const root = useRef(null);
	const letters = useMemo(
		() =>
			Array.from(
				new Intl.Segmenter("vi", { granularity: "grapheme" }).segment(
					text,
				),
				(item) => item.segment,
			),
		[text],
	);
	const [started, setStarted] = useState(false);
	const [count, setCount] = useState(0);
	const [motionOff, setMotionOff] = useState(false);
	useEffect(() => {
		const media = window.matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => {
			setMotionOff(media.matches);
			if (media.matches) setStarted(true);
		};
		update();
		media.addEventListener("change", update);
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setStarted(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.2 },
		);
		observer.observe(root.current);
		return () => {
			observer.disconnect();
			media.removeEventListener("change", update);
		};
	}, []);
	useEffect(() => {
		if (motionOff) {
			setCount(letters.length);
			return;
		}
		if (!started || count >= letters.length) return;
		const timer = setTimeout(() => setCount((value) => value + 1), speed);
		return () => clearTimeout(timer);
	}, [started, count, speed, letters.length, motionOff]);
	const fullLines = text.split("\n");
	const shownLines = letters.slice(0, count).join("").split("\n");
	const lines = (array, live = false) =>
		array.map((line, i) => (
			<span
				key={i}
				className={`typing-line ${italicLastLine && i === fullLines.length - 1 ? "typing-em" : ""}`}
			>
				{line}
				{live &&
					i === array.length - 1 &&
					started &&
					count < letters.length &&
					!motionOff && <span className="typing-cursor is-typing" />}
			</span>
		));
	return (
		<span className="typing-title" ref={root}>
			<span className="sr-only">{text}</span>
			<span className="typing-reserve" aria-hidden="true">
				{lines(fullLines)}
			</span>
			<span className="typing-live" aria-hidden="true">
				{lines(shownLines, true)}
			</span>
		</span>
	);
}
