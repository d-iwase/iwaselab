import { readFile, mkdir, writeFile, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
export const site = JSON.parse(await readFile(path.join(root, 'content/site.json'), 'utf8'));
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link = value => {
  const url = new URL(value);
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error(`Unsupported URL: ${value}`);
  return esc(url.href);
};
const required = ['name','englishName','institution','description','about','researchIntro','address'];
for (const key of required) if (typeof site[key] !== 'string' || !site[key].trim()) throw new Error(`Missing field: ${key}`);
for (const key of ['research','news','members','publications','sources']) if (!Array.isArray(site[key])) throw new Error(`Expected array: ${key}`);
if (!Array.isArray(site.headline) || site.headline.length !== 2) throw new Error('headline must have two lines');
const nav = [['about','研究室について'],['research','研究テーマ'],['news','お知らせ'],['members','メンバー'],['publications','研究業績']];
const heading = (en, jp) => `<div class="section-heading"><p class="eyebrow">${en}</p><h2>${jp}</h2></div>`;
const empty = text => `<p class="empty">${text}</p>`;
const research = site.research.map(r => `<article class="research-card"><div class="card-meta"><span>${esc(r.number)}</span><span>${esc(r.en)}</span></div><h3>${esc(r.title)}</h3><p>${esc(r.text)}</p><ul class="tags">${r.tags.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></article>`).join('');
const news = site.news.length ? `<ul class="news-list">${[...site.news].sort((a,b)=>b.date.localeCompare(a.date)).map(n=>{
  if (!/^\d{4}-\d{2}-\d{2}$/.test(n.date) || !Number.isFinite(Date.parse(n.date))) throw new Error('Invalid news date');
  return `<li><time datetime="${esc(n.date)}">${esc(n.date.replaceAll('-','.'))}</time><span class="news-category">${esc(n.category || 'NEWS')}</span>${n.url ? `<a href="${link(n.url)}">${esc(n.title)} <span aria-hidden="true">↗</span></a>` : `<span>${esc(n.title)}</span>`}</li>`;
}).join('')}</ul>` : empty('お知らせは準備中です．');
const members = site.members.length ? `<div class="member-list">${site.members.map(m=>`<article><p class="eyebrow">${esc(m.role)}</p><h3>${esc(m.name)}</h3>${m.description ? `<p>${esc(m.description)}</p>` : ''}${m.url ? `<a class="text-link" href="${link(m.url)}">プロフィール <span aria-hidden="true">↗</span></a>` : ''}</article>`).join('')}</div>` : empty('メンバー情報は準備中です．');
const pubs = site.publications.length ? `<ol class="publication-list">${site.publications.map(p=>`<li><p class="eyebrow">${esc(p.year)}</p><h3>${p.url ? `<a href="${link(p.url)}">${esc(p.title)} ↗</a>` : esc(p.title)}</h3><p>${esc(p.authors)}<br>${esc(p.venue)}</p></li>`).join('')}</ol>` : empty('研究業績は，掲載情報を確認のうえ順次公開します．');
const html = `<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(site.name)} | ${esc(site.institution)}</title><meta name="description" content="${esc(site.description)}"><meta name="theme-color" content="#143f42"><meta property="og:type" content="website"><meta property="og:locale" content="ja_JP"><meta property="og:title" content="${esc(site.name)} | ${esc(site.institution)}"><meta property="og:description" content="${esc(site.description)}"><link rel="icon" href="./favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="./styles.css"><script src="./app.js" defer></script></head>
<body><a class="skip-link" href="#main">本文へ移動</a><header class="site-header"><a class="brand" href="#home"><span class="brand-mark" aria-hidden="true">S<span>／</span>I</span><span><small>${esc(site.institution)}</small><strong>${esc(site.name)}</strong></span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="navigation">メニュー <span aria-hidden="true">＋</span></button><nav id="navigation" aria-label="メインナビゲーション">${nav.map(([id,label])=>`<a href="#${id}">${label}</a>`).join('')}<a class="nav-contact" href="#access">アクセス <span aria-hidden="true">↗</span></a></nav></header>
<main id="main"><section class="hero" id="home"><div class="hero-copy"><p class="eyebrow">${esc(site.englishName)}</p><h1>${site.headline.map(esc).join('<br>')}</h1><p class="hero-description">${esc(site.description)}</p><a class="primary-link" href="#research">研究テーマを見る <span aria-hidden="true">↘</span></a><p class="hero-foot">YUGE, EHIME <span>／</span> 空間情報から，地域へ．</p></div><div class="hero-art"><canvas id="point-cloud" aria-hidden="true"></canvas><div class="art-top"><span>SPATIAL OBSERVATION</span><span class="live-dot" aria-hidden="true"></span></div><div class="art-bottom"><span>POINT CLOUD<br>CONCEPT VISUALIZATION</span><span aria-hidden="true">X →<br>Y ↑<br>Z ↗</span></div><p class="art-caption">点群をモチーフにした概念図</p></div></section>
<div class="topic-strip" aria-label="研究キーワード"><span>3D MEASUREMENT</span><span>POINT CLOUD</span><span>GIS</span><span>DISASTER PREVENTION</span><span>MAINTENANCE</span></div>
<section class="section about" id="about">${heading('ABOUT US','研究室について')}<div class="section-body"><p class="large-copy">実空間を，情報に．<br>情報を，地域の力に．</p><p>${esc(site.about)}</p><a class="text-link" href="${link(site.schoolUrl)}">${esc(site.institution)} <span aria-hidden="true">↗</span></a></div></section>
<section class="research-section" id="research"><div class="research-intro">${heading('RESEARCH','取り組む研究テーマ')}<p>${esc(site.researchIntro)}</p></div><div class="research-grid">${research}</div><p class="research-note">計測 <span aria-hidden="true">→</span> 処理・解析 <span aria-hidden="true">→</span> 社会への応用</p></section>
<section class="section" id="news">${heading('NEWS','お知らせ')}<div class="section-body">${news}</div></section>
<section class="section" id="members">${heading('MEMBERS','メンバー')}<div class="section-body">${members}</div></section>
<section class="section" id="publications">${heading('PUBLICATIONS','研究業績')}<div class="section-body">${pubs}</div></section>
<section class="access-section" id="access">${heading('ACCESS & CONTACT','アクセス・連絡先')}<div class="access-body"><p class="access-name">${esc(site.institution)}<br><strong>${esc(site.name)}</strong></p><p>${esc(site.address)}</p><div class="access-links"><a href="${link(site.accessUrl)}">学校公式サイト <span aria-hidden="true">↗</span></a>${site.contactEmail ? `<a href="mailto:${esc(site.contactEmail)}">${esc(site.contactEmail)} <span aria-hidden="true">↗</span></a>` : '<p class="contact-note">研究室への連絡先は準備中です．</p>'}</div></div></section>
</main><footer><div><strong>${esc(site.name)}</strong><span>${esc(site.englishName)}</span></div><p>© ${esc(site.name)}</p><a href="#home">ページ上部へ ↑</a></footer></body></html>`;
await mkdir(path.join(root,'dist'), {recursive:true});
await writeFile(path.join(root,'dist/index.html'), html);
for (const asset of ['styles.css','app.js','favicon.svg']) await copyFile(path.join(root,'src',asset),path.join(root,'dist',asset));
await writeFile(path.join(root,'dist/.nojekyll'),'');
console.log('Built dist/');
