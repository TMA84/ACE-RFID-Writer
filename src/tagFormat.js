'use strict';

// Anycubic ACE RFID tag format
// 144 bytes starting at NTAG block 4
// Integers: little-endian (NumToBytes reverses big-endian array → LE)

const HEADER = Buffer.from([0x7B, 0x00, 0x65, 0x00]);
const TAG_SIZE = 144;

const MATERIAL_TEMPS = {
  'PLA':    { extruderMin: 190, extruderMax: 230, bedMin: 50,  bedMax: 60  },
  'PLA+':   { extruderMin: 195, extruderMax: 235, bedMin: 50,  bedMax: 65  },
  'PETG':   { extruderMin: 230, extruderMax: 250, bedMin: 70,  bedMax: 85  },
  'ABS':    { extruderMin: 230, extruderMax: 250, bedMin: 90,  bedMax: 110 },
  'ASA':    { extruderMin: 240, extruderMax: 260, bedMin: 90,  bedMax: 100 },
  'TPU':    { extruderMin: 220, extruderMax: 240, bedMin: 40,  bedMax: 60  },
  'PA':     { extruderMin: 250, extruderMax: 270, bedMin: 70,  bedMax: 90  },
  'PA-CF':  { extruderMin: 260, extruderMax: 280, bedMin: 80,  bedMax: 100 },
  'PC':     { extruderMin: 260, extruderMax: 300, bedMin: 100, bedMax: 120 },
  'HIPS':   { extruderMin: 230, extruderMax: 250, bedMin: 90,  bedMax: 100 },
  'PVA':    { extruderMin: 185, extruderMax: 210, bedMin: 50,  bedMax: 60  },
  'SILK':   { extruderMin: 190, extruderMax: 220, bedMin: 45,  bedMax: 60  },
};

// Weight (g) → spool length (m) as used by Anycubic firmware
const WEIGHT_TO_LENGTH = {
  250:  82,
  500:  165,
  600:  198,
  750:  247,
  1000: 330,
};

const LENGTH_TO_WEIGHT = Object.fromEntries(
  Object.entries(WEIGHT_TO_LENGTH).map(([g, m]) => [m, parseInt(g)])
);

function weightToLength(grams) {
  return WEIGHT_TO_LENGTH[grams] ?? 330;
}

function lengthToWeight(meters) {
  return LENGTH_TO_WEIGHT[meters] ?? 1000;
}

function writeStr(buf, offset, str, maxLen) {
  const encoded = Buffer.from(str ?? '', 'utf8').subarray(0, maxLen);
  encoded.copy(buf, offset);
}

function readStr(buf, offset, maxLen) {
  const slice = buf.subarray(offset, offset + maxLen);
  const end = slice.indexOf(0);
  return slice.subarray(0, end >= 0 ? end : maxLen).toString('utf8');
}

function encode(fields) {
  const buf = Buffer.alloc(TAG_SIZE, 0);

  HEADER.copy(buf, 0);
  writeStr(buf, 4,  fields.sku      ?? '', 20);
  writeStr(buf, 24, fields.brand    ?? '', 20);
  writeStr(buf, 44, fields.material ?? '', 20);

  buf[64] = 0xFF;

  // Black (0,0,0) → (1,1,1) workaround for Anycubic firmware
  let r = fields.colorR ?? 0;
  let g = fields.colorG ?? 0;
  let b = fields.colorB ?? 0;
  if (r === 0 && g === 0 && b === 0) { r = 1; g = 1; b = 1; }
  buf[65] = r;
  buf[66] = g;
  buf[67] = b;

  buf.writeUInt16LE(fields.extruderMin ?? 190, 80);
  buf.writeUInt16LE(fields.extruderMax ?? 230, 82);
  buf.writeUInt16LE(fields.bedMin      ?? 50,  100);
  buf.writeUInt16LE(fields.bedMax      ?? 60,  102);
  buf.writeUInt16LE(175,                        104); // 1.75mm fixed
  buf.writeUInt16LE(weightToLength(fields.weightG ?? 1000), 106);

  return buf;
}

function decode(buf) {
  const r = buf[65], g = buf[66], b = buf[67];
  // Reverse black workaround on read
  const isBlack = r === 1 && g === 1 && b === 1;

  return {
    sku:         readStr(buf, 4,  20),
    brand:       readStr(buf, 24, 20),
    material:    readStr(buf, 44, 20),
    colorR:      isBlack ? 0 : r,
    colorG:      isBlack ? 0 : g,
    colorB:      isBlack ? 0 : b,
    extruderMin: buf.readUInt16LE(80),
    extruderMax: buf.readUInt16LE(82),
    bedMin:      buf.readUInt16LE(100),
    bedMax:      buf.readUInt16LE(102),
    diameter:    buf.readUInt16LE(104) / 100,
    weightG:     lengthToWeight(buf.readUInt16LE(106)),
  };
}

module.exports = { encode, decode, MATERIAL_TEMPS, WEIGHT_TO_LENGTH };
