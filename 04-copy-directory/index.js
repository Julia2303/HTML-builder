const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'files');
const copyDirPath = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    await fs.promises.rm(copyDirPath, { recursive: true, force: true });

    await fs.promises.mkdir(copyDirPath, { recursive: true });
    
    const files = await fs.promises.readdir(dirPath);
    for (let file of files) {
      await fs.promises.copyFile(
        path.join(dirPath, file),
        path.join(copyDirPath, file)
      );
    }
  } catch (err) {
    console.log(err);
  }
}

copyDir();
