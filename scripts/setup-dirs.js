const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(process.cwd(), 'public', 'products'),
  path.join(process.cwd(), 'data')
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log('Created directory:', dir);
  } else {
    console.log('Directory already exists:', dir);
  }
});
