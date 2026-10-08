import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Heart, Mail } from "lucide-react";
import "./wedding-rsvp.css";

const RSVP_ENDPOINT = import.meta.env.VITE_API_RSVP_ENDPOINT_KEY;
const initial = { name: "", phone: "", attendance: "", note: "" };

export function WeddingRsvp() {
	const [values, setValues] = useState(initial);
	const [state, setState] = useState("idle");
	const [error, setError] = useState("");
	const resultFocus = useRef(null),
		sending = useRef(false);
	useEffect(() => {
		if (state === "success") resultFocus.current?.focus();
	}, [state]);

	function update(event) {
		setValues((current) => ({
			...current,
			[event.target.name]: event.target.value,
		}));
	}

	async function submit(event) {
		event.preventDefault();
		if (sending.current) return;
		const name = values.name.trim();
		const phone = values.phone.trim().replace(/[\s().-]/g, "");
		const message = values.note.trim();
		if (name.length < 2 || name.length > 100) {
			setError("Vui lòng nhập họ tên từ 2 đến 100 ký tự.");
			return;
		}
		if (!/^\+?[0-9]{8,15}$/.test(phone)) {
			setError("Vui lòng kiểm tra số điện thoại (8–15 chữ số).");
			return;
		}
		if (!["yes", "no"].includes(values.attendance)) {
			setError("Vui lòng chọn câu trả lời tham dự.");
			return;
		}
		if (message.length > 500) {
			setError("Lời nhắn tối đa 500 ký tự.");
			return;
		}
		sending.current = true;
		setState("sending");
		setError("");
		try {
			// These keys must match the new Apps Script's e.parameter fields / Sheet headers.
			// URLSearchParams preserves Vietnamese accents, &, +, = and line breaks.
			const body = new URLSearchParams({
				Name: name,
				Phone: phone,
				Attendance:
					values.attendance === "yes"
						? "Có tham dự"
						: "Không tham dự",
				Message: message,
			});
			const response = await fetch(RSVP_ENDPOINT, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: body.toString(),
			});
			const text = await response.text();
			if (!response.ok) throw new Error("HTTP error");
			// Apps Script may return JSON or a plain-text acknowledgement.
			let result;
			try {
				result = JSON.parse(text);
			} catch {
				/* Plain text is supported. */
			}
			if (
				!text.trim() ||
				/<!doctype html|<html[\s>]/i.test(text) ||
				/^(error|exception|lỗi)\b/i.test(text.trim()) ||
				result?.error ||
				result?.success === false ||
				["error", "failed", "failure"].includes(
					String(result?.status ?? result?.result).toLowerCase(),
				)
			) {
				throw new Error(
					result?.message ||
						"Google Apps Script đang báo lỗi. Vui lòng kiểm tra script và bảng tính nhận dữ liệu.",
				);
			}
			setState("success");
		} catch (error) {
			setState("error");
			setError(
				error.message &&
					error.message !== "Failed to fetch" &&
					error.message !== "HTTP error"
					? error.message
					: "Chưa nhận được xác nhận từ hệ thống. Thông tin đã được giữ lại. Nếu vừa gửi, bạn vui lòng kiểm tra trước khi gửi lại để tránh trùng",
			);
		} finally {
			sending.current = false;
		}
	}

	return (
		<section
			className="rsvp-section"
			id="rsvp"
			aria-labelledby="rsvp-title"
		>
			<div className="rsvp-layout">
				<div className="rsvp-intro">
					<span className="eyebrow">
						06 / MỘT LỜI HẸN VỚI CHÚNG MÌNH
					</span>
					<span className="rsvp-script" aria-hidden="true">
						Rsvp.
					</span>
					<h2 id="rsvp-title">
						Bạn sẽ đến
						<br />
						<em>chung vui chứ?</em>
					</h2>
					<p>
						Một lời xác nhận nhỏ từ bạn sẽ giúp chúng mình chuẩn bị
						một ngày đón tiếp thật chu đáo.
					</p>
					<div className="rsvp-event">
						<span className="rsvp-event-day">03</span>
						<div>
							<span>THÁNG 01 · 2027</span>
							<strong>Lễ thành hôn</strong>
							<small>Tư gia nhà trai · Ngọc Sơn, Thanh Hóa</small>
						</div>
					</div>
					<div className="rsvp-personal-note">
						<Heart size={18} strokeWidth={1} aria-hidden="true" />
						<p>
							Chỗ ngồi dành cho bạn,
							<br />
							<em>niềm vui dành cho tất cả.</em>
						</p>
					</div>
				</div>
				<div className="rsvp-paper">
					{state === "success" ? (
						<div
							className="rsvp-success"
							tabIndex={-1}
							ref={resultFocus}
							role="status"
						>
							<span className="rsvp-success-icon">
								<Check
									size={34}
									strokeWidth={1.3}
									aria-hidden="true"
								/>
							</span>
							<span className="rsvp-overline">
								ĐÃ NHẬN LỜI HỒI ĐÁP
							</span>
							<h3>Cảm ơn {values.name.trim()}!</h3>
							<p>
								{values.attendance === "yes"
									? "Chúng mình đã nhận lời xác nhận của bạn. Hẹn gặp bạn trong ngày hạnh phúc nhé!"
									: "Chúng mình đã ghi nhận bạn không thể tham dự. Cảm ơn bạn đã dành tình cảm cho ngày chung đôi."}
							</p>
							<span className="rsvp-signature">
								Nguyệt & Cường
							</span>
						</div>
					) : (
						<>
							<div className="rsvp-paper-heading">
								<Mail
									size={22}
									strokeWidth={1.1}
									aria-hidden="true"
								/>
								<h3>Gửi lời hồi đáp</h3>
								<p>Những mục có dấu * cần được điền đầy đủ.</p>
							</div>
							<form
								onSubmit={submit}
								className={`rsvp-form ${state === "sending" ? "is-sending" : ""}`}
								aria-busy={state === "sending"}
							>
								<fieldset
									disabled={state === "sending"}
									className="rsvp-fields"
								>
									<legend className="sr-only">
										Thông tin xác nhận tham dự
									</legend>
									<div className="rsvp-two-col">
										<label htmlFor="rsvp-name">
											Họ và tên *
											<input
												id="rsvp-name"
												name="name"
												value={values.name}
												onChange={update}
												required
												minLength={2}
												maxLength={100}
												autoComplete="name"
												placeholder="Tên của bạn"
											/>
										</label>
										<label htmlFor="rsvp-phone">
											Số điện thoại *
											<input
												id="rsvp-phone"
												name="phone"
												type="tel"
												inputMode="tel"
												value={values.phone}
												onChange={update}
												required
												maxLength={25}
												autoComplete="tel"
												placeholder="Số điện thoại liên hệ"
											/>
										</label>
									</div>
									<fieldset className="rsvp-attendance">
										<legend>
											Bạn có thể tham dự không? *
										</legend>
										<div>
											{[
												{
													value: "yes",
													title: "Mình sẽ đến",
													note: "Hẹn gặp trong ngày vui",
												},
												{
													value: "no",
													title: "Tiếc là không thể",
													note: "Gửi lời chúc từ xa",
												},
											].map((option) => (
												<label
													key={option.value}
													className={`rsvp-choice ${values.attendance === option.value ? "is-selected" : ""}`}
												>
													<input
														type="radio"
														name="attendance"
														value={option.value}
														checked={
															values.attendance ===
															option.value
														}
														onChange={update}
														required
													/>
													<span>
														<strong>
															{option.title}
														</strong>
														<small>
															{option.note}
														</small>
													</span>
												</label>
											))}
										</div>
									</fieldset>
									<label htmlFor="rsvp-note">
										Lời nhắn{" "}
										<span className="rsvp-optional">
											· không bắt buộc
										</span>
										<textarea
											id="rsvp-note"
											name="note"
											value={values.note}
											onChange={update}
											maxLength={500}
											rows={3}
										/>
									</label>
								</fieldset>
								{error && (
									<p className="rsvp-error" role="alert">
										{error}
									</p>
								)}
								<button
									type="submit"
									className={`rsvp-submit ${state === "sending" ? "is-loading" : ""}`}
									disabled={state === "sending"}
								>
									<span className="rsvp-submit-label">
										{state === "sending" && (
											<span
												className="rsvp-button-spinner"
												aria-hidden="true"
											/>
										)}
										{state === "sending"
											? "Đang gửi lời hồi đáp…"
											: "Gửi xác nhận"}
									</span>
									{state === "sending" ? (
										<Heart
											size={18}
											strokeWidth={1.3}
											aria-hidden="true"
										/>
									) : (
										<ArrowUpRight
											size={19}
											aria-hidden="true"
										/>
									)}
								</button>
								{state === "sending" && (
									<div
										className="rsvp-loading-note"
										role="status"
										aria-live="polite"
										aria-atomic="true"
									>
										<span
											className="rsvp-loading-envelope"
											aria-hidden="true"
										>
											<Mail size={23} strokeWidth={1.1} />
											<span className="rsvp-loading-heart">
												<Heart
													size={11}
													fill="currentColor"
													strokeWidth={1}
												/>
											</span>
										</span>
										<div>
											<strong>
												Lời hẹn của bạn đang được gửi
												<span
													className="rsvp-loading-dots"
													aria-hidden="true"
												>
													<i />
													<i />
													<i />
												</span>
											</strong>
											<p>
												Bạn chờ một chút nhé, chúng mình
												đang nhận lời hồi đáp.
											</p>
										</div>
									</div>
								)}
								<p className="rsvp-privacy">
									Tên và số điện thoại chỉ dùng để xác nhận,
									liên hệ và sắp xếp đón tiếp trong ngày cưới.
								</p>
							</form>
						</>
					)}
				</div>
			</div>
		</section>
	);
}
