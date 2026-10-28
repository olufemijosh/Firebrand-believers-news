// Small dependency-free build script for Netlify (Node.js).
// Converts content/posts/*.md into articles.json and copies public files to dist/.
const fs = require("fs");
const path = require("path");
const root = __dirname;
const out = path.join(root, "dist");
const postsDir = path.join(root, "content", "posts");
fs.rmSync(out, {recursive:true, force:true});
fs.mkdirSync(out, {recursive:true});
for (const name of ["index.html","styles.css","script.js"]) {
  fs.copyFileSync(path.join(root,name), path.join(out,name));
}
const media = path.join(root,"media");
if (fs.existsSync(media)) fs.cpSync(media,path.join(out,"media"),{recursive:true});
function parseScalar(value) {
  value = value.trim();
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) return value.slice(1,-1).replace(/\\"/g,'"');
  return value;
}
function parseMarkdown(file) {
  const raw = fs.readFileSync(file,"utf8").replace(/\r\n/g,"\n");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`Missing front matter in ${file}`);
  const meta = {};
  for (const line of match[1].split("\n")) {
    const m = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (m) meta[m[1]] = parseScalar(m[2]);
  }
  const body = match[2].trim().replace(/!\[([^\]]*)\]\(([^)]+)\)/g,"$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g,"$1")
    .replace(/^#{1,6}\s+/gm,"")
    .replace(/^\s*[-*]\s+/gm,"")
    .replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1");
  const slug = path.basename(file, ".md");
  return {id:slug, slug, title:meta.title||slug, category:meta.category||"Faith", date:meta.date||"", dateLabel:meta.date||"", excerpt:meta.excerpt||"", image:normalizeImage(meta.image||""), imageAlt:meta.imageAlt||meta.title||"", published:meta.published!==false, body};
}
function normalizeImage(image) {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  return image.startsWith("/") ? image : "/" + image.replace(/^\.?\//,"");
}
const files = fs.readdirSync(postsDir).filter(f=>f.endsWith(".md")).sort();
const articles = files.map(f=>parseMarkdown(path.join(postsDir,f))).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
fs.writeFileSync(path.join(out,"articles.json"),JSON.stringify(articles,null,2));
console.log(`Built ${articles.length} articles into dist/`);
