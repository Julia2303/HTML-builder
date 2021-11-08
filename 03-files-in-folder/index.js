const fs = require('fs');
const path = require('path');
const dirPath = path.join(__dirname, 'secret-folder');

async function getFiles() {
  try {
    const files = await fs.promises.readdir(dirPath, { withFileTypes: true });
    for (let file of files) {
      if (file.isFile()) {
        const name = file.name.split('.')[0];
        const filePath = path.join(dirPath, file.name);
        const ext = path.extname(filePath).slice(1);
        const stat = await fs.promises.stat(filePath);
        const size = `${(stat.size / 1024).toFixed(3)}kb`;

        console.log(`${name} - ${ext} - ${size}`);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

getFiles();
