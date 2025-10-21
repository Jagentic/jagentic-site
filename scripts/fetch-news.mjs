import { XMLParser } from "fast-xml-parser";
import fs from "fs/promises";

const FEEDS = [
  "https://openai.com/news/rss.xml",
  "https://github.com/blog.atom",
  "https://news.ycombinator.com/rss",
  "https://techcrunch.com/category/artificial-intelligence/feed/",
  "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml",
  "https://anthropic.com/news/rss.xml",
  "https://ai.googleblog.com/feeds/posts/default",
  "https://blog.langchain.dev/rss/",
  "https://simonwillison.net/atom/everything/"
];

const parser = new XMLParser({ ignoreAttributes:false, attributeNamePrefix:"" });
const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));

const extractText = (value) => {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    if ('#text' in value) return extractText(value['#text']);
    if ('cdata' in value) return extractText(value.cdata);
  }
  return String(value ?? '');
};

async function fetchWithRetry(url, tries=3){
  for(let i=0;i<tries;i++){
    try{
      const ctrl=new AbortController();
      const t=setTimeout(()=>ctrl.abort(),6000);
      const res=await fetch(url,{signal:ctrl.signal,headers:{"user-agent":"jagentic-news"}});
      clearTimeout(t);
      if(!res.ok) throw new Error(String(res.status));
      return await res.text();
    }catch(e){ if(i===tries-1) throw e; await sleep(400+Math.random()*600); }
  }
}

function toItems(xml, src){
  const host=new URL(src).hostname.replace(/^www\./,'');
  const x=parser.parse(xml);
  if (x?.rss?.channel?.item){
    const arr=Array.isArray(x.rss.channel.item)?x.rss.channel.item:[x.rss.channel.item];
    return arr.map(it=>({
      title: extractText(it.title).trim(),
      url: String(it.link || it.guid || '').trim(),
      source: host,
      published: new Date(it.pubDate || it["dc:date"] || Date.now()).toISOString()
    })).filter(v=>v.title&&v.url);
  }
  if (x?.feed?.entry){
    const arr=Array.isArray(x.feed.entry)?x.feed.entry:[x.feed.entry];
    return arr.map(en=>{
      const links=Array.isArray(en.link)?en.link:[en.link||{}];
      const alt=links.find(l=>(l?.rel??'alternate')==='alternate' && l?.href) || links[0];
      return {
        title: extractText(en.title).trim(),
        url: String(alt?.href || '').trim(),
        source: host,
        published: new Date(en.published || en.updated || Date.now()).toISOString()
      };
    }).filter(v=>v.title&&v.url);
  }
  return [];
}

const all=[];
for(const f of FEEDS){
  try{
    const xml=await fetchWithRetry(f);
    all.push(...toItems(xml,f));
  }catch{}
}

const seen=new Set(), out=[];
for(const it of all){
  const k=it.url.split('?')[0];
  if(!seen.has(k)){
    seen.add(k);
    out.push(it);
  }
}

out.sort((a,b)=>new Date(b.published)-new Date(a.published));
await fs.writeFile("news.json", JSON.stringify(out.slice(0,30), null, 2));
console.log(`wrote ${Math.min(out.length,30)} items to news.json`);
