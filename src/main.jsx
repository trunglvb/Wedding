import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { createRoot } from "react-dom/client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
	Play,
	Pause,
	Music2,
	X,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	VolumeX,
	Maximize2,
} from "lucide-react";
import { Dialog } from "radix-ui";
import { Button } from "./components/ui/button";
import { couple, heroPhotos, memories, allPhotos, tracks } from "./content";
import photoMeta from "./photo-meta.json";
import { coverFraming } from "./lib/photo-framing";
import { TypingTitle } from "./components/typing-title";
import { WeddingDetails } from "./components/wedding-details";
import { WeddingMap } from "./components/wedding-map";
import { WeddingRsvp } from "./components/wedding-rsvp";
import { WeddingGifts } from "./components/wedding-gifts";
import "./fonts.css";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);
const photo = (id) => `${import.meta.env.BASE_URL}photos/${id}.jpg`;
const pad = (n) => String(n).padStart(2, "0");
const reduced = () =>
	window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const graphemes = (text) =>
	Array.from(
		new Intl.Segmenter("vi", { granularity: "grapheme" }).segment(text),
		(x) => x.segment,
	);

function Typed({ children, className = "", speed = 24 }) {
	const root = useRef(null);
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		if (reduced()) {
			setVisible(true);
			return;
		}
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.2 },
		);
		observer.observe(root.current);
		return () => observer.disconnect();
	}, []);
	let offset = 0;
	return (
		<span
			ref={root}
			className={`typed ${visible ? "is-typed" : ""} ${className}`}
		>
			<span className="sr-only">{children}</span>
			<span aria-hidden="true">
				{String(children)
					.split(/(\s+)/)
					.map((word, i) => {
						const letters = graphemes(word).map((letter, j) => (
							<span
								key={j}
								className="typed-letter"
								style={{ "--delay": `${offset++ * speed}ms` }}
							>
								{letter}
							</span>
						));
						return /\s/.test(word) ? (
							<React.Fragment key={i}>{letters}</React.Fragment>
						) : (
							<span className="typed-word" key={i}>
								{letters}
							</span>
						);
					})}
			</span>
		</span>
	);
}

function HeroImage({ item, incoming, serial }) {
	const frame = useRef(null),
		image = useRef(null);
	useLayoutEffect(() => {
		const position = () => {
			const id = window.matchMedia("(max-width:768px)").matches
				? item.mobile
				: item.desktop;
			const metadata = photoMeta[id];
			const rect = frame.current.getBoundingClientRect();
			image.current.style.objectPosition = coverFraming(
				metadata,
				metadata.faces,
				rect.width,
				rect.height,
			).position;
		};
		position();
		const observer = new ResizeObserver(position);
		observer.observe(frame.current);
		return () => observer.disconnect();
	}, [item]);
	return (
		<div
			ref={frame}
			key={serial}
			className={`hero-layer ${incoming ? "incoming" : ""}`}
		>
			<picture className="hero-picture">
				<source
					media="(max-width: 768px)"
					srcSet={photo(item.mobile)}
				/>
				<img
					ref={image}
					src={photo(item.desktop)}
					alt="Nguyễn Nguyệt và Lường Cường trong bộ ảnh cưới"
					fetchPriority="high"
				/>
			</picture>
		</div>
	);
}

function Hero() {
	const [active, setActive] = useState(0);
	const [old, setOld] = useState(0);
	const [serial, setSerial] = useState(0);
	const [retry, setRetry] = useState(0);
	const [paused, setPaused] = useState(false);
	const current = useRef(0),
		root = useRef(null),
		busy = useRef(false),
		mounted = useRef(true);
	useEffect(
		() => () => {
			mounted.current = false;
		},
		[],
	);
	const change = useCallback(async (next) => {
		if (next === current.current || busy.current) return;
		busy.current = true;
		const item = heroPhotos[next];
		const image = new Image();
		image.src = photo(
			window.matchMedia("(max-width:768px)").matches
				? item.mobile
				: item.desktop,
		);
		try {
			await image.decode();
		} catch {
			busy.current = false;
			return;
		}
		if (!mounted.current) return;
		setOld(current.current);
		current.current = next;
		setActive(next);
		setSerial((s) => s + 1);
		busy.current = false;
	}, []);
	useEffect(() => {
		const upcoming = heroPhotos[(active + 1) % heroPhotos.length];
		const image = new Image();
		image.src = photo(
			window.matchMedia("(max-width:768px)").matches
				? upcoming.mobile
				: upcoming.desktop,
		);
		if (paused || reduced()) return;
		// Change photographs every 3 seconds; the slower reveal lasts 2.8 seconds.
		const timer = setTimeout(() => {
			if (
				!document.hidden &&
				root.current.getBoundingClientRect().bottom > 0
			)
				change((current.current + 1) % heroPhotos.length);
			else setRetry((s) => s + 1);
		}, 3000);
		return () => clearTimeout(timer);
	}, [active, serial, retry, paused, change]);
	return (
		<section
			className="hero"
			ref={root}
			style={{ "--shade": heroPhotos[active].shade }}
			aria-label="Ảnh cưới của cô dâu và chú rể"
		>
			<HeroImage item={heroPhotos[old]} />
			<HeroImage
				key={serial}
				item={heroPhotos[active]}
				incoming
				serial={serial}
			/>
			<div className="hero-shade" />
			<div className="hero-top">
				<span className="monogram">
					n<span>&</span>c
				</span>
				<span className="edition">
					OUR WEDDING STORY
					<br />
					<small>2024 — FOREVER</small>
				</span>
			</div>
			<div className="hero-bottom">
				<span className="hero-label">CÔ DÂU & CHÚ RỂ</span>
				<h1 className="couple-names">
					<span>{couple.bride}</span>
					<i>&</i>
					<span>{couple.groom}</span>
				</h1>
				<div className="hero-foot">
					<button
						className="scroll-cue"
						onClick={() =>
							document.getElementById("couple").scrollIntoView({
								behavior: reduced() ? "auto" : "smooth",
							})
						}
					>
						KHÁM PHÁ CÂU CHUYỆN <ChevronDown size={15} />
					</button>
					<div className="slide-controls">
						<div className="slide-dots">
							{heroPhotos.map((_, i) => (
								<button
									key={i}
									className={`slide-dot ${active === i ? "active" : ""}`}
									onClick={() => change(i)}
									aria-label={`Xem ảnh mở đầu ${i + 1}`}
									aria-pressed={active === i}
								/>
							))}
						</div>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setPaused(!paused)}
							aria-label={
								paused ? "Tiếp tục đổi ảnh" : "Tạm dừng đổi ảnh"
							}
						>
							{paused ? <Play size={14} /> : <Pause size={14} />}
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}

function PhotoButton({ id, onPreview, className = "", label, children }) {
	return (
		<button
			type="button"
			className={`photo-button ${className}`}
			onClick={(event) => onPreview(id, event.currentTarget)}
			aria-label={label || `Xem ảnh cưới ${id + 1}`}
		>
			<img
				src={photo(id)}
				alt={label || `Ảnh cưới ${id + 1}`}
				loading="lazy"
			/>
			{children}
			<span className="photo-zoom" aria-hidden="true">
				<Maximize2 size={16} />
			</span>
		</button>
	);
}

function Couple({ onPreview }) {
	const root = useRef(null);
	useLayoutEffect(() => {
		if (reduced()) return;
		const ctx = gsap.context(() => {
			gsap.utils.toArray(".person").forEach((el, i) => {
				gsap.from(el.querySelector(".portrait-composition"), {
					x: i ? 75 : -75,
					opacity: 0,
					duration: 1.7,
					ease: "power3.out",
					scrollTrigger: {
						trigger: el,
						start: "top 82%",
						once: true,
					},
				});
			});
		}, root);
		return () => ctx.revert();
	}, []);
	const people = [
		{
			role: "CÔ DÂU",
			type: "bride",
			name: couple.bride,
			job: couple.brideJob,
			bio: couple.brideBio,
			meet: couple.brideMeet,
			quote: "EM KỂ",
			id: 8,
			detail: 26,
			label: "Chân dung cô dâu trong váy cưới trắng",
			number: "01",
		},
		{
			role: "CHÚ RỂ",
			type: "groom",
			name: couple.groom,
			job: couple.groomJob,
			bio: couple.groomBio,
			meet: couple.groomMeet,
			quote: "ANH KỂ",
			id: 27,
			detail: 2,
			label: "Lường Cường trong quân phục bên Nguyễn Nguyệt",
			number: "02",
		},
	];
	return (
		<section id="couple" className="couple-section" ref={root}>
			<header className="section-heading">
				<span className="eyebrow">01 / HAI NGƯỜI, MỘT CÂU CHUYỆN</span>
				<h2>
					<TypingTitle
						text={"Tình yêu bắt đầu\ntừ những điều rất nhỏ."}
						italicLastLine
					/>
				</h2>
				<div className="heading-foot">
					<span className="fine-line" />
					<p>
						<Typed speed={18}>
							Một cuộc gặp gỡ. Một người để thương.
						</Typed>
					</p>
					<span className="fine-line" />
				</div>
			</header>
			{people.map((person, i) => (
				<React.Fragment key={person.type}>
					{i > 0 && (
						<div className="couple-interlude">
							<span /> <i>&</i> <span />
						</div>
					)}
					<article className={`person ${person.type}`}>
						<div className="portrait-composition">
							<span className="portrait-index">
								{person.number}
							</span>
							<div className="portrait-frame">
								<PhotoButton
									id={person.id}
									onPreview={onPreview}
									className="portrait"
									label={person.label}
								/>
							</div>
							<PhotoButton
								id={person.detail}
								onPreview={onPreview}
								className="portrait-detail"
								label={`Một khoảnh khắc của ${person.name}`}
							/>
							<span className="vertical-note">
								A LITTLE PORTRAIT OF LOVE
							</span>
							<span className="portrait-caption">
								{person.role} <i> / </i> {person.name}
							</span>
						</div>
						<div className="person-copy">
							<span className="eyebrow">{person.role}</span>
							<h3>
								<TypingTitle text={person.name} speed={75} />
							</h3>
							<p className="biography">
								<Typed speed={13}>{person.bio}</Typed>
							</p>
							<div className="meet-note">
								<span className="quote-mark" aria-hidden="true">
									“
								</span>
								<span className="eyebrow">
									{person.quote} VỀ LẦN ĐẦU GẶP GỠ
								</span>
								<p>
									<Typed speed={15}>{person.meet}</Typed>
								</p>
							</div>
						</div>
					</article>
				</React.Fragment>
			))}
		</section>
	);
}

function BubbleGallery({ onPreview, active }) {
	return (
		<div className={`bubble-gallery ${active ? "is-visible" : ""}`}>
			<div className="bubble-heading">
				<span className="eyebrow">NOW & FOREVER</span>
				<h3>
					<TypingTitle text="Tất cả đều là chúng mình." speed={55} />
				</h3>
				<p>Chạm một khoảnh khắc để xem trọn vẹn.</p>
			</div>
			<div className="bubble-field" aria-label="Toàn bộ 26 ảnh cưới">
				{allPhotos.map((id, i) => (
					<div
						key={id}
						className={`bubble-slot bubble-slot-${i}`}
						style={{
							"--ratio":
								photoMeta[id].width / photoMeta[id].height,
							"--delay": `${i * 0.025}s`,
							"--drift-delay": `${-i * 0.73}s`,
							"--duration": `${5 + (i % 5) * 0.7}s`,
							"--angle": `${((i % 5) - 2) * 1.5}deg`,
							"--sway": `${i % 2 ? 4 : -4}px`,
						}}
					>
						<PhotoButton
							id={id}
							onPreview={onPreview}
							className="bubble-photo"
							label={`Mở ảnh ${pad(i + 1)} trong album cưới`}
						/>
					</div>
				))}
			</div>
			<div className="bubble-bottom">
				<span>26 KHOẢNH KHẮC · MỘT TÌNH YÊU</span>
			</div>
		</div>
	);
}

function Story({ onPreview }) {
	const root = useRef(null),
		viewport = useRef(null),
		track = useRef(null),
		trigger = useRef(null);
	const [progress, setProgress] = useState(0);
	const page = Math.min(3, Math.round(progress * 3));
	useLayoutEffect(() => {
		const mm = gsap.matchMedia();
		mm.add(
			"(min-width:769px) and (prefers-reduced-motion:no-preference)",
			() => {
				const ctx = gsap.context(() => {
					const tween = gsap.to(track.current, {
						x: () =>
							-(
								track.current.scrollWidth -
								viewport.current.clientWidth
							),
						ease: "none",
						onUpdate() {
							setProgress(this.progress());
						},
						scrollTrigger: {
							trigger: root.current,
							start: "top top",
							end: () =>
								`+=${Math.max(3200, window.innerWidth * 3)}`,
							pin: true,
							scrub: 0.85,
							invalidateOnRefresh: true,
							anticipatePin: 1,
						},
					});
					trigger.current = tween.scrollTrigger;
				}, root);
				return () => {
					trigger.current = null;
					ctx.revert();
				};
			},
		);
		return () => mm.revert();
	}, []);
	const navigate = useCallback((index) => {
		const st = trigger.current;
		if (st)
			window.scrollTo({
				top: st.start + ((st.end - st.start) * index) / 3,
				behavior: reduced() ? "auto" : "smooth",
			});
		else
			viewport.current.scrollTo({
				left: viewport.current.clientWidth * index,
				behavior: reduced() ? "auto" : "smooth",
			});
	}, []);
	function nativeScroll() {
		if (trigger.current) return;
		const el = viewport.current;
		setProgress(
			el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth),
		);
	}
	function focusPanel(index) {
		if (page !== index) navigate(index);
	}
	return (
		<section
			id="story"
			className="story-section"
			ref={root}
			aria-label="Hành trình từ 2024 đến hiện tại"
		>
			<header className="story-header">
				<div>
					<span className="eyebrow">02 / NHỮNG NGÀY CÓ NHAU</span>
					<h2>
						<TypingTitle text="Chuyện chúng mình." />
					</h2>
				</div>
				<span className="story-instruction">
					<span className="desktop-only">
						CUỘN ĐỂ ĐI QUA TỪNG KỶ NIỆM
					</span>
					<span className="mobile-only">
						VUỐT NGANG QUA TỪNG KỶ NIỆM
					</span>
				</span>
			</header>
			<div
				className="story-window"
				ref={viewport}
				onScroll={nativeScroll}
			>
				<div className="story-track" ref={track}>
					{memories.map((memory, i) => (
						<article
							className={`chapter chapter-${i} ${page === i ? "active-chapter" : ""}`}
							key={memory.year}
							onFocusCapture={() => focusPanel(i)}
							aria-label={`${memory.year}: ${memory.label}`}
						>
							<div className="chapter-intro">
								<div className="chapter-date">
									<span>{pad(i + 1)}</span>
									<strong>{memory.year}</strong>
								</div>
								<h3>
									{memory.title}
									<br />
									<em>{memory.italic}</em>
								</h3>
								<p>{memory.note}</p>
							</div>
							<div className="chapter-photos">
								{memory.photos.map((id, j) => (
									<figure
										key={id}
										className={`memory-photo photo-${j}`}
									>
										<PhotoButton
											id={id}
											onPreview={onPreview}
											label={`${memory.year} — ${memory.label}, ảnh ${j + 1}`}
										/>
										<figcaption>
											<span>{pad(i * 4 + j + 1)}</span>
											<i>{memory.year}</i>
										</figcaption>
									</figure>
								))}
							</div>
						</article>
					))}
					<article
						className="chapter gallery-chapter"
						onFocusCapture={() => focusPanel(3)}
						aria-label="Now — Album ảnh cưới"
					>
						<BubbleGallery
							onPreview={onPreview}
							active={progress > 0.83}
						/>
					</article>
				</div>
			</div>
			<nav className="timeline" aria-label="Mốc thời gian câu chuyện">
				<div className="timeline-top">
					<span className="timeline-current">
						{page === 0 ? "2024" : page === 1 ? "2025" : "Now"}
						<i>
							{" "}
							/{" "}
							{page === 3
								? "Những khoảnh khắc của chúng mình"
								: memories[Math.min(page, 2)].label}
						</i>
					</span>
					<div className="timeline-arrows">
						<Button
							variant="ghost"
							size="icon"
							disabled={page === 0}
							onClick={() => navigate(Math.max(0, page - 1))}
							aria-label="Kỷ niệm trước"
						>
							<ChevronLeft size={17} />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							disabled={page === 3}
							onClick={() => navigate(Math.min(3, page + 1))}
							aria-label="Kỷ niệm tiếp theo"
						>
							<ChevronRight size={17} />
						</Button>
					</div>
				</div>
				<div className="timeline-stations">
					<div className="timeline-line">
						<span style={{ transform: `scaleX(${progress})` }} />
					</div>
					{[
						{ label: "2024", index: 0, title: "Gặp gỡ" },
						{ label: "2025", index: 1, title: "Bên nhau" },
						{ label: "Now", index: 3, title: "Một đời" },
					].map((station, i) => (
						<button
							key={station.label}
							className={`station ${page >= station.index || (i === 2 && page >= 2) ? "reached" : ""}`}
							onClick={() => navigate(station.index)}
							aria-current={
								(i === 2 ? page >= 2 : page === station.index)
									? "step"
									: undefined
							}
						>
							<span className="station-jewel" />
							<span>{station.label}</span>
							<small>{station.title}</small>
						</button>
					))}
				</div>
			</nav>
		</section>
	);
}

function Lightbox({ selected, setSelected, returnFocus }) {
	const [failed, setFailed] = useState(false);
	const isOpen = selected !== null;
	const step = useCallback(
		(direction) =>
			setSelected(
				(id) => (id + direction + allPhotos.length) % allPhotos.length,
			),
		[setSelected],
	);
	useEffect(() => {
		setFailed(false);
		if (!isOpen) return;
		const next = new Image();
		next.src = photo((selected + 1) % allPhotos.length);
		function keydown(event) {
			if (event.key === "ArrowRight") {
				event.preventDefault();
				step(1);
			}
			if (event.key === "ArrowLeft") {
				event.preventDefault();
				step(-1);
			}
		}
		window.addEventListener("keydown", keydown);
		return () => window.removeEventListener("keydown", keydown);
	}, [isOpen, selected, step]);
	return (
		<Dialog.Root
			open={isOpen}
			onOpenChange={(open) => {
				if (!open) setSelected(null);
			}}
		>
			<Dialog.Portal>
				<Dialog.Overlay className="lightbox-overlay" />
				<Dialog.Content
					className="lightbox"
					onCloseAutoFocus={(event) => {
						event.preventDefault();
						returnFocus.current?.focus({ preventScroll: true });
					}}
				>
					<div className="lightbox-top">
						<div>
							<Dialog.Title>
								{couple.bride} & {couple.groom}
							</Dialog.Title>
							<Dialog.Description>
								Khoảnh khắc {pad((selected ?? 0) + 1)} /{" "}
								{allPhotos.length}
							</Dialog.Description>
						</div>
						<Dialog.Close asChild>
							<Button
								variant="ghost"
								size="icon"
								aria-label="Đóng ảnh"
							>
								<X size={24} />
							</Button>
						</Dialog.Close>
					</div>
					<div className="lightbox-stage">
						<Button
							className="lightbox-prev"
							variant="ghost"
							size="icon"
							onClick={() => step(-1)}
							aria-label="Ảnh trước"
						>
							<ChevronLeft size={26} />
						</Button>
						{failed ? (
							<p role="alert">
								Ảnh chưa tải được. Bạn có thể chuyển sang ảnh
								tiếp theo.
							</p>
						) : (
							<img
								key={selected}
								src={photo(selected)}
								alt={`Ảnh cưới ${selected + 1}, hiển thị trọn vẹn`}
								onError={() => setFailed(true)}
							/>
						)}
						<Button
							className="lightbox-next"
							variant="ghost"
							size="icon"
							onClick={() => step(1)}
							aria-label="Ảnh tiếp theo"
						>
							<ChevronRight size={26} />
						</Button>
					</div>
					<p className="lightbox-hint">
						{pad((selected ?? 0) + 1)} — {pad(allPhotos.length)}
						<span>PHÍM ← → ĐỂ ĐỔI ẢNH · ESC ĐỂ ĐÓNG</span>
					</p>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

function MusicPlayer() {
	const playable = useMemo(
		() =>
			tracks.filter(
				(item) => typeof item.file === "string" && item.file.length > 0,
			),
		[],
	);
	const audio = useRef(null),
		wanted = useRef(true),
		failures = useRef(0);
	const [playing, setPlaying] = useState(false),
		[track, setTrack] = useState(0),
		[error, setError] = useState(false),
		[notice, setNotice] = useState("");
	const tryPlay = useCallback(() => {
		if (!wanted.current || !audio.current || !playable.length) return;
		audio.current.volume = 0.45;
		const promise = audio.current.play();
		if (promise)
			promise.catch((reason) => {
				setPlaying(false);
				if (
					reason.name !== "NotAllowedError" &&
					reason.name !== "AbortError"
				)
					setError(true);
			});
	}, [playable.length]);
	useEffect(() => {
		const unlock = (event) => {
			if (event.target.closest?.("[data-music-toggle]")) return;
			if (wanted.current && audio.current?.paused) tryPlay();
		};
		// click/touchend retain mobile browser user activation; pointerdown alone is insufficient on some phones.
		document.addEventListener("click", unlock);
		document.addEventListener("touchend", unlock, { passive: true });
		document.addEventListener("keydown", unlock);
		return () => {
			document.removeEventListener("click", unlock);
			document.removeEventListener("touchend", unlock);
			document.removeEventListener("keydown", unlock);
		};
	}, [tryPlay]);
	useEffect(() => {
		if (wanted.current) tryPlay();
	}, [track, tryPlay]);
	useEffect(() => {
		if (!notice) return;
		const timer = setTimeout(() => setNotice(""), 4000);
		return () => clearTimeout(timer);
	}, [notice]);
	function toggle() {
		if (!playable.length) {
			setNotice("Nhạc nền đang được cập nhật.");
			return;
		}
		if (playing) {
			wanted.current = false;
			audio.current.pause();
		} else {
			wanted.current = true;
			failures.current = 0;
			setError(false);
			tryPlay();
		}
	}
	const label = !playable.length
		? "Nhạc nền đang được cập nhật"
		: playing
			? "Tắt nhạc nền"
			: error
				? "Thử phát lại nhạc nền"
				: "Bật nhạc nền";
	return (
		<>
			{playable.length > 0 && (
				<audio
					ref={audio}
					src={playable[track].file}
					autoPlay
					preload="auto"
					playsInline
					onCanPlay={tryPlay}
					onPlay={() => {
						setPlaying(true);
						setError(false);
						failures.current = 0;
					}}
					onPause={() => setPlaying(false)}
					onEnded={() => {
						if (wanted.current)
							setTrack((i) => (i + 1) % playable.length);
					}}
					onError={() => {
						setPlaying(false);
						failures.current++;
						if (
							wanted.current &&
							failures.current < playable.length
						)
							setTrack((i) => (i + 1) % playable.length);
						else {
							wanted.current = false;
							setError(true);
						}
					}}
				/>
			)}
			{notice && (
				<span className="music-notice" role="status">
					{notice}
				</span>
			)}
			<Button
				data-music-toggle
				className={`music-toggle ${playing ? "is-playing" : ""}`}
				variant="outline"
				size="icon"
				onClick={toggle}
				aria-label={label}
				title={label}
				aria-pressed={playing}
			>
				{playing ? <Music2 size={19} /> : <VolumeX size={19} />}
			</Button>
		</>
	);
}

function App() {
	const [selected, setSelected] = useState(null),
		returnFocus = useRef(null);
	const preview = useCallback((id, element) => {
		returnFocus.current = element;
		setSelected(id);
	}, []);
	useEffect(() => {
		const refresh = () => ScrollTrigger.refresh();
		document.fonts.ready.then(refresh);
		window.addEventListener("load", refresh);
		return () => window.removeEventListener("load", refresh);
	}, []);
	return (
		<>
			<main>
				<Hero />
				<Couple onPreview={preview} />
				<Story onPreview={preview} />
				<WeddingDetails onPreview={preview} />
				<WeddingMap />
				<WeddingRsvp />
				<WeddingGifts />
			</main>
			<footer className="site-footer">
				<span>
					{couple.bride} <i>&</i> {couple.groom}
				</span>
				<small>2024 — MÃI VỀ SAU</small>
			</footer>
			<MusicPlayer />
			<Lightbox
				selected={selected}
				setSelected={setSelected}
				returnFocus={returnFocus}
			/>
		</>
	);
}
createRoot(document.getElementById("root")).render(<App />);
