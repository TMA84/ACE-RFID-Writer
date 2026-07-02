# ACE RFID Writer

Web-App zum Beschreiben von Anycubic ACE Filament-RFID-Tags über einen ACR122U USB NFC-Reader.

## Features

- Tag automatisch lesen wenn aufgelegt
- Hersteller, Material, Farbe (Colorpicker), Temperaturen, Gewicht einstellen
- Temperatur-Voreinstellungen je Material (PLA, PETG, ABS, ASA, TPU, PA, PC …)
- Läuft lokal auf dem Mac oder als Docker-Container (auch auf Home Assistant)

## Lokal starten (Mac)

```bash
cd ace-rfid-writer
npm install
npm start
```

Browser: [http://localhost:3000](http://localhost:3000)

**Voraussetzung:** ACR122U per USB angesteckt. Auf macOS funktioniert PC/SC out of the box, kein Treiber nötig.

## Docker (lokal)

```bash
docker compose up --build
```

## Home Assistant Add-on

1. Repo als lokales Add-on in HA einbinden:
   - **Einstellungen → Add-ons → Add-on Store → ⋮ → Repositories**
   - Pfad zum Ordner (oder GitHub-URL) eintragen

2. ACR122U per USB am HA-Gerät (z.B. Raspberry Pi) anschließen

3. Add-on installieren und starten

4. Web UI öffnen: `http://<home-assistant-ip>:3000`

Das Add-on nutzt `privileged: true`, damit Docker auf den USB-Port zugreifen kann.

## Tag-Format (Anycubic ACE)

144 Bytes ab NTAG-Block 4:

| Offset | Länge | Feld |
|--------|-------|------|
| 0–3    | 4     | Header `{7B 00 65 00}` |
| 4–23   | 20    | SKU (UTF-8) |
| 24–43  | 20    | Brand (UTF-8) |
| 44–63  | 20    | Material (UTF-8) |
| 64     | 1     | `0xFF` |
| 65–67  | 3     | Farbe RGB |
| 80–81  | 2     | Düse Min °C (LE) |
| 82–83  | 2     | Düse Max °C (LE) |
| 100–101| 2     | Bett Min °C (LE) |
| 102–103| 2     | Bett Max °C (LE) |
| 104–105| 2     | Durchmesser × 100 (175 = 1.75 mm) |
| 106–107| 2     | Länge in Metern (LE) |

Schwarz (0,0,0) → wird als (1,1,1) geschrieben (Firmware-Workaround).
