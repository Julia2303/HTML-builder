const fs = require('fs');
const path = require('path');

const projectDirPath = path.join(__dirname, 'project-dist');
const stylesDirPath = path.join(__dirname, 'styles');
const newStylesDirPath = path.join(projectDirPath, 'style.css');
const assetsDirPath = path.join(__dirname, 'assets');
const newAssetsDirPath = path.join(projectDirPath, 'assets');
const templatePath = path.join(__dirname, 'template.html');
const newHtmlPath = path.join(projectDirPath, 'index.html');
const componentsPath = path.join(__dirname, 'components');

async function buildPage() {
  try {
    await fs.promises.rm(projectDirPath, { recursive: true, force: true });

    await fs.promises.mkdir(projectDirPath, { recursive: true });
    
    // create index.html
    
    let htmlData = await fs.promises.readFile(templatePath, 'utf-8');

    const components = await fs.promises.readdir(componentsPath);
    for (let component of components) {
      const componentPath = path.join(componentsPath, component);
      if (path.extname(componentPath).slice(1) === 'html') {
        const componentData = await fs.promises.readFile(componentPath, 'utf-8');
        const componentName = component.split('.')[0];
        const regex = new RegExp(`{{${componentName}}}`, 'gi');
        htmlData = htmlData.replace(regex, componentData);
        await fs.promises.writeFile(newHtmlPath, htmlData);
      }  
    }

    // create style.css
    const files = await fs.promises.readdir(stylesDirPath, {withFileTypes: true});
    for (let file of files) {
      const filePath = path.join(stylesDirPath, file.name);
      const ext = path.extname(filePath).slice(1);
      if (file.isFile() && ext === 'css') {
        const readableStream = fs.createReadStream(filePath, 'utf-8');
        readableStream.on('data', chunk => {
          fs.promises.appendFile(newStylesDirPath, chunk);
        });
      }
    }
    
    // create assets
    await fs.promises.mkdir(newAssetsDirPath, { recursive: true });
    
    const items = await fs.promises.readdir(assetsDirPath);
    for (let item of items) {
      await fs.promises.mkdir(path.join(newAssetsDirPath, item), { recursive: true });
      const files = await fs.promises.readdir(path.join(assetsDirPath, item));
      for (let file of files) {
        await fs.promises.copyFile(
          path.join(assetsDirPath, item, file),
          path.join(newAssetsDirPath, item, file)
        );
      }
    }
  } catch (err) {
    console.log(err);
  }
}

buildPage();
