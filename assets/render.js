async function loadJSON(p){ const r = await fetch(p + '?v=' + Date.now()); return r.json(); }
const GEAR_PAGES = {weapons:'gear-weapons.html',armor:'gear-armor.html',acc:'gear-acc.html',agates:'gear-agates.html',rbacc:'gear-rbacc.html'};
const GEAR_NAMES = {weapons:'⚔️ Оружие',armor:'🛡 Броня',acc:'💍 Аксессуары',agates:'🔮 Агаты',rbacc:'🐲 Аксы с РБ'};
async function initGearPage(){
  const cat = document.body.dataset.category;
  const fileMap = {weapons:'gear-weapons.json',armor:'gear-armor.json',acc:'gear-acc.json',agates:'gear-agates.json',rbacc:'gear-rbacc.json'};
  const data = await loadJSON('data/' + fileMap[cat]);
  const catSel = document.getElementById('sel-category');
  const subSel = document.getElementById('sel-sub');
  const itemSel = document.getElementById('sel-item');
  const box = document.getElementById('gear-box');
  catSel.innerHTML = Object.keys(GEAR_NAMES).map(k=>`<option value="${k}" ${k===cat?'selected':''}>${GEAR_NAMES[k]}</option>`).join('');
  catSel.onchange = () => location.href = GEAR_PAGES[catSel.value];
  const catData = data[cat] || {};
  const fillSubs = () => {
    subSel.innerHTML = Object.keys(catData).map(s=>`<option value="${s}">${s}</option>`).join('');
    fillItems();
  };
  const fillItems = () => {
    const items = catData[subSel.value] || [];
    itemSel.innerHTML = items.map((it,i)=>`<option value="${i}">${it.name} ${it.grade||''}${it.lvl?' ур.'+it.lvl:''}</option>`).join('');
    renderItem();
  };
  const renderItem = () => {
    const it = (catData[subSel.value] || [])[itemSel.value];
    if(!it){ box.innerHTML = '<p class="muted">Нет данных.</p>'; return; }
    const rows = (it.stats||[]).map((s,i)=>`<tr><td>+${i}</td><td>${s}</td></tr>`).join('');
    box.innerHTML = `<h2>${it.name} <span class="muted">· ${it.grade||''} · уровень ${it.lvl||'—'}</span></h2>
      <table><tr><th>Заточка</th><th>Характеристики</th></tr>${rows}</table>`;
  };
  subSel.onchange = fillItems; itemSel.onchange = renderItem;
  fillSubs();
}
function fmtAdena(n){ return n>=1000000 ? (n/1000000)+'kk' : n>=1000 ? (n/1000)+'k' : n; }
async function initSkillsPage(){
  const d = await loadJSON('data/skills.json');
  const tiers = d.tiers || [{name:'🥉 1 грейд', levels: d.levels||[]}];
  const tierSel = document.getElementById('sel-tier');
  const box = document.getElementById('skills-box');
  tierSel.innerHTML = tiers.map((t,i)=>`<option value="${i}">${t.name}</option>`).join('');
  const render = () => {
    const rows = (tiers[tierSel.value]||{}).levels || [];
    const head = '<tr><th>Уровень</th><th>📘 Книга</th><th>📜 Свиток</th><th>⚡ Энергия</th><th>💰 Адена</th></tr>';
    const perLvl = rows.map(r=>`<tr><td>${r.lvl}</td><td>${r.book}</td><td>${r.scroll}</td><td>${r.energy}</td><td>${fmtAdena(r.adena)}</td></tr>`).join('');
    let b=0,sc=0,en=0,ad=0; const totals=[];
    rows.forEach(r=>{ b+=r.book; sc+=r.scroll; en+=r.energy; ad+=r.adena; totals.push({lvl:r.lvl,book:b,scroll:sc,energy:en,adena:ad}); });
    const totalRows = totals.map(t=>`<tr><td>${t.lvl}</td><td>${t.book}</td><td>${t.scroll}</td><td>${t.energy}</td><td>${fmtAdena(t.adena)}</td></tr>`).join('');
    box.innerHTML = `
      <div style="display:flex;gap:24px;flex-wrap:wrap">
        <div style="flex:1;min-width:300px"><h2>📈 За уровень</h2><table>${head}${perLvl}</table></div>
        <div style="flex:1;min-width:300px"><h2>📊 Всего (накопительно)</h2><table>${head}${totalRows}</table></div>
      </div>`;
  };
  tierSel.onchange = render; render();
}
async function initDungeonsPage(){
  const data = await loadJSON('data/dungeons.json');
  document.getElementById('dungeons-box').innerHTML = data.map(d=>`
    <div class="card">
      ${d.img ? `<img src="${d.img}" alt="${d.name}" style="width:100%;max-width:600px;border-radius:8px;margin-bottom:12px;display:block">` : ''}
      <h2>${d.name} <span class="muted">(${d.lvl||''})</span></h2>
      <p>👑 Босс: ${d.boss||'—'}</p>
      <p>🎒 Дроп: ${(d.drop||[]).join(', ')||'—'}</p>
      <p>💡 Совет: ${d.tips||''}</p>
    </div>`).join('');
}
async function initBuildsPage(){
  const data = await loadJSON('data/builds.json');
  document.getElementById('builds-box').innerHTML = data.map(b=>`
    <div class="card"><h2>${b.class}</h2>
    <p>📊 Поинты: ${b.points||'—'}</p>
    <p>📖 Умения: ${(b.skills||[]).join('; ')||'—'}</p>
    <p>🛡 Сет: ${b.set||'—'}</p></div>`).join('');
}
async function initExchangePage(){
  const d = await loadJSON('data/exchange.json');
  document.getElementById('rules-box').innerHTML = '<ul>' + (d.rules||[]).map(r=>`<li>${r}</li>`).join('') + '</ul>';
  document.getElementById('examples-box').innerHTML = (d.examples||[]).length
    ? '<table><tr><th>Отдаёшь</th><th>Получаешь</th><th>Примечание</th></tr>' + d.examples.map(e=>`<tr><td>${e.give}</td><td>${e.get}</td><td>${e.note||''}</td></tr>`).join('') + '</table>'
    : '<p class="muted">Нет данных.</p>';
}
async function initRentalPage(){
  const d = await loadJSON('data/rental.json');
  document.getElementById('rental-box').innerHTML = d.length
    ? '<table><tr><th>Предмет</th><th>Для чего</th></tr>' + d.map(r=>`<tr><td>${r.name}</td><td>${r.purpose||''}</td></tr>`).join('') + '</table>'
    : '<p class="muted">Нет данных.</p>';
}
async function initBossesPage(){
  const bosses = await loadJSON('data/rb.json');
  const sel = document.getElementById('sel-boss');
  const box = document.getElementById('boss-box');
  sel.innerHTML = bosses.map((b,i)=>`<option value="${i}">${b.name}</option>`).join('');
  const render = () => {
    const b = bosses[sel.value];
    const phasesHtml = (b.phases||[]).length ? `
      <h3>🔹 Фазы босса</h3>
      ${(b.phases||[]).map(ph=>`
        <div class="card" style="margin-bottom:8px;padding:12px">
          <strong>Фаза ${ph.num} — ❤️${ph.hp_range}</strong>
          ${ph.on_enter ? `<br><span class="muted">🧬 При входе: ${ph.on_enter}</span>` : ''}
          <br><span class="muted">🔮 Умения: ${(ph.skills||[]).join(', ')}</span>
        </div>`).join('')}
    ` : '';
    const skillsHtml = (b.skills||[]).length ? `
      <h3>✨ Умения босса</h3>
      ${(b.skills||[]).map(sk=> typeof sk === 'string'
        ? `<div class="card" style="margin-bottom:8px;padding:12px"><strong>🪄 ${sk}</strong></div>`
        : `<div class="card" style="margin-bottom:8px;padding:12px"><strong>🪄 ${sk.name}</strong><br><span class="muted">${sk.desc}</span></div>`).join('')}
    ` : '';
    box.innerHTML = `
      <h2>${b.name} <span class="muted">· уровень ${b.lvl}</span></h2>
      <table>
        <tr><th>❤️ ХП</th><td>${b.hp}</td></tr>
        <tr><th>🛡 Защита</th><td>${b.def}</td></tr>
        <tr><th>⚔️ Урон</th><td>${b.atk}</td></tr>
        <tr><th>🎯 Точность</th><td>${b.acc||'—'}</td></tr>
        ${b.block ? `<tr><th>🪖 Блок</th><td>${b.block}</td></tr>` : ''}
      </table>
      ${phasesHtml}
      ${skillsHtml}
      <p class="muted">💍 Аксессуары с этого босса смотри: Экипировка → 🐲 Аксы с РБ.</p>`;
  };
  sel.onchange = render; render();
}

async function initDungeonBosses(){
  const data = await loadJSON('data/dbosses.json');
  const sel = document.getElementById('sel-dboss');
  const box = document.getElementById('dboss-box');
  sel.innerHTML = Object.keys(data).map(l=>`<option value="${l}">🔸 Боссы ${l} уровня</option>`).join('');
  const render = () => {
    const rows = (data[sel.value]||[]).map(b=>`<tr><td>${b.name}</td><td>${b.atk}</td><td>${b.def}</td><td>${b.hp}</td><td>${b.crit||'—'}</td><td>${(b.skills||[]).join(', ')||'—'}</td></tr>`).join('');
    box.innerHTML = `<div style="overflow-x:auto"><table><tr><th>Босс</th><th>⚔️ Урон</th><th>🛡 Защита</th><th>❤️ ХП</th><th>🎲 Крит</th><th>📘 Умения</th></tr>${rows}</table></div>`;
  };
  sel.onchange = render; render();
}

async function initComparePage(){
  const data = await loadJSON('data/compare.json');
  const armor = data.armor || {};
  const SLOTS = [['🎩','Шлем'],['🥼','Доспех'],['👖','Штаны'],['🧤','Перчатки'],['🥾','Ботинки']];
  const STATS = [['hp','❤️','Здоровье',''],['def','🛡️','Защита',''],['eva','🏃','Уворот',''],['dmg','⚔️','Урон',''],['crit','🎲','Крит','%'],['acc','🎯','Точность','']];
  const setsList = [];
  for(const g of ['B','A','S']) for(const n of Object.keys(armor[g]||{})) setsList.push({g,n});
  const boxA = document.getElementById('cmp-a-box');
  const boxB = document.getElementById('cmp-b-box');
  const res = document.getElementById('cmp-result');
  const selStyle = 'background:#16213e;color:#fff;border:1px solid #e94560;border-radius:8px;padding:6px 8px';
  const setOpts = '<option value="">—</option>' + setsList.map(o=>`<option value="${o.g}|${o.n}">${o.g} · ${o.n}</option>`).join('');
  const enchOpts = Array.from({length:13},(_,i)=>`<option value="${i}">+${i}</option>`).join('');
  const rowsHtml = tag => SLOTS.map(([e,name],i)=>`<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;flex-wrap:wrap">
    <span style="min-width:110px">${e} ${name}:</span>
    <select id="${tag}-s${i}" style="${selStyle};flex:1;min-width:150px">${setOpts}</select>
    <select id="${tag}-e${i}" style="${selStyle};width:70px">${enchOpts}</select>
  </div>`).join('');
  boxA.innerHTML = rowsHtml('ca');
  boxB.innerHTML = rowsHtml('cb');
  const sumSet = tag => {
    const tot = {hp:0,def:0,eva:0,dmg:0,crit:0,acc:0};
    for(let i=0;i<5;i++){
      const v = document.getElementById(`${tag}-s${i}`).value;
      const e = parseInt(document.getElementById(`${tag}-e${i}`).value);
      if(!v) continue;
      const [g,n] = v.split('|');
      const set = (armor[g]||{})[n] || {};
      for(const k of Object.keys(tot)){
        const arr = set[k];
        if(arr && arr[e]!==undefined) tot[k] += arr[e];
      }
    }
    return tot;
  };
  const fmt = v => { const r = Math.round(v*10)/10; return Number.isInteger(r)? String(r) : r.toFixed(1); };
  const compare = () => {
    const A = sumSet('ca'), B = sumSet('cb');
    const lines = STATS.filter(([k])=> A[k]||B[k]).map(([k,ico,label,suf])=>{
      const d = Math.round((B[k]-A[k])*10)/10;
      const arrow = d>0?'🟢':(d<0?'🔴':'');
      return `<div style="margin-bottom:6px">${ico} ${label}: A ${fmt(A[k])}${suf} → B ${fmt(B[k])}${suf} (${d>0?'+':''}${fmt(d)}${suf}) ${arrow}</div>`;
    }).join('');
    res.innerHTML = `<h2>⚖️ Сравнение:</h2>${lines || '<p class="muted">Выбери сеты A и B по слотам — и нажми «Сравнить».</p>'}`;
  };
  document.getElementById('cmp-go').onclick = compare;
  compare();
}
