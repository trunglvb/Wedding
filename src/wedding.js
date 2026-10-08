// Wedding details: replace null with confirmed information; no dates or names are assumed.
// Date format: YYYY-MM-DD. Times and addresses are displayed exactly as entered.
export const wedding = {
  location: { coordinates: null },
  families: {
    groom: { father: 'Lường Hữu Lan', mother: 'Lê Thị Hằng', address: 'Tổ dân phố Hồng Quang, Phường Ngọc Sơn, Tỉnh Thanh Hóa' },
    bride: { father: 'Nguyễn Duy Môn', mother: 'Lê Thị Hội', address: 'Tổ dân phố Thành Vinh, Phường Thành Vinh, Tỉnh Thanh Hóa' },
  },
  events: [
    { id: 'ceremony', title: 'Lễ nạp tài', subtitle: 'Hai gia đình, một lời hẹn', date: '2027-01-01', time: null, lunarDate: 'Tức ngày 24 tháng 11 âm lịch', venue: 'Tại tư gia nhà gái', address: 'Tổ dân phố Thành Vinh, Phường Thành Vinh, Tỉnh Thanh Hóa', mapUrl: null },
    { id: 'main-wedding', title: 'Lễ thành hôn', subtitle: 'Chung vui cùng chúng mình', date: '2027-01-03', time: null, lunarDate: 'Tức ngày 26 tháng 11 âm lịch', venue: 'Tại tư gia nhà trai', address: 'Tổ dân phố Hồng Quang, Phường Ngọc Sơn, Tỉnh Thanh Hóa', mapUrl: null },
  ],
  // The timeline belongs only to main-wedding. Reorder entries when timings are confirmed.
  timeline: [
    { id: 'procession', time: null, title: 'Rước dâu', note: 'Đón em về, cùng bắt đầu một hành trình mới.', icon: 'car' },
    { id: 'welcome', time: null, title: 'Đón khách', note: 'Gặp gỡ những người thân yêu, cùng lưu lại một tấm hình.', icon: 'flower' },
    { id: 'vows', time: null, title: 'Cử hành hôn lễ', note: 'Trao lời hẹn ước dưới sự chứng kiến của hai gia đình.', icon: 'heart' },
    { id: 'banquet', time: null, title: 'Dùng tiệc', note: 'Nâng ly chúc phúc và sẻ chia niềm vui ngày chung đôi.', icon: 'dinner' },
    { id: 'memories', time: null, title: 'Lưu giữ kỷ niệm', note: 'Những cái ôm, những nụ cười và một ngày để nhớ.', icon: 'camera' },
  ],
};
