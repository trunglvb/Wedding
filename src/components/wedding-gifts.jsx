import React from "react";
import { Heart } from "lucide-react";
import "./wedding-gifts.css";

const giftAccounts = [
	{
		role: "Chú rể",
		name: "Lường Lê Cường",
		bank: "MB Bank",
		accountNumber: "0100112181002",
		qr: `${import.meta.env.BASE_URL}qr/QR_Trai.jpg`,
		initials: "C",
	},
	{
		role: "Cô dâu",
		name: "Nguyễn Thị Nguyệt",
		bank: "VietinBank",
		accountNumber: "106868589981",
		qr: `${import.meta.env.BASE_URL}qr/QR_Gai.jpg`,
		initials: "N",
	},
];

export function WeddingGifts() {
	return (
		<section
			className="gift-section"
			id="mung-cuoi"
			aria-labelledby="gift-heading"
		>
			<header className="gift-heading">
				<span className="eyebrow">MỘT CHÚT YÊU THƯƠNG</span>
				<h2 id="gift-heading">
					Mừng cưới <em>chúng mình.</em>
				</h2>
				<p>
					Sự hiện diện của bạn là món quà quý giá nhất.
					<br />
					Nếu muốn gửi thêm chút yêu thương, chúng mình xin trân trọng
					đón nhận.
				</p>
			</header>
			<div className="gift-envelopes">
				{giftAccounts.map((person) => (
					<article
						className="gift-envelope"
						key={person.role}
						aria-label={`Mừng cưới ${person.role.toLowerCase()} ${person.name}`}
					>
						<div className="gift-letter">
							<span className="gift-role">
								GỬI ĐẾN {person.role.toLocaleUpperCase("vi")}
							</span>
							<div className="gift-qr">
								<img
									src={person.qr}
									alt={`QR chuyển khoản ${person.role.toLowerCase()} – ${person.bank}`}
									loading="lazy"
								/>
							</div>

							<p className="gift-bank">
								{person.name} – {person.bank}
							</p>

							<p className="gift-account">
								<span>Số tài khoản</span>
								<strong>{person.accountNumber}</strong>
							</p>
						</div>
						<div className="gift-envelope-front" aria-hidden="true">
							<span className="gift-seal">{person.initials}</span>
							<span className="gift-envelope-caption">
								with love
							</span>
						</div>
					</article>
				))}
			</div>
			<div className="gift-thanks">
				<span />
				<Heart size={16} strokeWidth={1.2} />
				<span />
			</div>
			<p className="gift-signoff">
				Cảm ơn vì đã là một phần
				<br />
				<em>trong ngày hạnh phúc của chúng mình.</em>
			</p>
		</section>
	);
}
