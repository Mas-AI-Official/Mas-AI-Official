const fs = require('fs')
const path = require('path')

const outDir = path.join(__dirname, '..', 'out')

const filesToCopy = ['CNAME', '.nojekyll', 'robots.txt', 'sitemap.xml']

filesToCopy.forEach(file => {
  const src = path.join(__dirname, '..', file)
  const dest = path.join(outDir, file)
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest)
    console.log(`Copied ${file} to out/`)
  }
})

// Also copy public CNAME and .nojekyll if they exist in public/
const publicFiles = ['CNAME', '.nojekyll']
publicFiles.forEach(file => {
  const src = path.join(__dirname, '..', 'public', file)
  const dest = path.join(outDir, file)
  if (fs.existsSync(src) && !fs.existsSync(dest)) {
    fs.copyFileSync(src, dest)
    console.log(`Copied public/${file} to out/`)
  }
})
