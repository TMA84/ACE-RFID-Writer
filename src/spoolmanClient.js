'use strict';

// Shared Spoolman REST client, used by both main.js (Electron/IPC) and server.js (Docker/HA web mode).

const WEIGHT_BUCKETS = [250, 500, 600, 750, 1000];

function nearestWeightBucket(weightG) {
  if (!weightG) return 1000;
  return WEIGHT_BUCKETS.reduce(
    (closest, bucket) => (Math.abs(bucket - weightG) < Math.abs(closest - weightG) ? bucket : closest),
    WEIGHT_BUCKETS[0],
  );
}

function summarize(spool) {
  const filament = spool.filament ?? {};
  const vendor = filament.vendor ?? {};
  const weightG = spool.remaining_weight ?? spool.initial_weight ?? filament.weight ?? null;

  return {
    id: spool.id,
    label: [vendor.name, filament.name || filament.material].filter(Boolean).join(' – ') || `Spule #${spool.id}`,
    material: filament.material ?? '',
    brand: vendor.name ?? '',
    sku: filament.article_number || `SPM-${spool.id}`,
    colorHex: filament.color_hex ?? null,
    extruderTemp: filament.settings_extruder_temp ?? null,
    bedTemp: filament.settings_bed_temp ?? null,
    weightG: nearestWeightBucket(weightG),
  };
}

function normalizeBaseUrl(baseUrl) {
  if (!baseUrl) throw new Error('SPOOLMAN_URL ist nicht konfiguriert.');
  return baseUrl.replace(/\/+$/, '');
}

async function fetchJson(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Spoolman-Anfrage fehlgeschlagen (${res.status}): ${text || res.statusText}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

async function getSpools(baseUrl) {
  const base = normalizeBaseUrl(baseUrl);
  const spools = await fetchJson(`${base}/api/v1/spool?allow_archived=false`);
  return spools.map(summarize);
}

module.exports = { getSpools, nearestWeightBucket, WEIGHT_BUCKETS };
