// Face-safe cover framing. The normalized bounds were reviewed against the supplied photos.
// These are composition hints only, not biometric identification.
export function coverFraming(image, box, viewWidth, viewHeight, anchor = [.5, .36]) {
  const scale = Math.max(viewWidth / image.width, viewHeight / image.height);
  const rendered = [image.width * scale, image.height * scale];
  const view = [viewWidth, viewHeight];
  const offsets = view.map((size, axis) => {
    const overflow = rendered[axis] - size;
    if (overflow <= .001) return 0;
    const minFace = box[axis] * rendered[axis];
    const maxFace = box[axis + 2] * rendered[axis];
    const margin = size * .035;
    const low = Math.max(-overflow, margin - minFace);
    const high = Math.min(0, size - margin - maxFace);
    const desired = size * anchor[axis] - (minFace + maxFace) / 2;
    if (low <= high) return Math.max(low, Math.min(high, desired));
    return Math.max(-overflow, Math.min(0, size / 2 - (minFace + maxFace) / 2));
  });
  const percentages = offsets.map((offset, axis) => {
    const difference = view[axis] - rendered[axis];
    return Math.abs(difference) < .001 ? 50 : offset / difference * 100;
  });
  return { position: `${percentages[0]}% ${percentages[1]}%`, offsets, scale };
}
