const fs = require('fs');
const path = require('path');

const sensors = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/sensors.json'), 'utf-8'));
const outDir = path.join(__dirname, '../public/images/sensors');
fs.mkdirSync(outDir, { recursive: true });

// Specific search queries tailored for accurate electronics module photos
const QUERY_MAP = {
  "SEN-001": "infrared obstacle avoidance sensor module",
  "SEN-002": "flame sensor module",
  "SEN-003": "TSOP infrared sensor",
  "SEN-004": "infrared remote control receiver module",
  "SEN-005": "photoresistor LDR sensor module",
  "SEN-006": "TSOP1738 infrared receiver",
  "SEN-007": "TCRT5000 infrared reflective sensor",
  "SEN-008": "5 channel line tracking sensor module",
  "SEN-009": "laser receiver sensor module",
  "SEN-010": "eye blink sensor module",
  "SEN-011": "HC-SR04 ultrasonic sensor",
  "SEN-012": "JSN-SR04T waterproof ultrasonic",
  "SEN-013": "rain drops sensor module",
  "SEN-014": "capacitive soil moisture sensor",
  "SEN-015": "soil moisture sensor module",
  "SEN-016": "water level sensor module",
  "SEN-017": "DHT11 temperature humidity sensor",
  "SEN-018": "DHT22 temperature humidity sensor",
  "SEN-019": "HC-SR501 PIR motion sensor",
  "SEN-020": "TTP223 touch sensor module",
  "SEN-021": "sound detection sensor module",
  "SEN-022": "microphone sound sensor module",
  "SEN-023": "slot type optical speed sensor module",
  "SEN-024": "LM393 speed sensor module",
  "SEN-025": "MQ-2 smoke gas sensor module",
  "SEN-026": "MQ-3 alcohol sensor module",
  "SEN-027": "MQ-4 methane sensor module",
  "SEN-028": "MQ-6 LPG gas sensor module",
  "SEN-029": "MQ-7 carbon monoxide sensor module",
  "SEN-030": "MQ-135 air quality sensor module",
  "SEN-031": "SW-520D tilt ball switch sensor",
  "SEN-032": "SW-420 vibration sensor module",
  "SEN-034": "LJ12A3 inductive proximity sensor",
  "SEN-035": "TSL2561 digital luminosity sensor",
  "SEN-036": "HTU21D temperature humidity sensor module",
  "SEN-037": "HMC5883L 3-axis compass module",
  "SEN-038": "BH1750 ambient light sensor",
  "SEN-039": "ADXL345 3-axis accelerometer module",
  "SEN-040": "MPU-6050 accelerometer gyroscope module",
  "SEN-041": "MAX30100 pulse oximeter module",
  "SEN-042": "MAX30102 pulse oximeter module",
  "SEN-043": "BMP180 digital barometric pressure sensor",
  "SEN-044": "BMP280 barometric pressure sensor",
  "SEN-045": "pulse sensor heart rate amped",
  "SEN-046": "AD8232 ECG heart monitor module",
  "SEN-048": "MAX6675 thermocouple temperature sensor",
  "SEN-049": "APDS-9960 RGB gesture sensor module",
  "SEN-050": "reed switch magnetic door sensor module",
  "SEN-051": "HX710 air pressure sensor module",
  "SEN-052": "YF-S201 water flow sensor",
  "SEN-053": "metal detector sensor module",
  "SEN-054": "ZMPT101B AC voltage sensor module",
  "SEN-055": "voltage detection sensor module 0-25V",
  "SEN-056": "ZMCT103C AC current transformer module",
  "SEN-057": "ACS712 current sensor module",
  "SEN-058": "INA219 current power monitor module",
  "SEN-059": "ACS712 20A current sensor",
  "SEN-060": "ACS712 30A current sensor",
  "SEN-061": "TCS3200 color recognition sensor",
  "SEN-063": "GP2Y1010AU0F optical dust sensor",
  "SEN-065": "electret microphone amplifier module",
  "SEN-066": "infrared LED photodiode pair",
  "SEN-068": "photodiode light sensor",
  "SEN-069": "FSR406 force sensing resistor square",
  "SEN-070": "FSR402 force sensitive resistor circular",
  "SEN-071": "FSR400 force sensitive resistor",
  "SEN-072": "flex sensor 2.2 bend sensor",
  "SEN-073": "NTC thermistor 10K",
  "SEN-074": "LM35 linear temperature sensor",
  "SEN-075": "DS18B20 waterproof temperature probe",
  "SEN-076": "DS18B20 digital temperature module",
  "SEN-077": "photoresistor LDR 5mm",
  "SEN-078": "photoresistor LDR 12mm",
  "SEN-079": "TSOP1738 IR receiver diode",
  "SEN-080": "TSOP1738 metal receiver",
  "SEN-081": "load cell strain gauge 5kg",
  "SEN-082": "load cell strain gauge 10kg",
  "SEN-083": "load cell strain gauge 50kg half bridge",
  "SEN-084": "piezoelectric buzzer element 35mm",
  "SEN-085": "piezoelectric buzzer element 35mm",
  "SEN-086": "piezoelectric buzzer element 27mm",
  "SEN-087": "hall effect magnetic sensor module",
  "SEN-088": "AS608 optical fingerprint reader module",
  "SEN-089": "TTP223 1 channel touch sensor",
  "SEN-090": "TTP224 4 channel capacitive touch switch",
  "SEN-091": "8 channel capacitive touch module",
  "SEN-092": "touch sensor dimmer switch module",
  "SEN-093": "E18-D80NK infrared proximity sensor",
  "SEN-095": "MQ-2 gas sensor tube bare",
  "SEN-096": "MQ-3 alcohol gas sensor tube",
  "SEN-098": "MQ-6 gas sensor tube",
  "SEN-099": "RCWL-0516 microwave radar sensor",
};

async function fetchThumbnailUrl(searchTerm) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(searchTerm)}&prop=imageinfo&iiprop=url&iiurlwidth=320&format=json`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'ElectronicsGuide/1.0 (https://electronics-guide.vercel.app)' }
    });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return null;

    // Filter out svgs, pdfs, diagrams that are not photos if possible
    const candidates = Object.values(pages)
      .map(p => p.imageinfo?.[0])
      .filter(Boolean)
      .filter(info => {
        const u = info.thumburl || info.url || '';
        return !u.endsWith('.pdf') && !u.endsWith('.ogv') && !u.endsWith('.webm');
      });

    if (candidates.length === 0) return null;
    return candidates[0].thumburl || candidates[0].url;
  } catch (err) {
    return null;
  }
}

async function downloadImage(imgUrl, destPath) {
  try {
    const res = await fetch(imgUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    if (!res.ok) return false;
    const arrayBuffer = await res.arrayBuffer();
    if (arrayBuffer.byteLength < 500) return false; // Too small or error page
    fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
    return true;
  } catch (err) {
    return false;
  }
}

async function main() {
  console.log(`Starting sensor image fetch for ${sensors.length} sensors...`);
  let downloadedCount = 0;

  for (let i = 0; i < sensors.length; i++) {
    const s = sensors[i];
    const dest = path.join(outDir, `${s.sku}.jpg`);
    const relPath = `/images/sensors/${s.sku}.jpg`;

    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      s.image = relPath;
      downloadedCount++;
      continue;
    }

    const query = QUERY_MAP[s.sku] || s.name;
    const thumbUrl = await fetchThumbnailUrl(query);

    if (thumbUrl) {
      const ok = await downloadImage(thumbUrl, dest);
      if (ok) {
        s.image = relPath;
        downloadedCount++;
        console.log(`[${i + 1}/${sensors.length}] ✓ ${s.sku} (${s.name})`);
      } else {
        console.log(`[${i + 1}/${sensors.length}] ✗ ${s.sku} download failed`);
      }
    } else {
      console.log(`[${i + 1}/${sensors.length}] - ${s.sku} no Wikimedia image found for "${query}"`);
    }

    // Small delay to be polite to Wikipedia API
    await new Promise(r => setTimeout(r, 150));
  }

  // Save updated sensors.json with image field
  fs.writeFileSync(
    path.join(__dirname, '../src/data/sensors.json'),
    JSON.stringify(sensors, null, 2),
    'utf-8'
  );

  console.log(`\nDone! Successfully fetched & assigned images for ${downloadedCount}/${sensors.length} sensors.`);
}

main().catch(console.error);
