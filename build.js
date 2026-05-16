#!/usr/bin/env node

/**
 * LinguaDrill Build Script
 * 合并所有 JavaScript 和 CSS 文件为单个文件
 */

const fs = require('fs');
const path = require('path');

console.log('🔨 开始构建 LinguaDrill...\n');

// 定义文件顺序（确保依赖关系正确）
const jsFiles = [
  'src/utils/i18n.js',
  'src/utils/storage.js',
  'src/utils/speech.js',
  'src/utils/dayLoader.js',
  'src/utils/patternEngine.js',
  'src/components/navigation.js',
  'src/pages/home.js',
  'src/pages/words.js',
  'src/pages/patterns.js',
  'src/pages/shadowing.js',
  'src/pages/progress.js',
  'src/app.js'
];

const cssFiles = [
  'src/styles/main.css',
  'src/styles/navigation.css',
  'src/styles/words.css',
  'src/styles/patterns.css',
  'src/styles/shadowing.css',
  'src/styles/progress.css'
];

// 创建 dist 目录
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 复制 index.html 到 dist
console.log('📄 复制 index.html...');
const indexContent = fs.readFileSync('index.html', 'utf8');
let modifiedIndex = indexContent
  // 移除所有样式引用
  .replace(/<link rel="stylesheet" href="[^"]+">/g, '')
  // 添加合并后的样式（在 </head> 之前）
  .replace('</head>', '  <link rel="stylesheet" href="styles.css">\n</head>')
  // 移除所有脚本引用
  .replace(/<script src="[^"]+"><\/script>/g, '')
  // 添加合并后的脚本（在 </body> 之前）
  .replace('</body>', '  <script src="app.js"></script>\n</body>');
fs.writeFileSync(path.join(distDir, 'index.html'), modifiedIndex);
console.log('✅ index.html 已处理\n');

// 合并 CSS 文件
console.log('🎨 合并 CSS 文件...');
let combinedCSS = '/* LinguaDrill Combined CSS */\n\n';
cssFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    combinedCSS += `/* === ${file} === */\n${content}\n\n`;
    console.log(`  ✓ ${file}`);
  } else {
    console.log(`  ✗ ${file} - 文件不存在`);
  }
});
fs.writeFileSync(path.join(distDir, 'styles.css'), combinedCSS);
console.log('✅ styles.css 已生成\n');

// 合并 JS 文件
console.log('📦 合并 JavaScript 文件...');
let combinedJS = '/* LinguaDrill Combined JavaScript */\n\n';
jsFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    combinedJS += `/* === ${file} === */\n${content}\n\n`;
    console.log(`  ✓ ${file}`);
  } else {
    console.log(`  ✗ ${file} - 文件不存在`);
  }
});
fs.writeFileSync(path.join(distDir, 'app.js'), combinedJS);
console.log('✅ app.js 已生成\n');

// 复制 JSON 数据文件
console.log('📊 复制数据文件...');
const dataDir = path.join(distDir, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (fs.existsSync('src/data/day1.json')) {
  fs.copyFileSync('src/data/day1.json', path.join(dataDir, 'day1.json'));
  console.log('  ✓ src/data/day1.json');
}
if (fs.existsSync('src/data/week1.json')) {
  fs.copyFileSync('src/data/week1.json', path.join(dataDir, 'week1.json'));
  console.log('  ✓ src/data/week1.json');
}
console.log('✅ 数据文件已复制\n');

// 复制配置文件
console.log('⚙️ 复制配置文件...');
const configFiles = ['_headers', '_redirects', '.nojekyll', '.gitignore', 'README.md', 'LICENSE'];
configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(distDir, file));
    console.log(`  ✓ ${file}`);
  }
});
console.log('✅ 配置文件已复制\n');

// 统计
const stats = {
  originalJS: jsFiles.length,
  originalCSS: cssFiles.length,
  combinedJS: (combinedJS.length / 1024).toFixed(2) + ' KB',
  combinedCSS: (combinedCSS.length / 1024).toFixed(2) + ' KB'
};

console.log('='.repeat(50));
console.log('🎉 构建完成！');
console.log('='.repeat(50));
console.log(`📁 输出目录: ${distDir}`);
console.log(`📦 原始 JS 文件: ${stats.originalJS} 个`);
console.log(`🎨 原始 CSS 文件: ${stats.originalCSS} 个`);
console.log(`📜 合并后 JS: ${stats.combinedJS}`);
console.log(`🎨 合并后 CSS: ${stats.combinedCSS}`);
console.log('='.repeat(50));
console.log('\n✨ 现在可以使用 dist 目录部署到 Cloudflare Pages！');
