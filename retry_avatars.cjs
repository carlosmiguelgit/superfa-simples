const https = require('https');
const fs = require('fs');
const path = require('path');

const users = JSON.parse(fs.readFileSync('src/tiktok-users.json', 'utf-8'));

const existingFiles = new Map();
if (fs.existsSync('public/users')) {
  fs.readdirSync('public/users').forEach(f => {
    const dot = f.lastIndexOf('.');
    if (dot > 0) existingFiles.set(f.substring(1, dot), fs.statSync('public/users/' + f).size);
  });
}

const toRetry = users.filter(u => {
  const size = existingFiles.get(u.username);
  return !size || size < 5000;
});

if (!fs.existsSync('public/users')) {
  fs.mkdirSync('public/users', { recursive: true });
}

console.log(`Retrying ${toRetry.length} users...\n`);

function downloadUrl(url, destPath) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, { timeout: 20000, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        downloadUrl(res.headers.location, destPath).then(resolve);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        return resolve(false);
      }
      const ct = res.headers['content-type'] || '';
      if (!ct.startsWith('image/')) {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        return resolve(false);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        const st = fs.statSync(destPath);
        if (st.size < 5000) {
          fs.unlinkSync(destPath);
          return resolve(false);
        }
        resolve(true);
      });
    }).on('error', () => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      resolve(false);
    });
  });
}

async function main() {
  let ok = 0;
  let fail = 0;

  for (let i = 0; i < toRetry.length; i++) {
    const user = toRetry[i];
    const destName = '@' + user.username + '.jpg';
    const destPath = path.join('public', 'users', destName);

    process.stdout.write(`[${i+1}/${toRetry.length}] @${user.username}... `);

    try {
      const avatarUrl = 'https://unavatar.io/tiktok/' + user.username;
      const result = await downloadUrl(avatarUrl, destPath);
      if (result) {
        user.avatar = '/users/' + destName;
        ok++;
        console.log('OK');
      } else {
        console.log('FAILED');
        fail++;
      }
    } catch (e) {
      console.log('ERROR: ' + e.message);
      fail++;
    }

    if (i < toRetry.length - 1) {
      console.log('  Waiting 5s...');
      await new Promise(r => setTimeout(r, 5000));
    }
  }

  fs.writeFileSync('src/tiktok-users.json', JSON.stringify(users, null, 2), 'utf-8');
  console.log(`\nDone! Success: ${ok}, Failed: ${fail}`);
}

main().catch(console.error);
