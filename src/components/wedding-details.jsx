import React from 'react';
import { ArrowUpRight, MapPin, Clock3, CarFront, Flower2, Heart, Utensils, Camera } from 'lucide-react';
import { couple } from '../content';
import { wedding } from '../wedding';
import './wedding-details.css';

const icons = { car: CarFront, flower: Flower2, heart: Heart, dinner: Utensils, camera: Camera };

function dateParts(value) {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: String(date.getMonth() + 1).padStart(2, '0'),
    year: date.getFullYear(),
    weekday: new Intl.DateTimeFormat('vi-VN', { weekday: 'long' }).format(date),
    full: new Intl.DateTimeFormat('vi-VN', { dateStyle: 'long' }).format(date),
  };
}

function Family({ side, title }) {
  const family = wedding.families[side];
  return <div className="wedding-family">
    <h3>{title}</h3>
    <p><span>Ông</span><strong className={!family.father ? 'wedding-pending' : ''}>{family.father || 'Sẽ cập nhật'}</strong></p>
    <p><span>Bà</span><strong className={!family.mother ? 'wedding-pending' : ''}>{family.mother || 'Sẽ cập nhật'}</strong></p>
    {family.address && <address className="wedding-family-address">{family.address}</address>}
  </div>;
}

function EventDetails({ event, index }) {
  const date = dateParts(event.date);
  const mapUrl = event.mapUrl && /^https?:\/\//i.test(event.mapUrl) ? event.mapUrl : null;
  return <article className="wedding-event" id={event.id} aria-labelledby={`${event.id}-title`}>
    <span className="wedding-event-number" aria-hidden="true">0{index + 1}</span>
    <p className="wedding-small-label">{event.subtitle}</p>
    <h3 id={`${event.id}-title`}>{event.title}</h3>
    <div className="wedding-date" aria-label={date ? date.full : 'Ngày tổ chức sẽ cập nhật'}>
      <span><b>{date?.day || '—'}</b><small>NGÀY</small></span><i>/</i>
      <span><b>{date?.month || '—'}</b><small>THÁNG</small></span><i>/</i>
      <span><b>{date?.year || '—'}</b><small>NĂM</small></span>
    </div>
    <p className="wedding-event-time"><Clock3 size={14} aria-hidden="true" />{event.time || 'Giờ sẽ cập nhật'}{date && <span> · {date.weekday}</span>}</p>
    {event.lunarDate && <p className="wedding-lunar">{event.lunarDate}</p>}
    <div className="wedding-venue"><MapPin size={20} strokeWidth={1.25} aria-hidden="true" /><h4>{event.venue || 'Địa điểm sẽ cập nhật'}</h4><p>{event.address || 'Địa chỉ chi tiết sẽ được thông báo sau.'}</p></div>
    {mapUrl && <a className="wedding-map-link" href={mapUrl} target="_blank" rel="noreferrer">Xem đường đi <ArrowUpRight size={16} aria-hidden="true" /></a>}
  </article>;
}

export function WeddingDetails({ onPreview }) {
  const mainEvent = wedding.events.find(event => event.id === 'main-wedding');
  const mainDate = dateParts(mainEvent?.date);
  const pendingTimeline = wedding.timeline.some(item => !item.time);
  return <>
    <section className="wedding-invitation" id="wedding-details" aria-labelledby="wedding-invitation-title">
      <header className="wedding-section-head"><span className="eyebrow">03 / LỜI MỜI TỪ TRÁI TIM</span><h2 id="wedding-invitation-title">Hẹn nhau trong <em>ngày chung đôi.</em></h2><p>Một ngày đặc biệt. Và những người thương nhất.</p></header>
      <div className="invitation-paper">
        <div className="invitation-paper-inner">
          <div className="wedding-seal" aria-hidden="true"><span>n <i>&</i> c</span></div>
          <div className="wedding-families"><Family side="groom" title="Nhà trai" /><span className="wedding-family-divider" aria-hidden="true" /><Family side="bride" title="Nhà gái" /></div>
          <div className="wedding-announcement"><p className="wedding-small-label">TRÂN TRỌNG BÁO TIN LỄ THÀNH HÔN CỦA</p><div className="wedding-couple"><div><span className="wedding-small-label">CHÚ RỂ</span><p>{couple.groom}</p></div><i className="wedding-ampersand" aria-hidden="true">&</i><div><span className="wedding-small-label">CÔ DÂU</span><p>{couple.bride}</p></div></div><p className="wedding-invite-copy">Kính mời bạn cùng gia đình đến chung vui<br />và chứng kiến khoảnh khắc hạnh phúc của chúng mình.</p></div>
          <div className="wedding-events">{wedding.events.map((event, index) => <EventDetails key={event.id} event={event} index={index} />)}</div>
          <p className="wedding-paper-foot"><span aria-hidden="true" />Sự hiện diện của bạn là niềm vui của hai gia đình.<span aria-hidden="true" /></p>
        </div>
      </div>
    </section>

    <section className="wedding-day" id="wedding-timeline" aria-labelledby="wedding-day-title">
      <header className="wedding-section-head"><span className="eyebrow">04 / NHỊP ĐIỆU NGÀY HẠNH PHÚC</span><h2 id="wedding-day-title">Một ngày, <em>một đời nhớ.</em></h2><p>Những khoảnh khắc trong ngày lễ thành hôn.</p></header>
      <div className="wedding-day-layout">
        <div className="wedding-day-portrait"><div className="wedding-arch-frame"><button type="button" className="wedding-arch-photo" onClick={event => onPreview(25, event.currentTarget)} aria-label="Xem ảnh cưới của Nguyễn Nguyệt và Lường Cường"><img src="/photos/25.jpg" alt="Nguyễn Nguyệt và Lường Cường bên nhau" loading="lazy" /></button></div><span className="wedding-portrait-note">THE DAY WE SAY “I DO”</span><p>Có bạn ở đây,<br /><em>niềm vui thêm trọn vẹn.</em></p><div className="wedding-main-date"><Flower2 size={18} strokeWidth={1.2} aria-hidden="true" />{mainDate ? <time dateTime={mainEvent.date}>{mainDate.full}</time> : <span>Ngày cưới sẽ cập nhật</span>}</div></div>
        <div className="wedding-schedule"><div className="wedding-schedule-heading"><span className="wedding-small-label">CHƯƠNG TRÌNH NGÀY CƯỚI</span><span className="wedding-small-label">{mainDate ? `${mainDate.day}.${mainDate.month}.${mainDate.year}` : 'NGÀY / THÁNG / NĂM'}</span></div>
          <ol>{wedding.timeline.map((item, index) => { const Icon = icons[item.icon] || Heart; return <li key={item.id}><div className="wedding-schedule-time"><span>{item.time || '— : —'}</span>{!item.time && <small>Sẽ cập nhật</small>}</div><div className="wedding-schedule-marker"><Icon size={23} strokeWidth={1.25} aria-hidden="true" /></div><div className="wedding-schedule-copy"><span className="wedding-step-number" aria-hidden="true">0{index + 1}</span><h3>{item.title}</h3><p>{item.note}</p></div></li>; })}</ol>
          {pendingTimeline && <p className="wedding-schedule-note">Thời gian cụ thể của từng khoảnh khắc sẽ được cập nhật khi lịch cưới được xác nhận.</p>}
        </div>
      </div>
      <div className="wedding-closing"><Heart size={18} strokeWidth={1} aria-hidden="true" /><p>Chúng mình mong được đón bạn.</p><span>WITH LOVE, N & C</span></div>
    </section>
  </>;
}
