const fs = require('fs');
const path = require('path');

const stylesDirPath = path.join(__dirname, 'styles');
const newDirPath = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeStyles() {
  
  try {
    await fs.promises.rm(newDirPath, { recursive: true, force: true });

    const files = await fs.promises.readdir(stylesDirPath, {withFileTypes: true});
    for (let file of files) {
      const filePath = path.join(stylesDirPath, file.name);
      const ext = path.extname(filePath).slice(1);
      if (file.isFile() && ext === 'css') {
        const readableStream = await fs.createReadStream(filePath, 'utf-8');
        readableStream.on('data', chunk => {
          fs.promises.appendFile(newDirPath, chunk);
        });
      }
    }
  } catch(err) {
    console.log(err);
  }
  
}

mergeStyles();