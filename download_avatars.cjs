const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const users = JSON.parse(fs.readFileSync('src/tiktok-users.json', 'utf-8'));

if (!fs.existsSync('public/users')) {
  fs.mkdirSync('public/users', { recursive: true });
}

function downloadUrl(url, destPath) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(destPath);
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, { timeout: 15000, headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
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
      const contentType = res.headers['content-type'] || '';
      if (!contentType.startsWith('image/')) {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        return resolve(false);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(destPath);
        if (stats.size < 100) {
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
  let success = 0;
  let fail = 0;

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const destName = '@' + user.username + '.jpg';
    const destPath = path.join('public', 'users', destName);

    process.stdout.write(`[${i+1}/${users.length}] @${user.username}... `);

    try {
      const avatarUrl = `https://unavatar.io/tiktok/${user.username}`;
      const ok = await downloadUrl(avatarUrl, destPath);
      if (ok) {
        user.avatar = '/users/' + destName;
        success++;
        console.log('OK');
      } else {
        console.log('FAILED');
        fail++;
      }
    } catch (e) {
      console.log('ERROR: ' + e.message);
      fail++;
    }

    await new Promise(r => setTimeout(r, 300));
  }

  fs.writeFileSync('src/tiktok-users.json', JSON.stringify(users, null, 2), 'utf-8');
  console.log(`\nDone! Success: ${success}, Failed: ${fail}`);
}

main().catch(console.error);
