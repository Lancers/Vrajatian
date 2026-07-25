/**
 * Detects image type from magic bytes rather than trusting the client's
 * declared `Content-Type`/filename — both are attacker-controlled on a
 * multipart upload.
 */
const SIGNATURES: { mime: string; ext: string; check: (buf: Buffer) => boolean }[] = [
  {
    mime: 'image/jpeg',
    ext: 'jpg',
    check: (b) => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    mime: 'image/png',
    ext: 'png',
    check: (b) =>
      b.length >= 8 &&
      b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  },
  {
    mime: 'image/webp',
    ext: 'webp',
    check: (b) =>
      b.length >= 12 &&
      b.subarray(0, 4).toString('ascii') === 'RIFF' &&
      b.subarray(8, 12).toString('ascii') === 'WEBP',
  },
];

export interface SniffedImage {
  mime: 'image/jpeg' | 'image/png' | 'image/webp';
  ext: 'jpg' | 'png' | 'webp';
}

/** Returns the real image type from file bytes, or null if it's none of the allowed formats. */
export function sniffImageType(buffer: Buffer): SniffedImage | null {
  const match = SIGNATURES.find((s) => s.check(buffer));
  return match ? { mime: match.mime as SniffedImage['mime'], ext: match.ext as SniffedImage['ext'] } : null;
}
