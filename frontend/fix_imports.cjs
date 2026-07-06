const fs = require('fs');
const path = require('path');

const walk = (dir, callback) => {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
};

walk('./src/pages', (filePath) => {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Fix imports in member and admin directories which are 2 levels deep
    if (filePath.includes('/member/') || filePath.includes('/admin/')) {
      content = content.replace(/from '\.\.\/\.\.\/common/g, "from '../../components/common");
      content = content.replace(/from "\.\.\/\.\.\/common/g, 'from "../../components/common');
      content = content.replace(/from '\.\.\/\.\.\/\.\.\/services/g, "from '../../services");
      content = content.replace(/from "\.\.\/\.\.\/\.\.\/services/g, 'from "../../services');
    }
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed', filePath);
    }
  }
});
