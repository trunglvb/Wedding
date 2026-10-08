import React from "react";
import { ArrowUpRight, MapPin, Heart } from "lucide-react";
import { wedding } from "../wedding";
import "./wedding-map.css";

export function WeddingMap() {
	const event = wedding.events.find((item) => item.id === "main-wedding");
	// Exact place coordinates resolved from the family's Google Maps share link.
	// Use the place's !3d/!4d coordinates, not the @ viewport center.
	const query = "19.5548274,105.7976362";
	const searchUrl = "https://maps.app.goo.gl/H5A1EGPGxgzvfHsB7";
	const embedUrl = `https://www.google.com/maps?${new URLSearchParams({ q: query, output: "embed", hl: "vi", z: "17" })}`;
	const date = new Date(`${event.date}T12:00:00`);
	return (
		<section
			className="venue-section"
			id="wedding-map"
			aria-labelledby="venue-title"
		>
			<header className="wedding-section-head">
				<span className="eyebrow">05 / ĐƯỜNG ĐẾN NGÀY CHUNG ĐÔI</span>
				<h2 id="venue-title">
					Hẹn gặp bạn <em>ở nơi này.</em>
				</h2>
				<p>
					Một chuyến đi, một lời chúc, một ngày thật nhiều yêu thương.
				</p>
			</header>
			<div className="venue-postcard">
				<div className="venue-postcard-copy">
					<div className="venue-postcard-top">
						<div className="venue-event-label">
							<span className="venue-home-icon">
								<MapPin
									size={25}
									strokeWidth={1}
									aria-hidden="true"
								/>
							</span>
							<span className="wedding-small-label">
								{event.title.toLocaleUpperCase("vi-VN")}
							</span>
						</div>
						<span className="venue-stamp" aria-hidden="true">
							<Heart size={20} strokeWidth={1} />
							<span>N & C</span>
						</span>
					</div>
					<h3>
						Tư gia <em>nhà trai.</em>
					</h3>
					<address>{event.address}</address>
					<div className="venue-date-line">
						<time dateTime={event.date}>
							{new Intl.DateTimeFormat("vi-VN", {
								weekday: "long",
								day: "2-digit",
								month: "2-digit",
								year: "numeric",
							}).format(date)}
						</time>
					</div>
				</div>
				<div className="venue-map-panel">
					<div className="venue-map-heading">
						<span className="wedding-small-label">
							HỒNG QUANG · NGỌC SƠN
						</span>
						<span>Thanh Hóa, Việt Nam</span>
					</div>
					<iframe
						className="venue-map-embed"
						title="Google Maps — vị trí tổ chức lễ thành hôn tại nhà trai"
						src={embedUrl}
						loading="lazy"
						allowFullScreen
						referrerPolicy="no-referrer-when-downgrade"
					/>
					<a
						className="venue-open-map"
						href={searchUrl}
						target="_blank"
						rel="noopener noreferrer"
					>
						<span>
							<MapPin size={16} aria-hidden="true" />
							Mở trong Google Maps
						</span>
						<ArrowUpRight size={19} aria-hidden="true" />
					</a>
				</div>
			</div>
			<p className="venue-signoff">
				Mọi con đường hôm ấy, <em>đều dẫn về niềm vui.</em>
			</p>
		</section>
	);
}
