let articles = [];
const grid = document.getElementById("articleGrid");
const searchInput = document.getElementById("searchInput");
const categoryButtons = [...document.querySelectorAll(".category")];
const emptyState = document.getElementById("emptyState");
let activeCategory = "All";
let showAll = false;

function escapeHTML(value){return String(value ?? "").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderArticles(){
  const term = searchInput.value.trim().toLowerCase();
  const filtered = articles.filter(a => (activeCategory==="All" || a.category===activeCategory) && `${a.title} ${a.excerpt} ${a.category} ${a.body}`.toLowerCase().includes(term));
  const visible = showAll ? filtered : filtered.slice(0,3);
  grid.innerHTML = visible.map(a=>`<article class="article-card">
    <img class="article-image" src="${escapeHTML(a.image)}" alt="${escapeHTML(a.imageAlt || a.title)}" loading="lazy" onerror="this.style.display='none'">
    <div class="article-body"><div class="article-meta"><span class="article-category">${escapeHTML(a.category)}</span><span>•</span><span>${escapeHTML(a.dateLabel || a.date || "Article")}</span></div>
    <h3>${escapeHTML(a.title)}</h3><p>${escapeHTML(a.excerpt)}</p>
    <div class="article-actions"><button class="read-link" data-read="${escapeHTML(a.id)}">Read article <span>→</span></button><button class="share-link" data-share="${escapeHTML(a.id)}" aria-label="Share ${escapeHTML(a.title)}">Share ↗</button></div></div></article>`).join("");
  emptyState.hidden = visible.length !== 0;
  document.getElementById("showAllBtn").hidden = filtered.length <= 3 || showAll;
  grid.querySelectorAll("[data-read]").forEach(btn=>btn.addEventListener("click",()=>openArticle(btn.dataset.read)));
  grid.querySelectorAll("[data-share]").forEach(btn=>btn.addEventListener("click",()=>shareArticle(btn.dataset.share)));
}
function articleUrl(a){return `${location.href.split("#")[0]}#article-${encodeURIComponent(a.id)}`;}
function shareArticle(id){
  const a=articles.find(item=>String(item.id)===String(id)); if(!a)return;
  const url=articleUrl(a);
  if(navigator.share){navigator.share({title:a.title,text:a.excerpt,url}).catch(()=>{});}
  else {window.open(`https://wa.me/?text=${encodeURIComponent(a.title+" — "+a.excerpt+" "+url)}`,"_blank","noopener");}
}
function openArticle(id){
  const a=articles.find(item=>String(item.id)===String(id));if(!a)return;
  let modal=document.getElementById("articleModal");
  if(!modal){
    modal=document.createElement("div");modal.id="articleModal";modal.className="article-modal";
    modal.innerHTML='<div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><button class="modal-close" aria-label="Close article">×</button><div id="modalContent"></div></div>';
    document.body.appendChild(modal);
    modal.addEventListener("click",e=>{if(e.target===modal||e.target.closest(".modal-close"))modal.classList.remove("open");});
    document.addEventListener("keydown",e=>{if(e.key==="Escape")modal.classList.remove("open");});
  }
  const paragraphs=String(a.body||"").split(/\n\s*\n/).filter(Boolean);
  document.getElementById("modalContent").innerHTML=`<p class="eyebrow">${escapeHTML(a.category)} · ${escapeHTML(a.dateLabel || a.date || "")}</p><h2 id="modalTitle">${escapeHTML(a.title)}</h2><img src="${escapeHTML(a.image)}" alt="${escapeHTML(a.imageAlt || a.title)}"><p><strong>${escapeHTML(a.excerpt)}</strong></p>${paragraphs.map(p=>`<p>${escapeHTML(p)}</p>`).join("")}<div class="modal-share"><button id="modalShareButton">Share this article ↗</button><a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl(a))}" target="_blank" rel="noopener">Share on Facebook</a><a href="https://wa.me/?text=${encodeURIComponent(a.title+" "+articleUrl(a))}" target="_blank" rel="noopener">Share on WhatsApp</a></div>`;
  document.getElementById("modalShareButton").addEventListener("click",()=>shareArticle(id));
  modal.classList.add("open");modal.querySelector(".modal-close").focus();
}
searchInput.addEventListener("input",()=>{showAll=true;renderArticles();});
categoryButtons.forEach(btn=>btn.addEventListener("click",()=>{activeCategory=btn.dataset.category;showAll=false;categoryButtons.forEach(b=>b.classList.toggle("active",b===btn));renderArticles();}));
document.getElementById("showAllBtn").addEventListener("click",()=>{showAll=true;renderArticles();});
document.getElementById("menuToggle").addEventListener("click",()=>{const nav=document.getElementById("mainNav");const opened=nav.classList.toggle("open");document.getElementById("menuToggle").setAttribute("aria-expanded",String(opened));});
document.getElementById("year").textContent=new Date().getFullYear();
document.getElementById("today").textContent=new Date().toLocaleDateString(undefined,{weekday:"short",year:"numeric",month:"short",day:"numeric"}).toUpperCase();
fetch("articles.json").then(r=>{if(!r.ok)throw new Error("Could not load article data");return r.json();}).then(data=>{articles=data.filter(a=>a.published!==false);renderArticles();}).catch(err=>{grid.innerHTML='<p class="empty-state">Articles could not be loaded. Please refresh the page or check the deployment.</p>';console.error(err);});
