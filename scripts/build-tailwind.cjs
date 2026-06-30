const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const tailwind = require('@tailwindcss/postcss');
const autoprefixer = require('autoprefixer');

const inputPath = path.resolve('src/index.css');
const outputPath = path.resolve('dist/tailwind.css');

(async () => {
  try {
    const input = fs.readFileSync(inputPath, 'utf8');
    const result = await postcss([tailwind(), autoprefixer()]).process(input, { from: inputPath });
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, result.css, 'utf8');
    console.log('Wrote', outputPath);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
