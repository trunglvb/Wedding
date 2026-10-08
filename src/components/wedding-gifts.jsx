import React from 'react';
import { Heart } from 'lucide-react';
import { couple } from '../content';
import './wedding-gifts.css';

// Decorative placeholders only. Replace with bank-provided QR images when available.
function SampleQr({ seed }) {
  const cells = [];
  for (let y = 0; y < 29; y++) for (let x = 0; x < 29; x++) {
    if ((x < 8 && y < 8) || (x > 20 && y < 8) || (x < 8 && y > 20)) continue;
    if (x > 9 && x < 19 && y > 10 && y < 18) continue;
    if (((x * 17 + y * 31 + x * y * 7 + seed * 13) % 11) < 5) cells.push(<rect key={`${x}-${y}`} x={x + 4} y={y + 4} width="1" height="1" />);
  }
  return <svg viewBox="0 0 37 37" role="img" aria-label="QR minh họa, không dùng để chuyển khoản" shapeRendering="crispEdges">
    <rect width="37" height="37" fill="#fffdf8" />
    <g fill="currentColor">{cells}{[[4, 4], [26, 4], [4, 26]].map(([x, y]) => <g key={`${x}-${y}`}><rect x={x} y={y} width="7" height="7" /><rect x={x + 1} y={y + 1} width="5" height="5" fill="#fffdf8" /><rect x={x + 2} y={y + 2} width="3" height="3" /></g>)}</g>
    <text x="18.5" y="20" textAnchor="middle" fill="currentColor" fontFamily="serif" fontSize="3.2" shapeRendering="auto">MẪU</text>
  </svg>;
}

export function WeddingGifts() {
  return <section className="gift-section" id="mung-cuoi" aria-labelledby="gift-heading">
    <header className="gift-heading">
      <span className="eyebrow">MỘT CHÚT YÊU THƯƠNG</span>
      <h2 id="gift-heading">Mừng cưới <em>chúng mình.</em></h2>
      <p>Sự hiện diện của bạn là món quà quý giá nhất.<br />Nếu muốn gửi thêm chút yêu thương, chúng mình xin trân trọng đón nhận.</p>
    </header>
    <div className="gift-envelopes">
      {[{ role: 'Chú rể', name: 'Lường Lê Cường', seed: 3, initials: 'C' }, { role: 'Cô dâu', name: couple.bride, seed: 7, initials: 'N' }].map(person => <article className="gift-envelope" key={person.role} aria-label={`Mừng cưới ${person.role.toLowerCase()} ${person.name}`}>
        <div className="gift-letter">
          <span className="gift-role">GỬI ĐẾN {person.role.toLocaleUpperCase('vi')}</span>
          <div className="gift-qr"><SampleQr seed={person.seed} /></div>
          <span className="gift-sample">QR MẪU · CHƯA DÙNG CHUYỂN KHOẢN</span>
          <p className="gift-bank">{person.name} – MB Bank</p>
        </div>
        <div className="gift-envelope-front" aria-hidden="true"><span className="gift-seal">{person.initials}</span><span className="gift-envelope-caption">with love</span></div>
      </article>)}
    </div>
    <div className="gift-thanks"><span /><Heart size={16} strokeWidth={1.2} /><span /></div>
    <p className="gift-signoff">Cảm ơn vì đã là một phần<br /><em>trong ngày hạnh phúc của chúng mình.</em></p>
  </section>;
}
