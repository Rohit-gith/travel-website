#!/usr/bin/env node
/**
 * JPG / JPEG / PNG  ->  WebP converter
 *
 * Kya karta hai:
 *   1. public/ aur src/assets/ ke saare .jpg .jpeg .png images ko .webp me convert karta hai
 *   2. Convert hone ke baad PURANI image delete kar deta hai (sirf tab, jab webp sahi se ban gayi ho)
 *   3. Code me jahan jahan purani image ka naam likha hai (src/, index.html) use .webp me badal deta hai
 *      jaise  /logo.jpeg -> /logo.webp   aur  /images/owner.jpeg -> /images/owner.webp
 *
 * Chalane ka tareeka (project ke root folder me):
 *   npm install -D sharp        (sirf pehli baar)
 *   npm run images:webp         (convert + delete + code update)
 *   npm run images:webp -- --dry-run     (sirf dikhata hai, kuch badalta nahi)
 *
 * Options:
 *   --dry-run           kuch change nahi karega, sirf report dikhayega
 *   --quality=80        webp quality 1-100 (default 80)
 *   --max-width=2400    isse badi image ko chhota kar deta hai (default 2400, 0 = resize nahi)
 *   --dir=public        sirf is folder ko scan karo (kayi baar de sakte ho: --dir=public --dir=src/assets)
 *   --keep-originals    purani images delete NA karo
 *   --force             webp badi ho tab bhi rakho (default: badi ho to purani image hi rakhi jati hai)
 *
 * Dhyan: delete wapas nahi hota. Chalane se pehle git commit kar lo ya folder ka backup rakh lo.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let sharp;
try {
  ({ default: sharp } = await import('sharp'));
} catch {
  console.error('\n"sharp" install nahi hai. Pehle ye chalao:\n\n    npm install -D sharp\n');
  process.exit(1);
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// ---------- options ----------
const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const value = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=')[1] : fallback;
};

const DRY_RUN = flag('dry-run');
const KEEP_ORIGINALS = flag('keep-originals');
const FORCE = flag('force');
const QUALITY = Math.min(100, Math.max(1, Number(value('quality', 80))));
const MAX_WIDTH = Number(value('max-width', 2400));
const SCAN_DIRS = args.filter((a) => a.startsWith('--dir=')).map((a) => a.split('=')[1]);
if (SCAN_DIRS.length === 0) SCAN_DIRS.push('public', 'src/assets');

// Inhe convert nahi karna (browsers/apps inke liye webp support nahi karte)
const SKIP_NAMES = [/^apple-touch-icon/i, /^og-image/i, /^og_image/i, /^twitter-image/i, /^favicon\.(png|jpe?g)$/i];

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png']);
const TEXT_EXT = new Set(['.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.json', '.md', '.svg']);
const IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', 'build']);

// ---------- helpers ----------
const exists = async (p) => !!(await fs.stat(p).catch(() => null));
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

async function walk(dir, exts) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const e of entries) {
    if (IGNORE_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full, exts)));
    else if (exts.has(path.extname(e.name).toLowerCase())) out.push(full);
  }
  return out;
}

// ---------- 1) images dhundo ----------
const images = [];
for (const d of SCAN_DIRS) images.push(...(await walk(path.join(ROOT, d), IMAGE_EXT)));

if (images.length === 0) {
  console.log(`Koi jpg / jpeg / png image nahi mili (${SCAN_DIRS.join(', ')} me). Kuch karna nahi hai.`);
  process.exit(0);
}

console.log(`\n${DRY_RUN ? '[DRY RUN] ' : ''}${images.length} image(s) mili. Quality ${QUALITY}, max width ${MAX_WIDTH || 'no limit'}\n`);

// Same folder me same naam ki do images (logo.jpg + logo.png) dono logo.webp banti: conflict
const targets = new Map();
for (const img of images) {
  const target = img.replace(/\.(jpe?g|png)$/i, '.webp');
  targets.set(target, [...(targets.get(target) || []), img]);
}

// ---------- 2) convert + delete ----------
const converted = []; // { from, to }
let savedBytes = 0;
let before = 0;
let after = 0;

for (const img of images) {
  const name = path.basename(img);
  const target = img.replace(/\.(jpe?g|png)$/i, '.webp');

  if (SKIP_NAMES.some((re) => re.test(name))) {
    console.log(`  skip      ${rel(img)}  (is naam ki file webp me nahi badalte)`);
    continue;
  }
  if (targets.get(target).length > 1) {
    console.log(`  CONFLICT  ${rel(img)}  (isi naam ki dusri image bhi hai, skip kiya. Ek ka naam badal do)`);
    continue;
  }

  const originalSize = (await fs.stat(img)).size;
  try {
    let pipeline = sharp(img, { failOn: 'none' }).rotate(); // phone photos ki rotation sahi rakhta hai
    if (MAX_WIDTH > 0) pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
    const buffer = await pipeline.webp({ quality: QUALITY, effort: 5 }).toBuffer();

    if (buffer.length === 0) throw new Error('webp khali bani');

    if (buffer.length >= originalSize && !FORCE) {
      console.log(`  keep      ${rel(img)}  (webp badi hoti: ${kb(originalSize)} -> ${kb(buffer.length)}, isliye purani hi rakhi)`);
      continue;
    }

    const pct = Math.round((1 - buffer.length / originalSize) * 100);
    console.log(`  ok        ${rel(img)}  ${kb(originalSize)} -> ${kb(buffer.length)}  (-${pct}%)`);
    before += originalSize;
    after += buffer.length;
    savedBytes += originalSize - buffer.length;

    if (!DRY_RUN) {
      await fs.writeFile(target, buffer);
      // Delete se pehle check: webp file sach me disk par hai aur khali nahi
      const check = await fs.stat(target);
      if (check.size === 0) throw new Error('webp save nahi hui');
      if (!KEEP_ORIGINALS) await fs.unlink(img);
    }
    converted.push({ from: img, to: target });
  } catch (err) {
    console.log(`  FAILED    ${rel(img)}  -> ${err.message}  (purani image safe hai, delete nahi hui)`);
  }
}

// ---------- 3) code me naam badlo ----------
let filesUpdated = 0;
if (converted.length > 0) {
  const textFiles = [path.join(ROOT, 'index.html')];
  textFiles.push(...(await walk(path.join(ROOT, 'src'), TEXT_EXT)));
  textFiles.push(...(await walk(path.join(ROOT, 'public'), TEXT_EXT)));

  console.log('\nCode me image ke naam update ho rahe hain...');
  for (const file of textFiles) {
    if (!(await exists(file))) continue;
    let text = await fs.readFile(file, 'utf8');
    const original = text;

    for (const { from } of converted) {
      const ext = path.extname(from).slice(1);
      const base = path.basename(from, path.extname(from));
      // sirf poora filename match karo: owner.jpeg (na ki my-owner.jpeg ka hissa)
      const re = new RegExp(`(?<![\\w.-])${escapeRe(base)}\\.${ext}(?![\\w])`, 'gi');
      text = text.replace(re, `${base}.webp`);
    }

    // <link rel="icon" type="image/jpeg"> jaisi line me type bhi webp karo
    if (file.endsWith('index.html')) {
      text = text.replace(/(<link[^>]*rel=["']icon["'][^>]*type=["'])image\/(jpeg|png)(["'][^>]*\.webp)/gi, '$1image/webp$3');
      text = text.replace(/(<link[^>]*type=["'])image\/(jpeg|png)(["'][^>]*rel=["']icon["'][^>]*\.webp)/gi, '$1image/webp$3');
    }

    if (text !== original) {
      filesUpdated += 1;
      console.log(`  updated   ${rel(file)}`);
      if (!DRY_RUN) await fs.writeFile(file, text);
    }
  }
  if (filesUpdated === 0) console.log('  (kisi code file me badlav ki zarurat nahi padi)');
}

// ---------- 4) report ----------
console.log('\n----------------------------------------');
console.log(`${DRY_RUN ? '[DRY RUN - kuch change nahi hua]\n' : ''}Convert hui images : ${converted.length} / ${images.length}`);
if (converted.length > 0) {
  console.log(`Pehle size         : ${kb(before)}`);
  console.log(`Ab size            : ${kb(after)}`);
  console.log(`Total bachat       : ${kb(savedBytes)}  (${Math.round((savedBytes / before) * 100)}%)`);
  console.log(`Purani images      : ${DRY_RUN ? 'delete NAHI hui (dry run)' : KEEP_ORIGINALS ? 'rakhi gayi (--keep-originals)' : 'delete ho gayi'}`);
}
console.log('----------------------------------------\n');
