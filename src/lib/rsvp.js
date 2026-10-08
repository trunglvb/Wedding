export const RSVP_ENDPOINT =
	"https://script.google.com/macros/s/AKfycbyIRelSCiMre3Dx4yNvSl4oMNFn_Do-JXzVrI2-4FNRjMJgTfUdKvjOsuww1ytKGpxQqA/exec";

export function normalizeRsvp(values) {
	const name = String(values.name || "").trim();
	const phone = String(values.phone || "")
		.trim()
		.replace(/[\s().-]/g, "");
	const attendance = String(values.attendance || "").trim();
	const note = String(values.note || "").trim();

	if (name.length < 2 || name.length > 100)
		throw new Error("Vui lòng nhập họ tên từ 2 đến 100 ký tự.");
	if (!/^\+?[0-9]{8,15}$/.test(phone))
		throw new Error("Vui lòng kiểm tra số điện thoại (8–15 chữ số).");
	if (!["yes", "no"].includes(attendance))
		throw new Error("Vui lòng chọn câu trả lời tham dự.");
	if (note.length > 500) throw new Error("Lời nhắn tối đa 500 ký tự.");

	return {
		Name: name,
		Phone: phone,
		Attendance: attendance === "yes" ? "Có tham dự" : "Không tham dự",
		Message: note,
	};
}
