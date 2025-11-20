export const encodeSingleFrameOfText = (text) => {
  let buffer = Buffer.alloc(2 + text.length);
  buffer[0] = 0x81;
  buffer[1] = text.length;
  Buffer.from(text).copy(buffer, 2);

  return buffer;
};

const FIRST_BIT_OF_BYTE_MASK = 0x80;
const LAST_BIT_OF_BYTE_MASK = 0x01;
export const isFirstBitSet = (byte) => {
  return (byte & FIRST_BIT_OF_BYTE_MASK) === FIRST_BIT_OF_BYTE_MASK;
};
export const isLastBitSet = (byte) => {
  return (byte & LAST_BIT_OF_BYTE_MASK) === LAST_BIT_OF_BYTE_MASK;
};
export const isFrameFinal = (buffer) => {
  return isFirstBitSet(buffer.readUInt8(0));
};
export const isText = (buffer) => {
  return isLastBitSet(buffer.readUInt8(0));
};
export const decodeLength = (buffer) => {
  const secondByte = buffer.readUInt8(1);

  return secondByte - (isFirstBitSet(secondByte) ? FIRST_BIT_OF_BYTE_MASK : 0);
};
export const extractMask = (buffer) =>
  Buffer.from([2, 3, 4, 5].map((offset) => buffer.readUInt8(offset)));
export const extractData = (buffer) => {
  const length = decodeLength(buffer);
  let data = Buffer.alloc(length);
  for (var i = 0; i < length; i++) {
    data.writeUInt8(buffer.readUInt8(6 + i), i);
  }
  return data;
};
export const decodeSingleFrameOfText = (buffer) => {
  const data = extractData(buffer);
  const mask = extractMask(buffer);
  const decoded = Buffer.from(
    Uint8Array.from(data, (byte, index) => byte ^ mask[index % 4]),
  );

  return decoded.toString();
};
