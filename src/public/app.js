'use strict';

let materialTemps = {};

// --- DOM ---
const readerDot   = document.getElementById('readerDot');
const readerLabel = document.getElementById('readerLabel');
const tagDot      = document.getElementById('tagDot');
const tagLabel    = document.getElementById('tagLabel');
const btnRead     = document.getElementById('btnRead');
const btnWrite    = document.getElementById('btnWrite');
const toast       = document.getElementById('toast');

const fields = {
  brand:       document.getElementById('brand'),
  material:    document.getElementById('material'),
  sku:         document.getElementById('sku'),
  weight:      document.getElementById('weight'),
  colorPicker: document.getElementById('colorPicker'),
  colorHex:    document.getElementById('colorHex'),
  extruderMin: document.getElementById('extruderMin'),
  extruderMax: document.getElementById('extruderMax'),
  bedMin:      document.getElementById('bedMin'),
  bedMax:      document.getElementById('bedMax'),
};

// --- Toast ---
let toastTimer = null;
function showToast(msg, type = 'success') {
  toast.textContent = msg;
  toast.className   = `toast ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.className = 'toast hidden'; }, 3000);
}

// --- Status ---
let readerReady = false;
let tagPresent  = false;

function setReaderStatus(connected, name = '') {
  readerReady           = connected;
  readerDot.className   = 'dot' + (connected ? ' connected' : '');
  readerLabel.textContent = connected ? name : 'Reader nicht verbunden';
  updateButtons();
}

function setTagStatus(present, uid = '') {
  tagPresent            = present;
  tagDot.className      = 'dot' + (present ? ' tag-active' : '');
  tagLabel.textContent  = present ? `Tag: ${uid}` : 'Kein Tag';
  updateButtons();
}

function updateButtons() {
  const canAct  = readerReady && tagPresent;
  btnRead.disabled  = !canAct;
  btnWrite.disabled = !canAct;
}

// --- Color ---
function hexToRgb(hex) {
  const m = hex.replace('#', '').match(/.{2}/g);
  if (!m || m.length < 3) return null;
  return { r: parseInt(m[0], 16), g: parseInt(m[1], 16), b: parseInt(m[2], 16) };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

fields.colorPicker.addEventListener('input', () => {
  fields.colorHex.value = fields.colorPicker.value.toUpperCase();
});

fields.colorHex.addEventListener('input', () => {
  const val = fields.colorHex.value.trim();
  const hex = val.startsWith('#') ? val : '#' + val;
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
    fields.colorPicker.value = hex.toLowerCase();
  }
});

// --- Material auto-fill ---
fields.material.addEventListener('change', () => {
  const temps = materialTemps[fields.material.value];
  if (!temps) return;
  fields.extruderMin.value = temps.extruderMin;
  fields.extruderMax.value = temps.extruderMax;
  fields.bedMin.value      = temps.bedMin;
  fields.bedMax.value      = temps.bedMax;
});

// --- Form → payload ---
function getPayload() {
  const rgb = hexToRgb(fields.colorHex.value || fields.colorPicker.value) ?? { r: 255, g: 255, b: 255 };
  return {
    sku:         fields.sku.value.trim(),
    brand:       fields.brand.value.trim(),
    material:    fields.material.value,
    colorR:      rgb.r,
    colorG:      rgb.g,
    colorB:      rgb.b,
    extruderMin: parseInt(fields.extruderMin.value) || 190,
    extruderMax: parseInt(fields.extruderMax.value) || 230,
    bedMin:      parseInt(fields.bedMin.value)      || 50,
    bedMax:      parseInt(fields.bedMax.value)      || 60,
    weightG:     parseInt(fields.weight.value)      || 1000,
  };
}

// --- Clear form ---
function clearForm() {
  fields.brand.value       = '';
  fields.sku.value         = '';
  fields.material.value    = '';
  fields.weight.value      = '1000';
  fields.extruderMin.value = '';
  fields.extruderMax.value = '';
  fields.bedMin.value      = '';
  fields.bedMax.value      = '';
  fields.colorPicker.value = '#ffffff';
  fields.colorHex.value    = '';
}

// --- Populate form ---
function populateForm(data) {
  fields.brand.value       = data.brand       ?? '';
  fields.sku.value         = data.sku         ?? '';
  fields.extruderMin.value = data.extruderMin ?? 190;
  fields.extruderMax.value = data.extruderMax ?? 230;
  fields.bedMin.value      = data.bedMin      ?? 50;
  fields.bedMax.value      = data.bedMax      ?? 60;

  if (data.material) {
    const opt = [...fields.material.options].find(o => o.value === data.material);
    if (opt) fields.material.value = data.material;
  }

  const hex = rgbToHex(data.colorR ?? 255, data.colorG ?? 255, data.colorB ?? 255);
  fields.colorPicker.value = hex;
  fields.colorHex.value    = hex.toUpperCase();

  if (data.weightG) {
    const opt = [...fields.weight.options].find(o => o.value === String(data.weightG));
    if (opt) fields.weight.value = String(data.weightG);
  }
}

// --- IPC event handler ---
function handleEvent(msg) {
  switch (msg.type) {
    case 'reader_connected':    setReaderStatus(true, msg.name);      break;
    case 'reader_disconnected': setReaderStatus(false);                break;
    case 'tag_detected':        setTagStatus(true, msg.uid);           break;
    case 'tag_removed':         setTagStatus(false); clearForm();       break;
    case 'tag_data':            populateForm(msg.fields); showToast('Tag gelesen'); break;
    case 'write_success':       showToast('Tag erfolgreich beschrieben'); break;
    case 'error':               showToast(msg.message, 'error');       break;
  }
}

// --- Buttons ---
btnRead.addEventListener('click', () => {
  window.electronNFC.send('read');
});

btnWrite.addEventListener('click', () => {
  const payload = getPayload();
  if (!payload.material) {
    showToast('Bitte Material wählen', 'error');
    return;
  }
  window.electronNFC.send('write', { fields: payload });
});

// --- Init ---
async function init() {
  try {
    const conf  = await window.electronNFC.getConfig();
    materialTemps = conf.materialTemps ?? {};
  } catch (e) {
    console.warn('Config nicht geladen', e);
  }
  window.electronNFC.onEvent(handleEvent);
}

init();
