// Replace sample names, biographies and memories here. All photographs are from the supplied folder.
export const couple = {
	groom: "Lường Cường",
	bride: "Nguyễn Nguyệt",
	groomJob: "Bác sĩ quân y",
	brideJob: "Bác sĩ",
	groomBio:
		"Anh thích những điều giản đơn: một tách cà phê buổi sáng, một chuyến đi không cần kế hoạch, và những ngày có em bên cạnh.",
	groomMeet:
		"Một cuộc gặp tình cờ qua những người bạn chung. Anh không ngờ câu chào hôm ấy lại trở thành khởi đầu của chúng mình.",
	brideBio:
		"Em yêu những bức ảnh, những bó hoa nhỏ và việc lưu giữ niềm vui trong từng điều bình thường.",
	brideMeet:
		"Em nhớ nụ cười của anh trong lần đầu gặp. Rồi từ những câu chuyện chẳng đầu chẳng cuối, anh trở thành người em muốn kể mọi điều.",
};
// Ten coordinated pairs: landscape-friendly desktop images, portrait-only mobile images.
export const heroPhotos = [
	{ desktop: 21, mobile: 25, shade: "31,40,26" },
	{ desktop: 16, mobile: 24, shade: "34,39,32" },
	{ desktop: 13, mobile: 20, shade: "43,29,28" },
	{ desktop: 25, mobile: 17, shade: "55,33,25" },
	{ desktop: 24, mobile: 9, shade: "50,34,24" },
	{ desktop: 20, mobile: 12, shade: "30,43,28" },
	{ desktop: 17, mobile: 15, shade: "39,41,32" },
	{ desktop: 9, mobile: 2, shade: "40,29,30" },
	{ desktop: 19, mobile: 0, shade: "51,36,30" },
	{ desktop: 0, mobile: 1, shade: "49,34,28" },
];
export const memories = [
	{
		year: "2024",
		label: "Lần đầu gặp gỡ",
		title: "Từ một lời chào,",
		italic: "thành một người thương.",
		note: "Có những người xuất hiện, rồi khiến mọi điều trở nên khác biệt.",
		photos: [18, 19, 3, 0],
	},
	{
		year: "2025",
		label: "Những ngày bên nhau",
		title: "Đi đâu cũng được.",
		italic: "Miễn là cùng nhau.",
		note: "Những chuyến đi nhỏ, những câu chuyện dài. Bình thường thôi, mà thương thật nhiều.",
		photos: [1, 20, 9, 11],
	},
	{
		year: "Now",
		label: "Mình về chung một nhà",
		title: "Và rồi, chúng mình",
		italic: "chọn một đời bên nhau.",
		note: "Từ “anh và em”, thành “chúng mình”. Một lời đồng ý, một hành trình mới.",
		photos: [4, 17, 24, 25],
	},
];
export const allPhotos = Array.from({ length: 26 }, (_, i) => i);
// Direct audio files are still required. Official references identify the requested recordings;
// YouTube watch pages cannot be passed to an HTML audio element.
export const tracks = [
	{
		title: "Người tốt nhất cho em",
		artist: "Bon Nghiêm & 14 Casper",
		file: `${import.meta.env.BASE_URL}music/nguoi-tot-nhat-cho-em.mp3`,
		sourceUrl: "https://www.youtube.com/watch?v=YXhRfqyThno",
	},
	{
		title: "Lý giải",
		artist: "Hoàng Dũng",
		file: `${import.meta.env.BASE_URL}music/ly-giai.mp3`,
		sourceUrl: "https://www.youtube.com/watch?v=oQKZC6Qnrqw",
	},
	{
		title: "Đường chân trời",
		artist: "Chillies",
		file: `${import.meta.env.BASE_URL}music/duong-chan-troi.mp3`,
		sourceUrl: "https://www.youtube.com/watch?v=HTSqRkVpL9E",
	},
	{
		title: "Một đời",
		artist: "14 Casper, Bon Nghiêm & buitruonglinh",
		file: `${import.meta.env.BASE_URL}music/mot-doi.mp3`,
		sourceUrl: "https://www.youtube.com/watch?v=JgTZvDbaTtg",
	},
];
