const https = require('https');
const fs = require('fs');
const path = require('path');

const users = JSON.parse(fs.readFileSync('src/tiktok-users.json', 'utf-8'));

const existing = new Set();
if (fs.existsSync('public/avatar')) {
  fs.readdirSync('public/avatar').forEach(f => {
    const dot = f.lastIndexOf('.');
    if (dot > 0) existing.add(f.substring(1, dot));
  });
}

const faltando = users.filter(u => !existing.has(u.username));
console.log('Faltando:', faltando.length);

if (!fs.existsSync('public/avatar')) fs.mkdirSync('public/avatar', { recursive: true });

function download(url, dest) {
  return new Promise(resolve => {
    const file = fs.createWriteStream(dest);
    https.get(url, { timeout: 20000, headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close(); if (fs.existsSync(dest)) fs.unlinkSync(dest);
        download(res.headers.location, dest).then(resolve); return;
      }
      if (res.statusCode !== 200) { file.close(); if (fs.existsSync(dest)) fs.unlinkSync(dest); resolve(false); return; }
      const ct = res.headers['content-type'] || '';
      if (!ct.startsWith('image/')) { file.close(); if (fs.existsSync(dest)) fs.unlinkSync(dest); resolve(false); return; }
      res.pipe(file);
      file.on('finish', () => { file.close(); const st = fs.statSync(dest); if (st.size < 2000) { fs.unlinkSync(dest); resolve(false); } else resolve(true); });
    }).on('error', () => { file.close(); if (fs.existsSync(dest)) fs.unlinkSync(dest); resolve(false); });
  });
}

(async () => {
  for (let i = 0; i < faltando.length; i++) {
    const u = faltando[i];
    const dest = path.join('public/avatar', '@' + u.username + '.png');
    process.stdout.write(`[${i+1}/${faltando.length}] @${u.username}... `);
    const ok = await download('https://unavatar.io/tiktok/' + u.username, dest);
    if (ok) {
      u.avatar = '/avatar/@' + u.username + '.png';
      console.log('OK');
    } else {
      console.log('FALHOU');
    }
    if (i < faltando.length - 1) {
      console.log('  (5s)');
      await new Promise(r => setTimeout(r, 5000));
    }
  }
  fs.writeFileSync('src/tiktok-users.json', JSON.stringify(users, null, 2), 'utf-8');
  const final = fs.readdirSync('public/avatar').length;
  console.log('\nFinal: ' + final + '/99 avatars');
})();
