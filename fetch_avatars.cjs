const https = require('https');
const fs = require('fs');
const path = require('path');

const users = JSON.parse(fs.readFileSync('src/tiktok-users.json', 'utf-8'));

if (!fs.existsSync('public/users')) {
  fs.mkdirSync('public/users', { recursive: true });
}

function fetchUserPage(username) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.tiktok.com',
      path: '/@' + username,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      timeout: 10000
    };
    const req = https.get(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const patterns = [
          /<meta[^>]+property="og:image"[^>]+content="([^"]+)"[^>]*>/i,
          /"avatarLarger":"([^"]+)"/,
          /"avatarMedium":"([^"]+)"/,
          /"avatarThumb":"([^"]+)"/
        ];
        for (const p of patterns) {
          const m = data.match(p);
          if (m && m[1]) {
            resolve(m[1].replace(/\\u002F/g, '/').replace(/\\\\u002F/g, '/'));
            return;
          }
        }
        resolve(null);
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); resolve(null); });
    req.end();
  });
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    if (!url) return resolve(false);
    const file = fs.createWriteStream(destPath);
    https.get(url, { timeout: 10000 }, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        return resolve(false);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      resolve(false);
    }).on('timeout', () => {
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
    
    process.stdout.write(`[${i+1}/${users.length}] ${user.username}... `);
    
    try {
      const avatarUrl = await fetchUserPage(user.username);
      if (avatarUrl) {
        const downloaded = await downloadImage(avatarUrl, destPath);
        if (downloaded) {
          user.avatar = '/users/' + destName;
          success++;
          console.log('OK');
        } else {
          console.log('DOWNLOAD FAILED: ' + (avatarUrl ? avatarUrl.substring(0, 60) : 'null'));
          fail++;
        }
      } else {
        console.log('NO AVATAR FOUND');
        fail++;
      }
    } catch (e) {
      console.log('ERROR: ' + e.message);
      fail++;
    }
    
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 500));
  }

  fs.writeFileSync('src/tiktok-users.json', JSON.stringify(users, null, 2), 'utf-8');
  console.log('\nDone! Success: ' + success + ', Failed: ' + fail);
}

main().catch(console.error);
