// ============================================================
//  HUNTER LAB BRASIL — motor.js  (versão corrigida e melhorada)
// ============================================================

let editingWeaponId = null, editingArmorId = null, editingJewelId = null;
let currentActiveSlot = null;

// ── Mapas visuais ─────────────────────────────────────────
const sharpColors = {
    'Nenhuma':'bg-[#4a412f]','Vermelha':'bg-[#e84040]','Laranja':'bg-[#e89040]',
    'Amarela':'bg-[#e8e040]','Verde':'bg-[#60d060]','Azul':'bg-[#4090f0]',
    'Branca':'bg-[#f0f8ff]','Roxa':'bg-[#c090e0]'
};
const elementColors = {
    'Fogo':'text-[#e06030]','Água':'text-[#70b0e0]','Raio':'text-[#facc15]',
    'Gelo':'text-[#e0f2fe]','Dragão':'text-[#9060c0]','Veneno':'text-[#a855f7]',
    'Sono':'text-[#94a3b8]','Paralisia':'text-[#facc15]','Explosão':'text-[#f97316]'
};
const elementIcons = {
    'Fogo':'🔥','Água':'💧','Raio':'⚡','Gelo':'❄️','Dragão':'🐉',
    'Veneno':'☠️','Sono':'💤','Paralisia':'⚡','Explosão':'💥'
};
// ── Cores por raridade (aplicadas diretamente nos SVGs) ──────
const rarityColors = {
    1:'#c8c6c7',  // cinza claro
    2:'#edeef0',  // branco suave
    3:'#c8d98a',  // verde oliva vivo
    4:'#7ecf9e',  // verde médio brilhante
    5:'#4fa0ad',  // azul-petróleo vivo
    6:'#7248c4',  // roxo médio
    7:'#b8aff0',  // lavanda clara
    8:'#d4a090',  // rosé claro
    9:'#c04060',  // carmesim médio
    10:'#6fa0f8', // azul vivo
    11:'#f5d830', // amarelo ouro brilhante
    12:'#60d8f0'  // ciano brilhante
};
function getRarityColor(r){ return rarityColors[r||1]||rarityColors[1]; }

// ── SVG icons nativos — sem fundo, cor pela raridade ────────
const SVG_ICONS = {

// ARMA — losango rotacionado 45° (ponta pra cima e baixo = forma de lâmina)
weapon: (c,s)=>`<svg width="${s}" height="${s}" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M22 2 L40 22 L22 42 L4 22 Z" fill="${c}" fill-opacity=".12" stroke="${c}" stroke-width="1.8"/>
  <path d="M22 2 L40 22 L22 16 Z" fill="${c}" fill-opacity=".42"/>
  <path d="M4 22 L22 16 L22 42 Z" fill="${c}" fill-opacity=".20"/>
  <path d="M40 22 L22 16 L22 42 Z" fill="${c}" fill-opacity=".28"/>
  <line x1="4" y1="22" x2="40" y2="22" stroke="${c}" stroke-width="1" opacity=".28"/>
  <line x1="22" y1="2" x2="22" y2="42" stroke="${c}" stroke-width="1" opacity=".20"/>
</svg>`,

// ARMADURA — octógono facetado com viewBox maior para parecer menor visualmente
_default: (c,s)=>`<svg width="${s}" height="${s}" viewBox="-5 -5 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M14 3 L30 3 L41 14 L41 30 L30 41 L14 41 L3 30 L3 14 Z"
    fill="${c}" fill-opacity=".12" stroke="${c}" stroke-width="1.8"/>
  <path d="M14 3 L30 3 L22 22 Z" fill="${c}" fill-opacity=".42"/>
  <path d="M3 14 L14 3 L22 22 Z" fill="${c}" fill-opacity=".22"/>
  <path d="M41 14 L30 3 L22 22 Z" fill="${c}" fill-opacity=".30"/>
  <path d="M3 30 L3 14 L22 22 Z" fill="${c}" fill-opacity=".16"/>
  <path d="M41 30 L41 14 L22 22 Z" fill="${c}" fill-opacity=".22"/>
  <path d="M14 41 L3 30 L22 22 Z" fill="${c}" fill-opacity=".20"/>
  <path d="M30 41 L41 30 L22 22 Z" fill="${c}" fill-opacity=".26"/>
  <path d="M14 41 L30 41 L22 22 Z" fill="${c}" fill-opacity=".14"/>
</svg>`,

// ADORNO — diamante facetado (viewBox 0 0 44 40 para cortar triangulos e equalizar tamanho visual)
decorations: (c,s)=>`<svg width="${s}" height="${s}" viewBox="0 0 44 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M22 2 L36 11 L40 22 L36 33 L22 39 L8 33 L4 22 L8 11 Z"
    fill="${c}" fill-opacity=".14" stroke="${c}" stroke-width="2"/>
  <path d="M22 2 L36 11 L22 19 L8 11 Z"   fill="${c}" fill-opacity=".35"/>
  <path d="M8 11 L22 19 L8 33 L4 22 Z"    fill="${c}" fill-opacity=".22"/>
  <path d="M36 11 L40 22 L36 33 L22 19 Z" fill="${c}" fill-opacity=".28"/>
  <path d="M8 33 L22 19 L36 33 L22 39 Z"  fill="${c}" fill-opacity=".12"/>
  <line x1="4" y1="22" x2="40" y2="22" stroke="${c}" stroke-width="1" opacity=".30"/>
  <polygon points="13,40 19,35 25,40" fill="${c}" fill-opacity=".75"/>
  <polygon points="21,40 27,35 33,40" fill="${c}" fill-opacity=".50"/>
</svg>`,

// AMULETO — hexágono facetado (viewBox 0 0 44 40 para equalizar visualmente)
charm: (c,s)=>`<svg width="${s}" height="${s}" viewBox="0 0 44 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M22 3 L36 11 L36 29 L22 37 L8 29 L8 11 Z"
    fill="${c}" fill-opacity=".14" stroke="${c}" stroke-width="2"/>
  <path d="M22 3 L36 11 L22 20 L8 11 Z"  fill="${c}" fill-opacity=".40"/>
  <path d="M8 11 L22 20 L8 29 Z"          fill="${c}" fill-opacity=".20"/>
  <path d="M36 11 L22 20 L36 29 Z"        fill="${c}" fill-opacity=".26"/>
  <path d="M8 29 L22 20 L36 29 L22 37 Z"  fill="${c}" fill-opacity=".12"/>
  <line x1="8" y1="20" x2="36" y2="20" stroke="${c}" stroke-width="1" opacity=".28"/>
</svg>`,

};

// weapon e _default (armaduras) são formas distintas; decorations e charm têm formas próprias

// Renderiza ícone SVG nativo com cor da raridade
function getIcon(slot, size, rarity) {
    size = size || 44;
    var c = rarity ? getRarityColor(rarity) : '#c9a84c';
    // weapon e decorations e charm têm formas próprias; armaduras usam _default (octógono)
    var fn = SVG_ICONS[slot] || SVG_ICONS['_default'];
    return '<span style="display:inline-flex;flex-shrink:0;align-items:center;justify-content:center;width:' + size + 'px;height:' + size + 'px;" class="equip-icon-svg">' + fn(c, size) + '</span>';
}

const ALL_SLOTS = ['weapon','charm','head','chest','arms','waist','legs'];

// ── Utilitários ───────────────────────────────────────────
function getRarityClass(r){ return `rarity-${r||1}`; }

function getList(slot){
    if(slot==='weapon') return DB.weapons;
    if(slot==='charm')  return DB.charms;
    return DB.armors[slot];
}


// Helper para abrir modal de habilidade a partir de data-skill (evita problemas de escape)
function openSkillInfo(e, el) {
    const name = decodeURIComponent(el.getAttribute('data-skill') || '');
    if(name) showSkillModal(name);
}

// ── Modal de Detalhes de Habilidade ───────────────────────────
function showSkillModal(skillName) {
    const data   = (typeof skillData !== 'undefined') ? skillData[skillName] : null;
    const max    = maxSkills[skillName] || 7;
    // Nível atual na build ativa (soma de todas as fontes)
    let curLevel = 0;
    ALL_SLOTS.forEach(slot => {
        const it = build[slot].data;
        if(it && it.skills && it.skills[skillName]) curLevel += it.skills[skillName];
        if(build[slot].joias) build[slot].joias.forEach(j => {
            if(j && j.skills && j.skills[skillName]) curLevel += j.skills[skillName];
        });
    });
    curLevel = Math.min(curLevel, max);

    let levelsHtml = '';
    if(data && data.levels) {
        // Processar <g>texto</g> → info extra em verde
        const fmtDesc = d => d.replace(/<g>(.*?)<\/g>/g,
            '<span style="color:#60d060;font-size:0.88em;font-style:italic"> $1</span>');
        levelsHtml = data.levels.map((desc, i) => {
            const lv = i + 1;
            const isActive = lv <= curLevel;
            return `<div class="flex gap-4 py-3 border-b border-[#3a3020] last:border-0">
                <div class="flex-shrink-0 flex flex-col items-center gap-1 pt-0.5" style="min-width:42px">
                    <span class="font-cinzel font-bold text-[14px] leading-none ${isActive ? 'modal-lv-active-num' : 'text-[#5a4e38]'}">Nv ${lv}</span>
                    <span class="text-[11px] leading-none ${isActive ? 'modal-lv-active-dot' : 'text-[#3a3020]'}">${isActive ? '▪' : '▫'}</span>
                </div>
                <span class="text-[18px] font-crimson leading-snug ${isActive ? 'modal-lv-active-text' : 'text-[#7a6e52]'}">${fmtDesc(desc)}</span>
            </div>`;
        }).join('');
    } else {
        levelsHtml = '<p class="text-[#6b5e43] italic text-[16px] font-crimson py-4">Descrição ainda não cadastrada para esta habilidade.</p>';
    }

    document.getElementById('skill-modal-title').textContent = skillName;
    document.getElementById('skill-modal-desc').textContent  = (data && data.desc) ? data.desc : '';
    document.getElementById('skill-modal-cur').textContent   = curLevel > 0 ? 'Nível atual na build: ' + curLevel + '/' + max : 'Não ativa na build atual';
    document.getElementById('skill-modal-max').textContent   = 'Nível máximo: ' + max;
    document.getElementById('skill-modal-levels').innerHTML  = levelsHtml;
    document.getElementById('skill-modal').classList.remove('hidden');
}

function showJewelModal(jewelId) {
    const j = DB.decorations.find(d => d.id === jewelId);
    if(!j) return;
    let skillLines = '';
    if(j.skills) {
        skillLines = Object.keys(j.skills).map(sk => {
            const pts = j.skills[sk];
            const encSk = encodeURIComponent(sk);
            return '<div class="flex items-center gap-3 cursor-pointer group" onclick="closeJewelModal();showSkillModal(decodeURIComponent(\'' + encSk + '\'))">'
                + '<span class="text-[#00bfff] text-lg leading-none">♦</span>'
                + '<span class="text-[16px] font-crimson font-bold text-[#e8d5a3] group-hover:text-white">' + sk + '</span>'
                + '<span class="text-[13px] font-cinzel text-[#c9a84c] ml-auto">+' + pts + ' ponto' + (pts>1?'s':'') + '</span>'
                + '</div>';
        }).join('');
    }
    const avail = getAvailableStock(jewelId);
    document.getElementById('jewel-modal-title').textContent  = j.n;
    document.getElementById('jewel-modal-slot').textContent   = '♦ Slot nível ' + j.s;
    document.getElementById('jewel-modal-stock').textContent  = avail + ' disponível' + (avail!==1?'is':'');
    document.getElementById('jewel-modal-skills').innerHTML   = skillLines || '<p class="text-[#4a412f] italic text-[14px]">Sem habilidades cadastradas.</p>';
    document.getElementById('jewel-modal').classList.remove('hidden');
}

function showGearModal(slot) {
    const it = build[slot] ? build[slot].data : null;
    if(!it || it.name==='---' || it.n==='---') return;
    const nm = it.name||it.n;
    const rar = it.rarity||1;
    const rClass = getRarityColor(rar);

    let rows = '';
    if(slot==='weapon'){
        if(it.atk)        rows += gearRow('Ataque', it.atk);
        if(it.aff)        rows += gearRow('Afinidade', it.aff+'%');
        if(it.sharpness && it.sharpness!=='Nenhuma') rows += gearRow('Afiação', it.sharpness);
        if(it.element && it.element!=='Nenhum') rows += gearRow('Elemento', it.element+' '+(it.elementVal||''));
        if(it.elderseal && it.elderseal!=='Nenhum') rows += gearRow('Selo Ancião', it.elderseal);
        if(it.def)        rows += gearRow('Bônus Defesa', '+'+it.def);
        if(it.specialSkill && it.specialSkill!=='') rows += gearRow('Habilidade Especial', it.specialSkill);
    } else if(slot==='charm'){
        if(it.rarity)     rows += gearRow('Raridade', 'R'+rar);
        const sks = Object.keys(it.skills||{});
        sks.forEach(sk=>rows += gearRow(sk, 'Nv '+it.skills[sk]));
    } else {
        // armadura
        if(it.def)        rows += gearRow('Defesa', it.def);
        if(it.res){
            const rIcons=['🔥','💧','⚡','❄️','🐉'];
            const rNames=['Fogo','Água','Raio','Gelo','Dragão'];
            it.res.forEach((v,i)=>{ if(v!==0) rows+=gearRow(rIcons[i]+' '+rNames[i], (v>0?'+':'')+v); });
        }
        const sks = Object.keys(it.skills||{});
        sks.forEach(sk=>rows += gearRow(sk, 'Nv '+it.skills[sk]));
        if(it.set && it.set!=='Nenhum') rows += gearRow('Set', it.set);
    }

    // Slots + joias equipadas
    const joias = build[slot].joias||[];
    if(it.slots && it.slots.length>0){
        const slotsHtml = it.slots.map((s,idx)=>{
            const filled = joias[idx];
            if(filled) return gearRow('Slot '+s, filled.n+' (Nv '+filled.s+')');
            return gearRow('Slot '+s, '— livre —');
        }).join('');
        rows += slotsHtml;
    }

    document.getElementById('gear-modal-icon').innerHTML  = getIcon(slot, 40, rar);
    document.getElementById('gear-modal-title').textContent = nm;
    document.getElementById('gear-modal-sub').textContent   = locs[slot]+' · ♦ R'+rar;
    document.getElementById('gear-modal-sub').style.color   = rClass;
    document.getElementById('gear-modal-rows').innerHTML    = rows||'<p class="text-[#6b5e43] italic text-[14px]">Sem informações cadastradas.</p>';
    document.getElementById('gear-modal').classList.remove('hidden');
}
function showItemModal(id, type, catId){
    let it = null;
    if(type==='weapon')       it = DB.weapons.find(i=>i.id===id);
    else if(type==='charms')  it = DB.charms.find(i=>i.id===id);
    else if(type==='decorations') it = DB.decorations.find(i=>i.id===id);
    else                      it = DB.armors[catId]&&DB.armors[catId].find(i=>i.id===id);
    if(!it) return;

    const nm = it.name||it.n||'';
    const rar = it.rarity||1;
    let rows = '';

    if(type==='weapon'){
        if(it.atk)  rows += gearRow('Ataque', it.atk);
        if(it.aff)  rows += gearRow('Afinidade', it.aff+'%');
        if(it.sharpness&&it.sharpness!=='Nenhuma') rows += gearRow('Afiação', it.sharpness);
        if(it.element&&it.element!=='Nenhum') rows += gearRow('Elemento', it.element+' '+(it.elementVal||''));
        if(it.elderseal&&it.elderseal!=='Nenhum') rows += gearRow('Selo Ancião', it.elderseal);
        if(it.def)  rows += gearRow('Bônus Defesa', '+'+it.def);
        if(it.specialSkill&&it.specialSkill!=='') rows += gearRow(it.specialSkill,'Especial',true);
        if(it.slots&&it.slots.length) rows += gearRow('Slots', it.slots.join(' · ')||'—');
    } else if(type==='charms'){
        Object.keys(it.skills||{}).forEach(sk=>rows+=gearRow(sk,'Nv '+it.skills[sk],true));
    } else if(type==='decorations'){
        rows += gearRow('Slot', it.s);
        rows += gearRow('Quantidade', it.qtd!==undefined?it.qtd:1);
        Object.keys(it.skills||{}).forEach(sk=>rows+=gearRow(sk,'+'+it.skills[sk]));
    } else {
        if(it.def) rows += gearRow('Defesa', it.def);
        const rIcons=['🔥','💧','⚡','❄️','🐉'], rNames=['Fogo','Água','Raio','Gelo','Dragão'];
        (it.res||[]).forEach((v,i)=>{ if(v!==0) rows+=gearRow(rIcons[i]+' '+rNames[i],(v>0?'+':'')+v); });
        Object.keys(it.skills||{}).forEach(sk=>rows+=gearRow(sk,'Nv '+it.skills[sk],true));
        if(it.set&&it.set!=='Nenhum') rows+=gearRow('Set',it.set);
        if(it.slots&&it.slots.length) rows+=gearRow('Slots',it.slots.join(' · ')||'—');
    }

    const iconSlot = type==='weapon'?'weapon':type==='charms'?'charm':type==='decorations'?'decorations':catId;
    document.getElementById('gear-modal-icon').innerHTML   = getIcon(iconSlot,40,rar);
    document.getElementById('gear-modal-title').textContent = nm;
    document.getElementById('gear-modal-sub').textContent   = (locs[iconSlot]||type)+' · Raridade '+rar;
    document.getElementById('gear-modal-sub').style.color   = getRarityColor(rar);
    document.getElementById('gear-modal-rows').innerHTML    = rows||'<p class="text-[#6b5e43] italic text-[14px]">Sem informações.</p>';
    document.getElementById('gear-modal').classList.remove('hidden');
}

function gearRow(label, value, isSkill){
    const inner = isSkill
        ? `<span class="font-crimson text-[16px] text-[#e8d5a3] text-right cursor-pointer hover:text-[#c9a84c]" onclick="closeGearModal();showSkillModal(decodeURIComponent('${encodeURIComponent(label)}'))">${label}</span>
           <span class="font-cinzel text-[13px] text-[#c9a84c] flex-shrink-0">${value}</span>`
        : `<span class="font-cinzel text-[13px] text-[#8a7a5a] uppercase tracking-wide flex-shrink-0">${label}</span>
           <span class="font-crimson text-[16px] text-[#e8d5a3] text-right">${value}</span>`;
    return `<div class="flex justify-between items-baseline py-2 border-b border-[#3a3020] last:border-0 gap-4">${inner}</div>`;
}
function showSetBonusModal(jsonStr){
    let info;
    try { info=JSON.parse(jsonStr); } catch(e){ return; }
    const isActive=info.count>=info.req;

    // Pegar todos os bônus do set para mostrar contexto completo
    const allBonuses=typeof setBonuses!=='undefined'&&setBonuses[info.setName];
    let bonusRows='';
    if(allBonuses && Array.isArray(allBonuses)){
        bonusRows=allBonuses.map(b=>{
            const bActive=info.count>=b.req;
            return `<div class="py-2 border-b border-[#3a3020] last:border-0">
                <div class="flex items-center justify-between gap-2">
                    <span class="font-cinzel font-bold text-[13px] ${bActive?'text-[#e8d5a3]':'text-[#6b5e43]'} uppercase tracking-wide">${b.name===info.name?'▶ ':' '}${b.name}</span>
                    <span class="font-cinzel text-[12px] font-bold ${bActive?'text-[#c9a84c]':'text-[#4a412f]'} shrink-0">${b.req} peças</span>
                </div>
                <div class="text-[14px] font-crimson ${bActive?'text-[#c9b07a]':'text-[#4a412f]'} italic mt-0.5 leading-snug">${b.desc}</div>
            </div>`;
        }).join('');
    } else {
        bonusRows=`<div class="py-2 text-[14px] font-crimson text-[#c9b07a] italic">${info.desc}</div>`;
    }

    document.getElementById('gear-modal-icon').innerHTML  = getIcon('head',40);
    document.getElementById('gear-modal-title').textContent = info.setName;
    document.getElementById('gear-modal-sub').textContent   = `${info.count} peça(s) equipada(s) · ${isActive?'ATIVO':'INATIVO'}`;
    document.getElementById('gear-modal-sub').style.color   = isActive?'#c9a84c':'#6b5e43';
    document.getElementById('gear-modal-rows').innerHTML    = bonusRows;
    document.getElementById('gear-modal').classList.remove('hidden');
}

function closeGearModal() { document.getElementById('gear-modal').classList.add('hidden'); }

function closeSkillModal()  { document.getElementById('skill-modal').classList.add('hidden'); }
function closeJewelModal()  { document.getElementById('jewel-modal').classList.add('hidden'); }

// Fechar modais ao clicar fora
document.addEventListener('click', function(e) {
    const sm = document.getElementById('skill-modal');
    const jm = document.getElementById('jewel-modal');
    const gm = document.getElementById('gear-modal');
    if(sm && !sm.classList.contains('hidden') && e.target === sm) closeSkillModal();
    if(jm && !jm.classList.contains('hidden') && e.target === jm) closeJewelModal();
    if(gm && !gm.classList.contains('hidden') && e.target === gm) closeGearModal();
});


// getSlotIcon() removido — use getIcon('decorations', size)

// FIX: Notificação toast no lugar de alert() para sucesso
function toast(msg, type='ok'){
    let t = document.getElementById('toast-msg');
    if(!t){ t=document.createElement('div'); t.id='toast-msg'; document.body.appendChild(t); }
    t.textContent = msg;
    t.className = `fixed bottom-6 right-6 z-50 px-5 py-3 rounded shadow-xl font-cinzel text-[13px] font-bold uppercase tracking-widest transition-all duration-300
        ${type==='ok'?'bg-[#3d3423] border border-[#c9a84c] text-[#e8d5a3]':'bg-[#3d1515] border border-[#e84040] text-[#e84040]'}`;
    t.style.opacity='1';
    clearTimeout(t._to);
    t._to = setTimeout(()=>{ t.style.opacity='0'; },2800);
}

// FIX: confirm com UI customizada (retorna Promise)
function confirmDialog(msg){
    return new Promise(resolve=>{
        const overlay = document.getElementById('confirm-overlay');
        const msgEl   = document.getElementById('confirm-msg');
        const btnOk   = document.getElementById('confirm-ok');
        const btnCan  = document.getElementById('confirm-cancel');
        if(!overlay){ resolve(window.confirm(msg)); return; }
        msgEl.textContent = msg;
        overlay.classList.remove('hidden');
        const cleanup=(r)=>{ overlay.classList.add('hidden'); btnOk.onclick=null; btnCan.onclick=null; resolve(r); };
        btnOk.onclick  = ()=>cleanup(true);
        btnCan.onclick = ()=>cleanup(false);
    });
}

// ── Persistência ──────────────────────────────────────────
function save(){
    localStorage.setItem('mhw_final_db_clair',    JSON.stringify(DB));
    localStorage.setItem('mhw_final_build_clair', JSON.stringify(build));
}

function load(){
    const sDB=localStorage.getItem('mhw_final_db_clair');
    const sBuild=localStorage.getItem('mhw_final_build_clair');
    if(sDB)    DB    = JSON.parse(sDB);
    if(sBuild) build = JSON.parse(sBuild);
    // Migrações seguras
    if(!DB.presets)  DB.presets={};
    if(!DB.charms)   DB.charms=[{id:'c_0',n:'---',rarity:1,skills:{}}];
    if(!build.charm) build.charm={data:DB.charms[0],joias:[]};
    ALL_SLOTS.forEach(s=>{ if(!build[s]) build[s]={data:getList(s)[0],joias:[]}; });
}

// FIX: Exportação completa — inclui masterSets, setBonuses, specialSkills, maxSkills
// exportData e importData removidos — dados salvos automaticamente


// ── Motion Values por tipo de arma (média dos golpes mais usados) ─────
// Representa o "peso" de cada golpe. O dano real = Ataque × MV × Afiação × Zona de Impacto/100
// Motion Values + tipo de dano + KO + Exaustão por golpe
// tipo: 'C'=corte, 'I'=impacto, 'P'=projétil
// ko: valor de KO/atordoamento por hit (0 = não acumula)
// ex: valor de exaustão por hit (0 = não acumula)
// qp: aplica quebra-parte? (corte e impacto sim, projétil não)
// Motion Values + tipo + KO + Exaustão + multiplicador elemental por golpe
// el = fração do dano elemental aplicada por hit (1.0 = 100% do elem/10)
// Golpes lentos/pesados: el alto | rápidos/multihit: el baixo
const motionValues = {
    'Espadão': { golpes: [
        { nome: 'Rising Slash',           mv:0.34, tipo:'C', ko:0,  ex:0,  el:0.7 },
        { nome: 'Overhead Slash',         mv:0.48, tipo:'C', ko:0,  ex:0,  el:1.0 },
        { nome: 'Golpe Carregado 1',      mv:0.52, tipo:'C', ko:0,  ex:0,  el:1.0 },
        { nome: 'Golpe Carregado 2',      mv:0.74, tipo:'C', ko:0,  ex:0,  el:1.0 },
        { nome: 'Golpe Carregado 3',      mv:0.99, tipo:'C', ko:0,  ex:0,  el:1.0 },
        { nome: 'TCS hit 1',              mv:0.55, tipo:'C', ko:0,  ex:0,  el:1.0 },
        { nome: 'TCS hit 2',              mv:0.83, tipo:'C', ko:0,  ex:0,  el:1.0 },
        { nome: 'TCS (ambos)',            mv:1.38, tipo:'C', ko:0,  ex:0,  el:2.0 },
    ]},
    'Espada e Escudo': { golpes: [
        { nome: 'Golpe Básico',           mv:0.13, tipo:'C', ko:0,  ex:5,  el:0.4 },
        { nome: 'Combo x4',               mv:0.14, tipo:'C', ko:0,  ex:5,  el:0.4 },
        { nome: 'Shield Bash',            mv:0.16, tipo:'I', ko:10, ex:0,  el:0.0 },
        { nome: 'Perfect Rush (final)',    mv:0.45, tipo:'C', ko:0,  ex:10, el:1.0 },
    ]},
    'Duplas-Lâminas': { golpes: [
        { nome: 'Giro (por hit)',          mv:0.09, tipo:'C', ko:0,  ex:5,  el:0.2 },
        { nome: 'Ataque Básico',          mv:0.12, tipo:'C', ko:0,  ex:5,  el:0.3 },
        { nome: 'Modo Demônio (por hit)', mv:0.14, tipo:'C', ko:0,  ex:5,  el:0.3 },
        { nome: 'Archdemon Combo',        mv:0.20, tipo:'C', ko:0,  ex:10, el:0.5 },
    ]},
    'Espada Longa': { golpes: [
        { nome: 'Corte Básico',           mv:0.24, tipo:'C', ko:0,  ex:0,  el:0.5 },
        { nome: 'Thrust',                 mv:0.27, tipo:'C', ko:0,  ex:0,  el:0.5 },
        { nome: 'Spirit Slash I',         mv:0.31, tipo:'C', ko:0,  ex:0,  el:0.7 },
        { nome: 'Spirit Slash II',        mv:0.34, tipo:'C', ko:0,  ex:0,  el:0.7 },
        { nome: 'Iai Slash',              mv:0.36, tipo:'C', ko:0,  ex:0,  el:0.7 },
        { nome: 'Spirit Roundslash',      mv:0.39, tipo:'C', ko:0,  ex:0,  el:1.0 },
        { nome: 'Foresight Slash',        mv:0.45, tipo:'C', ko:0,  ex:0,  el:1.0 },
    ]},
    'Martelo': { golpes: [
        { nome: 'Ataque Básico',          mv:0.27, tipo:'I', ko:20, ex:10, el:0.5 },
        { nome: 'Spinning Bludgeon (hit)',mv:0.32, tipo:'I', ko:20, ex:10, el:0.5 },
        { nome: 'Golpe Lateral',          mv:0.38, tipo:'I', ko:25, ex:10, el:0.7 },
        { nome: 'Carga 1 — Pounding',     mv:0.52, tipo:'I', ko:30, ex:15, el:1.0 },
        { nome: 'Carga 2 — Golpe Forte',  mv:0.60, tipo:'I', ko:40, ex:15, el:1.0 },
        { nome: 'Carga 3 — Big Bang',     mv:0.90, tipo:'I', ko:60, ex:20, el:1.5 },
    ]},
    'Berrante de Caça': { golpes: [
        { nome: 'Nota Básica',            mv:0.29, tipo:'I', ko:15, ex:10, el:0.5 },
        { nome: 'Echo Wave',              mv:0.30, tipo:'I', ko:15, ex:10, el:0.5 },
        { nome: 'Bilateral Slam',         mv:0.42, tipo:'I', ko:25, ex:15, el:0.7 },
        { nome: 'Echo Wave (Dragão)',     mv:0.30, tipo:'C', ko:0,  ex:0,  el:1.0 },
        { nome: 'Melody Cancel',          mv:0.51, tipo:'I', ko:30, ex:15, el:1.0 },
    ]},
    'Lança': { golpes: [
        { nome: 'Toque (poke)',           mv:0.23, tipo:'C', ko:0,  ex:10, el:0.5 },
        { nome: 'Power Guard',            mv:0.25, tipo:'C', ko:0,  ex:10, el:0.5 },
        { nome: 'Counter Thrust',         mv:0.30, tipo:'C', ko:0,  ex:10, el:0.7 },
        { nome: 'Charged Thrust',         mv:0.40, tipo:'C', ko:0,  ex:15, el:1.0 },
    ]},
    'Lançarma': { golpes: [
        { nome: 'Full Burst (por cano)',   mv:0.09, tipo:'P', ko:0,  ex:0,  el:0.0 },
        { nome: 'Toque Básico',           mv:0.18, tipo:'C', ko:0,  ex:10, el:0.5 },
        { nome: 'Wyrmstake',              mv:0.45, tipo:'C', ko:0,  ex:0,  el:0.7 },
        { nome: 'Wyvern Fire',            mv:1.00, tipo:'P', ko:0,  ex:0,  el:0.0 },
    ]},
    'Transmachado': { golpes: [
        { nome: 'Machado — Golpe',        mv:0.38, tipo:'C', ko:0,  ex:10, el:0.7 },
        { nome: 'Machado — Roundslash',   mv:0.45, tipo:'C', ko:0,  ex:10, el:0.7 },
        { nome: 'Espada — ZSD',           mv:0.78, tipo:'C', ko:0,  ex:10, el:1.5 },
        { nome: 'Espada — SAED',          mv:1.20, tipo:'C', ko:0,  ex:15, el:2.0 },
    ]},
    'Lâmina Dínamo': { golpes: [
        { nome: 'Golpe Básico',           mv:0.28, tipo:'C', ko:0,  ex:10, el:0.5 },
        { nome: 'Element Discharge',      mv:0.62, tipo:'C', ko:0,  ex:10, el:1.5 },
        { nome: 'AED (Morphslash)',       mv:0.78, tipo:'C', ko:0,  ex:10, el:1.5 },
        { nome: 'SAED',                   mv:0.90, tipo:'C', ko:0,  ex:10, el:2.0 },
    ]},
    'Glaive Inseto': { golpes: [
        { nome: 'Thrust Aéreo',           mv:0.20, tipo:'C', ko:0,  ex:10, el:0.5 },
        { nome: 'Combo Básico',           mv:0.28, tipo:'C', ko:0,  ex:10, el:0.5 },
        { nome: 'Salto Aéreo',           mv:0.34, tipo:'C', ko:0,  ex:10, el:0.7 },
        { nome: 'Strong Attack',          mv:0.45, tipo:'C', ko:0,  ex:10, el:1.0 },
    ]},
    'Arco': { golpes: [
        { nome: 'Disparo Nv1',            mv:0.10, tipo:'P', ko:0,  ex:0,  el:0.6 },
        { nome: 'Disparo Nv2',            mv:0.13, tipo:'P', ko:0,  ex:0,  el:0.7 },
        { nome: 'Disparo Nv3',            mv:0.18, tipo:'P', ko:0,  ex:0,  el:0.8 },
        { nome: 'Coating + Nv3',          mv:0.20, tipo:'P', ko:0,  ex:0,  el:0.8 },
        { nome: 'Disparo Dragão',         mv:0.22, tipo:'P', ko:0,  ex:0,  el:1.0 },
    ]},
    'Fuzilarco Leve': { golpes: [
        { nome: 'Disparo Normal 1',       mv:0.07, tipo:'P', ko:0,  ex:0,  el:0.4 },
        { nome: 'Wyvernheart (por hit)',   mv:0.08, tipo:'P', ko:0,  ex:0,  el:0.3 },
        { nome: 'Rapid Fire (por hit)',    mv:0.09, tipo:'P', ko:0,  ex:0,  el:0.3 },
        { nome: 'Disparo Normal 2',       mv:0.08, tipo:'P', ko:0,  ex:0,  el:0.5 },
        { nome: 'Disparo Normal 3',       mv:0.10, tipo:'P', ko:0,  ex:0,  el:0.6 },
        { nome: 'Wyvernblast',            mv:0.50, tipo:'P', ko:0,  ex:0,  el:0.0 },
    ]},
    'Fuzilarco Pesado': { golpes: [
        { nome: 'Wyvernheart (por hit)',   mv:0.08, tipo:'P', ko:0,  ex:0,  el:0.3 },
        { nome: 'Disparo Normal 1',       mv:0.10, tipo:'P', ko:0,  ex:0,  el:0.5 },
        { nome: 'Disparo Penetrante',     mv:0.14, tipo:'P', ko:0,  ex:0,  el:0.5 },
        { nome: 'Disparo Normal 3',       mv:0.20, tipo:'P', ko:0,  ex:0,  el:0.7 },
        { nome: 'Wyvern Snipe',           mv:0.80, tipo:'P', ko:0,  ex:0,  el:0.0 },
    ]},
};

// ── Multiplicador de afiação (escopo global) ─────────────────
const sharpnessMultTable = {
    'Nenhuma':1.00,'Vermelha':0.50,'Laranja':0.75,'Amarela':1.00,
    'Verde':1.05,'Azul':1.20,'Branca':1.32,'Roxa':1.39
};

// Desequipar tudo — limpa build e joias
async function clearAllGear(){
    const ok = await confirmDialog('Desequipar todos os equipamentos e joias?');
    if(!ok) return;

    ALL_SLOTS.forEach(slot=>{
        build[slot].data  = getList(slot)[0];
        build[slot].joias = [];
    });
    currentActiveSlot = null;
    save(); renderArmorList(); updateAllStats(); renderJewelStock();
    document.getElementById('editor-empty').classList.remove('hidden');
    document.getElementById('editor-content').classList.add('hidden');
    toast('Build limpa!');
}

async function resetSave(){
    const ok = await confirmDialog('Apagar tudo e resetar o Laboratório? Isso perderá TODAS as armas, armaduras e builds salvas!');
    if(ok){ localStorage.clear(); location.reload(); }
}

// ── Admin — dropdowns ────────────────────────────────────
function injectSlotOptions(){
    // ◆ é o símbolo do adorno no jogo — funciona em todas as options
    const opts = `<option value="0">Vazio</option>`
        + [4,3,2,1].map(n=>`<option value="${n}">◆ ${n}</option>`).join('');
    ['adm-w-slot-1','adm-w-slot-2','adm-w-slot-3','adm-a-slot-1','adm-a-slot-2','adm-a-slot-3'].forEach(id=>{
        const el=document.getElementById(id); if(el) el.innerHTML=opts;
    });
    const jOpts = [4,3,2,1].map((n,i)=>`<option value="${n}"${i===0?' selected':''}>◆ ${n}</option>`).join('');
    const jSlot = document.getElementById('adm-j-s');
    if(jSlot) jSlot.innerHTML=jOpts;
}

function populateDropdowns(){
    // Sets
    const setsHtml = masterSets.map(s=>`<option value="${s}">${s}</option>`).join('');
    const setEl=document.getElementById('adm-a-set');
    if(setEl) setEl.innerHTML=setsHtml;

    // Habilidades — ordenadas, com fallback se vazio
    const skills = Object.keys(maxSkills).sort();
    const hasSkills = skills.length > 0;
    const skillsHtml = '<option value="">Nenhuma</option>' +
        (hasSkills ? skills.map(s=>`<option value="${s}">${s}</option>`).join('') :
        '<option value="" disabled>— Adicione habilidades em dados.js —</option>');

    ['adm-a-sk1-n','adm-a-sk2-n','adm-a-sk3-n','adm-j-sk1','adm-j-sk2'].forEach(id=>{
        const el=document.getElementById('adm-'+id) || document.getElementById(id);
        if(el) el.innerHTML=skillsHtml;
    });

    // Skill level selects — máx dinâmico por skill selecionada
    ['adm-a-sk1-n','adm-a-sk2-n','adm-a-sk3-n'].forEach((skId, idx)=>{
        const skEl = document.getElementById(skId);
        if(skEl) skEl.onchange = ()=>updateSkillLevelSelect(skId, `adm-a-sk${idx+1}-v`);
    });
    // Adorno/Amuleto — nível máximo dinâmico
    ['adm-j-sk1','adm-j-sk2'].forEach((skId, idx)=>{
        const skEl = document.getElementById(skId);
        if(skEl){
            skEl.onchange = ()=>updateSkillLevelSelect(skId, `adm-j-v${idx+1}`);
            updateSkillLevelSelect(skId, `adm-j-v${idx+1}`); // estado inicial
        }
    });
    // Estado inicial de todos os selects de nível de habilidade
    ['adm-a-sk1-n','adm-a-sk2-n','adm-a-sk3-n'].forEach((skId, idx)=>{
        updateSkillLevelSelect(skId, `adm-a-sk${idx+1}-v`);
    });

    // Habilidades especiais de arma
    const specialHtml = specialSkills.map(s=>`<option value="${s==='Nenhuma'?'':s}">${s}</option>`).join('');
    const spEl=document.getElementById('adm-w-special-sk');
    if(spEl) spEl.innerHTML=specialHtml;
}

// Atualiza o select de nível conforme o máximo da habilidade
function updateSkillLevelSelect(skillSelectId, levelSelectId){
    const skEl  = document.getElementById(skillSelectId);
    const lvlEl = document.getElementById(levelSelectId);
    if(!skEl || !lvlEl) return;
    const sk  = skEl.value;
    if(!sk){ // habilidade vazia — desabilitar select de nível
        lvlEl.innerHTML='<option value="1"></option>';
        lvlEl.disabled=true;
        lvlEl.style.opacity='0.2';
        return;
    }
    lvlEl.disabled=false;
    lvlEl.style.opacity='1';
    const max = maxSkills[sk] || 5;
    const cur = parseInt(lvlEl.value) || 1;
    let html='';
    for(let i=1;i<=max;i++) html+=`<option value="${i}" ${i===Math.min(cur,max)?'selected':''}>${i}</option>`;
    lvlEl.innerHTML=html;
}

function updateArmorIconTitle(){
    const cat=document.getElementById('adm-a-cat');
    const titleEl=document.getElementById('title-armor');
    if(cat && titleEl) titleEl.innerHTML=`${getIcon(cat.value,26)}<span>Forjar Armadura</span>`;
}

function updateRarityColor(sel){
    sel.className=sel.className.replace(/rarity-\d+/g,'');
    sel.classList.add(`rarity-${sel.value}`);
    // Forçar cor via style inline para garantir em mobile e sobrepor CSS genérico
    const colors={1:'#c8c6c7',2:'#edeef0',3:'#c8d98a',4:'#7ecf9e',5:'#4fa0ad',
        6:'#7248c4',7:'#b8aff0',8:'#d4a090',9:'#c04060',10:'#6fa0f8',11:'#f5d830',12:'#60d8f0'};
    sel.style.setProperty('color', colors[sel.value]||'#d9b85c', 'important');
}

function toggleSharpnessField(){
    const type = document.getElementById('adm-w-type')&&document.getElementById('adm-w-type').value;
    const noSharpTypes = ['Arco','Fuzilarco Leve','Fuzilarco Pesado'];
    const row = document.getElementById('sharpness-row');
    if(row) row.style.display = (type && noSharpTypes.includes(type)) ? 'none' : '';
    if(type && noSharpTypes.includes(type)) setSharp('Nenhuma');
}

function setSharp(color){
    document.getElementById('adm-w-sharp').value=color;
    ['Nenhuma','Vermelha','Laranja','Amarela','Verde','Azul','Branca','Roxa'].forEach(c=>{
        const btn=document.getElementById('btn-sharp-'+c);
        if(!btn) return;
        btn.style.opacity    = c===color ? '1'    : '0.3';
        btn.style.boxShadow  = c===color ? 'inset 0px 0px 0px 3px #e8d5a3, 0 0 10px rgba(232,213,163,0.6)' : 'none';
    });
}

// ── Navegação de views ────────────────────────────────────
function switchView(view){
    document.getElementById('view-build').classList.toggle('hidden', view!=='build');
    const bauEl = document.getElementById('view-bau');
    if(bauEl) bauEl.classList.toggle('hidden', view!=='bau');
    document.getElementById('view-admin').classList.toggle('hidden', view!=='admin');

    ['btn-view-build','btn-view-bau','btn-view-admin'].forEach(id=>{
        const el=document.getElementById(id); if(!el) return;
        el.className = id===('btn-view-'+view) ? 'nav-btn active h-[42px]' : 'nav-btn h-[42px]';
    });

    if(view==='admin'){ renderAdminList(); return; }

    if(view==='bau'){
        renderAdminList();   // amuletos + armas + armaduras
        renderJewelStock();  // adornos (único baú)
        return;
    }

    // view === 'build'
    ALL_SLOTS.forEach(slot=>{
        const list=getList(slot);
        const found=list.find(p=>p.id===build[slot].data.id);
        if(!found){ build[slot].data=list[0]; build[slot].joias=[]; }
        else {
            build[slot].data=found;
            build[slot].joias=(build[slot].joias||[]).map(j=>j?(DB.decorations.find(d=>d.id===j.id)||null):null);
        }
    });
    save(); renderArmorList(); updateAllStats(); renderJewelStock(); renderPresets();
    if(currentActiveSlot) openEditor(currentActiveSlot);
}

// Editar item a partir do Baú: vai ao Ferreiro e executa a função de edição
function editFromBau(fn){
    switchView('admin');
    // Espera o DOM renderizar e então executa
    setTimeout(()=>{ fn(); }, 80);
}

document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ closeStatModal(); } });

window.simulateSharpness = function(level){
    // Re-renderizar stats com nova afiação simulada
    updateAllStats(level);
};

window.toggleBreakdown = function(id){
    // Abrir modal com o conteúdo do breakdown
    const el = document.getElementById(id);
    if(!el) return;
    // Título: extrair do stat-label do card pai
    const card = el.closest('.stat-card');
    const titleEl = card ? card.querySelector('.stat-label') : null;
    const title = titleEl ? titleEl.textContent.trim() : 'Detalhes';
    showStatModal(title, '', el.innerHTML);
};

window.showStatModal = function(title, sub, bodyHtml){
    document.getElementById('stat-modal-title').textContent = title;
    document.getElementById('stat-modal-sub').textContent   = sub||'';
    document.getElementById('stat-modal-body').innerHTML    = bodyHtml;
    document.getElementById('stat-modal').classList.remove('hidden');
};

window.closeStatModal = function(){
    document.getElementById('stat-modal').classList.add('hidden');
};

// ── Renderização — lista de equipamentos ─────────────────
function renderArmorList(){
    const list=document.getElementById('armor-list');
    if(!list) return;
    list.innerHTML = ALL_SLOTS.map(slot=>{
        const item   = build[slot].data;
        const isEmpty= (item.name==='---'||item.n==='---');
        const rClass = getRarityClass(item.rarity);
        const dispName = item.name||item.n;

        const rarityBadge = !isEmpty && item.rarity
            ? `<span class="${rClass} font-bold text-[13px] ml-2 font-cinzel">R | ${item.rarity}</span>` : '';

        let decosHtml='';
        if(!isEmpty && item.slots && item.slots.length>0){
            decosHtml=`<div class="flex flex-wrap gap-2 mt-2.5">`+item.slots.map((s,idx)=>{
                const filled = build[slot].joias && build[slot].joias[idx];
                return filled
                    ? `<span class="slot-gem slot-gem--${s===filled.s?'same':'diff'}" title="${filled.n}" onclick="event.stopPropagation();showJewelModal('${filled.id}')">♦${s}</span>`
                    : `<span class="slot-gem slot-gem--empty">♦${s}</span>`;
            }).join('')+`</div>`;
        }

        return `<div onclick="openEditor('${slot}')" class="slot-card flex items-center gap-3 p-4 bg-[#252016] border border-[#4a412f] cursor-pointer hover:border-[#e8d5a3] transition-all rounded shadow-md group ${isEmpty?'':'border-l-4 !border-l-[#c9a84c]'}">
            ${getIcon(slot,40,item.rarity)}
            <div class="flex-1 overflow-hidden min-w-0">
                <div class="text-[13px] uppercase tracking-[2px] text-[#c9b07a] font-cinzel font-bold flex items-center flex-wrap leading-none">
                    ${locs[slot]}${rarityBadge}
                </div>
                <div class="text-[16px] font-crimson font-bold ${isEmpty?'italic text-[#8a6e3a]':rClass} truncate mt-1.5 leading-none group-hover:text-white">${isEmpty?'— vazio —':dispName}</div>
                ${decosHtml}
            </div>
        </div>`;
    }).join('');
}

// ── Editor central ────────────────────────────────────────
function openEditor(slot){
    currentActiveSlot=slot;
    document.getElementById('editor-empty').classList.add('hidden');
    const content=document.getElementById('editor-content');
    content.classList.remove('hidden');

    const item    = build[slot].data;
    const joias   = build[slot].joias||[];
    const dispName= item.name||item.n;
    const isEmpty = dispName==='---';

    // Header com botões de troca
    const gearList = getList(slot);
    document.getElementById('editor-header').innerHTML=`
    <div class="flex flex-col mb-4">
        <h2 class="flex items-center gap-3 text-2xl font-cinzel font-bold uppercase ${isEmpty?'text-[#8a6e3a]':`rarity-${item.rarity}`} leading-none drop-shadow-md">
            ${getIcon(slot,40,item.rarity)}
            ${isEmpty?'Vazio':dispName}
        </h2>
        <div class="flex items-center gap-3 mt-2">
            ${!isEmpty&&item.rarity?`<span class="text-[13px] font-bold font-cinzel uppercase tracking-wide ${getRarityClass(item.rarity)}">R | ${item.rarity}</span>`:''}
            ${!isEmpty&&slot==='weapon'&&item.weaponType?`<span class="text-[13px] font-cinzel text-[#c9a84c] uppercase tracking-wide">⚔ ${item.weaponType}</span>`:''}
        </div>
    </div>
    <div class="flex flex-wrap gap-2">${gearList.map(p=>{
        const pName=p.name||p.n;
        let short=pName.replace(/^(Elmo|Armadura|Peito|Avambraços|Braços|Cinturão|Cintura|Grevas|Pernas|Arma|Cabeça|Torso)\s+(de\s+)?/i,'').trim();
        const isActive = p.id===item.id;
        const cls = isActive
            ? 'border-[#e8d5a3] text-[#e8d5a3] bg-[#3d3423] shadow-md'
            : `border-[#4a412f] hover:bg-[#2a251b] hover:border-[#e8d5a3] transition ${pName==='---'?'text-[#8a6e3a] italic':getRarityClass(p.rarity)}`;
        return `<button onclick="swapGear('${slot}','${p.id}')" class="text-[14px] font-bold font-crimson px-4 py-2 border rounded ${cls}">${short||pName}</button>`;
    }).join('')}</div>`;

    // Adornos
    if(slot!=='charm'){
        document.getElementById('editor-slots').innerHTML=`
        <h3 class="font-cinzel font-bold text-[14px] text-[#c9b07a] uppercase tracking-[2px] mb-4 border-b border-[#4a412f] pb-2 flex items-center gap-2">
            ${getIcon('decorations',26)} Adornos
        </h3>
        ${isEmpty?'<p class="text-[#4a412f] italic text-sm">Selecione um equipamento primeiro.</p>':
        item.slots.map((s,idx)=>`
            <div class="mb-4">
                <label class="text-[14px] text-[#70b0e0] font-cinzel flex items-center gap-2 leading-none mb-2"><span class="tracking-widest uppercase text-[13px]">Engaste</span><span style="color:#00bfff;font-size:16px">◆${s}</span></label>
                <select onchange="equipJewel('${slot}',${idx},this.value)" class="w-full bg-[#252016] text-[15px] p-2.5 border border-[#4a412f] text-[#d9b85c] hover:border-[#e8d5a3] focus:border-[#e8d5a3] rounded shadow-inner">
                    <option value="">— Vazio —</option>
                    ${[...DB.decorations].filter(d=>d.s<=s).sort((a,b)=>b.s-a.s||a.n.localeCompare(b.n)).map(d=>{
                        const isSelected = joias[idx]&&joias[idx].id===d.id;
                        const avail = getAvailableStock(d.id);
                        if(!isSelected&&avail<=0) return '';
                        const nm = d.n.replace(/^Joia\s+/i,'');
                        return `<option value="${d.id}" ${isSelected?'selected':''}>◆${d.s}  ${nm}  (${avail})</option>`;
                    }).join('')}
                </select>
            </div>`).join('')}`;
    } else {
        document.getElementById('editor-slots').innerHTML='';
    }

    // Info da peça
    let info=`<h3 class="font-cinzel font-bold text-[14px] text-[#c9b07a] uppercase tracking-[2px] mb-4 border-b border-[#4a412f] pb-2">Detalhes</h3>`;
    if(isEmpty){
        info+='<p class="text-[#8a6e3a] italic text-sm">Nenhum equipamento selecionado.</p>';
    } else {
        if(slot==='weapon'){
            info+=`<div class="space-y-2 text-[15px]">
                <p class="text-[#d9b85c]">Ataque: <span class="text-white font-cinzel font-bold">${item.atk}</span></p>
                <p class="text-[#d9b85c]">Afinidade: <span class="text-[#e8d5a3] font-cinzel font-bold">${item.aff}%</span></p>
                ${item.def?`<p class="text-[#d9b85c]">Bônus Defesa: <span class="text-[#70b0e0] font-cinzel font-bold">+${item.def}</span></p>`:''}
                ${item.sharpness&&item.sharpness!=='Nenhuma'?`<div class="flex items-center gap-2 text-[#d9b85c]">Afiação:<div class="w-10 h-2.5 ${sharpColors[item.sharpness]} border border-[#6b5e43] rounded-sm"></div></div>`:''}
                ${item.element&&item.element!=='Nenhum'?`<p class="text-[#d9b85c]">Elemento: <span class="${elementColors[item.element]||'text-[#e06030]'} font-bold">${item.element} ${item.elementVal||''}</span></p>`:''}
                ${item.elderseal&&item.elderseal!=='Nenhum'?`<p class="text-[#d9b85c]">Selo Ancião: <span class="${elementColors['Dragão']} font-bold">${item.elderseal}</span></p>`:''}
            </div>`;
            if(item.specialSkill&&item.specialSkill!==''){
                const encSp=encodeURIComponent(item.specialSkill);
                info+=`<div class="mt-4 pt-3 border-t border-[#4a412f] cursor-pointer hover:bg-[#2a251b] rounded px-1 py-1 transition" onclick="showSkillModal(decodeURIComponent('${encSp}'))">
                    <p class="font-cinzel font-bold text-[#c9a84c] text-[14px] uppercase tracking-[1px] hover:text-white">✦ ${item.specialSkill}</p>
                    <p class="font-crimson text-[13px] text-[#8a7a56] italic mt-0.5">Habilidade Especial da Arma — clique para detalhes</p>
                </div>`;
            }
        } else if(slot!=='charm'){
            info+=`<p class="text-[#d9b85c] mb-3 text-[15px]">Defesa: <span class="text-[#70b0e0] font-cinzel font-bold">${item.def}</span></p>`;
            const rI=['🔥','💧','⚡','❄️','🐉'];
            const rC=['text-[#e06030]','text-[#70b0e0]','text-[#facc15]','text-[#e0f2fe]','text-[#9060c0]'];
            info+=`<div class="flex flex-wrap gap-2 text-[14px] mb-4 font-cinzel font-bold">${item.res.map((r,i)=>`<span class="bg-[#1a160f] px-2 py-1 border border-[#4a412f] rounded ${rC[i]}">${rI[i]} ${r}</span>`).join('')}</div>`;
        }
        if(slot!=='weapon'&&!isEmpty){
            const sks=Object.keys(item.skills||{});
            if(sks.length){
                info+=`<div class="mt-5 pt-4 border-t border-[#3a3020] space-y-2">`;
                sks.forEach(sk=>{
                    const enc=encodeURIComponent(sk);
                    info+=`<div class="flex justify-between items-baseline gap-2 cursor-pointer hover:bg-[#2a251b] rounded px-1 py-0.5 transition" onclick="showSkillModal(decodeURIComponent('${enc}'))">
                        <span class="text-[#a89060] text-[15px] font-crimson leading-none hover:text-[#c9a84c]">✦ ${sk}</span>
                        <span class="text-[#6a5e40] font-cinzel text-[13px] flex-shrink-0">Nv ${item.skills[sk]}</span>
                    </div>`;
                });
                info+=`</div>`;
            }
        }
        if(item.set&&item.set!=='Nenhum'){
            const setB=typeof setBonuses!=='undefined'&&setBonuses[item.set];
            const setId='set-detail-'+slot;
            let setBonusHtml='';
            if(setB && Array.isArray(setB)){
                setBonusHtml=setB.map(b=>{
                    const enc=encodeURIComponent(b.name);
                    return `<div class="flex items-start gap-2 py-2 border-t border-[#3a3020] cursor-pointer hover:bg-[#2a251b] rounded px-1.5 transition" onclick="event.stopPropagation();showSkillModal(decodeURIComponent('${enc}'))">
                        <span class="font-cinzel text-[11px] font-bold text-[#6b5e43] shrink-0 mt-1 w-6">${b.req}p</span>
                        <div class="flex-1">
                            <div class="font-cinzel text-[13px] font-bold text-[#c9a84c] uppercase tracking-wide">✦ ${b.name}</div>
                            <div class="text-[13px] text-[#8a7a56] italic leading-snug mt-0.5">${b.desc}</div>
                        </div>
                    </div>`;
                }).join('');
            } else {
                setBonusHtml=`<p class="text-[14px] text-[#e8d5a3] italic px-1.5 py-2">${setB||item.set}</p>`;
            }
            info+=`<div class="mt-4 pt-3 border-t border-[#3a3020]">
                <button onclick="const d=document.getElementById('${setId}');d.classList.toggle('hidden');this.querySelector('.set-chevron').textContent=d.classList.contains('hidden')?'▶':'▼';"
                    class="w-full flex items-center justify-between font-cinzel font-bold text-[#c9a84c] text-[13px] uppercase tracking-wide hover:text-white transition py-1">
                    <span>⚔ ${item.set}</span>
                    <span class="set-chevron text-[11px]">▶</span>
                </button>
                <div id="${setId}" class="hidden">
                    ${setBonusHtml}
                </div>
            </div>`;
        }
    }
    document.getElementById('editor-info').innerHTML=info;
}

function swapGear(slot, id){
    const l = getList(slot);
    // FIX: usa === para comparação estrita
    const found = l.find(p=>p.id===id);
    if(!found) return;
    build[slot].data  = found;
    build[slot].joias = found.slots ? new Array(found.slots.length).fill(null) : [];
    renderArmorList(); openEditor(slot); updateAllStats(); save(); renderJewelStock();
}

function equipJewel(slot, idx, idStr){
    if(idStr==='') build[slot].joias[idx]=null;
    else build[slot].joias[idx]=DB.decorations.find(d=>d.id===idStr)||null;
    renderArmorList(); updateAllStats(); renderJewelStock(); save();
    // No mobile: fechar drawer e voltar para a lista de equipamentos
    if(window.innerWidth < 1024){
        closeMobileEditor();
        openEditor(slot); // atualiza estado interno sem abrir drawer
    } else {
        openEditor(slot);
    }
}

// ── Estoque de Adornos ────────────────────────────────────
function getAvailableStock(jewelId){
    const j=DB.decorations.find(d=>d.id===jewelId);
    if(!j) return 0;
    const total=j.qtd!==undefined?j.qtd:1;
    let used=0;
    // FIX: inclui charm na contagem (caso futuramente tenha slots)
    ALL_SLOTS.forEach(slot=>{
        if(build[slot].joias) build[slot].joias.forEach(eq=>{ if(eq&&eq.id===jewelId) used++; });
    });
    return total-used;
}

let _bauTypeFilter = 'all';

function filterBauType(type){
    _bauTypeFilter = type;
    // Atualizar botões ativos
    ['all','arm','armor','deco','charm'].forEach(t=>{
        const btn = document.getElementById('bau-f-'+t);
        if(btn) btn.classList.toggle('active', t===type);
    });
    filterBau();
}

function filterBau(){
    const q = (document.getElementById('bau-search')?.value||'').toLowerCase().trim();
    const type = _bauTypeFilter;

    // Seções visíveis por tipo
    const secs = {deco:'bau-section-deco', charm:'bau-section-charm', arm:'bau-section-arm', armor:'bau-section-armor'};
    Object.entries(secs).forEach(([t,id])=>{
        const el = document.getElementById(id);
        if(el) el.style.display = (type==='all'||type===t) ? '' : 'none';
    });

    if(!q){ renderBauItems(null); return; }

    // Filtrar por texto — habilidade, set ou nome
    renderBauItems(q);
}

function renderBauItems(q){
    // Re-renderizar cada seção com filtro aplicado
    renderJewelStock(window._jewelSort||'level', q);
    // Para armas/armaduras/amuletos — filtrar cards existentes por texto
    ['bau-list-weapons','bau-list-charms'].forEach(id=>{
        const container = document.getElementById(id);
        if(!container) return;
        container.querySelectorAll('.bau-card').forEach(card=>{
            const text = card.textContent.toLowerCase();
            card.style.display = (!q||text.includes(q)) ? '' : 'none';
        });
    });
    // Armaduras (múltiplas listas por categoria)
    ['head','chest','arms','waist','legs'].forEach(cat=>{
        const container = document.getElementById('bau-list-'+cat);
        if(!container) return;
        container.querySelectorAll('.bau-card').forEach(card=>{
            const text = card.textContent.toLowerCase();
            card.style.display = (!q||text.includes(q)) ? '' : 'none';
        });
    });
}

function renderJewelStock(sortBy, filterQ){
    if(sortBy===undefined) sortBy=window._jewelSort||'level';
    window._jewelSort=sortBy;
    const container=document.getElementById('jewel-stock-list');
    if(!container) return;
    const q = filterQ ? filterQ.toLowerCase() : '';
    let sorted=[...DB.decorations].sort((a,b)=>{
        if(sortBy==='name') return a.n.localeCompare(b.n);
        return b.s-a.s||a.n.localeCompare(b.n);
    });
    if(q) sorted=sorted.filter(j=>{
        const skNames=j.skills?Object.keys(j.skills).join(' ').toLowerCase():'';
        return j.n.toLowerCase().includes(q)||skNames.includes(q);
    });
    ['jewel-sort-level','jewel-sort-name'].forEach(id=>{
        const el=document.getElementById(id);
        if(el){ el.classList.toggle('!border-[#e8d5a3]',(id==='jewel-sort-level'&&sortBy==='level')||(id==='jewel-sort-name'&&sortBy==='name')); }
    });
    let html=sorted.map(j=>{
        const avail=getAvailableStock(j.id);
        const skillLines=j.skills?Object.keys(j.skills).map(sk=>`<span class="text-[#8a7a56] font-crimson text-[15px] truncate block">${sk} +${j.skills[sk]}</span>`).join(''):'';
        const slotLabel=`<span class="inline-flex items-center gap-1 text-[#00bfff] font-cinzel font-bold text-[14px]" style="text-shadow:0 0 4px rgba(0,191,255,.5)">♦ Slot ${j.s}</span>`;
        const qtdLabel=`<span class="text-[#6b5e43] font-cinzel text-[13px]">× ${j.qtd!==undefined?j.qtd:1}</span>`;
        return `
        <div class="jewel-stock-card flex gap-3 p-3.5 bg-[#252016] border border-[#4a412f] rounded-lg shadow-md hover:border-[#00bfff]/40 transition group cursor-pointer" onclick="showJewelModal('${j.id}')">
            <div class="flex-shrink-0 flex flex-col items-center justify-between gap-2">
                ${getIcon('decorations',36)}
                <div class="flex gap-1" onclick="event.stopPropagation()">
                    <button onclick="changeJewelQtd('${j.id}',-1)" class="w-7 h-7 bg-[#3d3423] hover:bg-[#e84040] border border-[#6b5e43] hover:border-[#e84040] text-[#e8d5a3] font-black text-base flex items-center justify-center transition rounded leading-none" title="Remover 1">-</button>
                    <button onclick="changeJewelQtd('${j.id}',1)"  class="w-7 h-7 bg-[#3d3423] hover:bg-[#60d060] border border-[#6b5e43] hover:border-[#60d060] text-[#e8d5a3] font-black text-base flex items-center justify-center transition rounded leading-none" title="Adicionar 1">+</button>
                </div>
            </div>
            <div class="flex flex-col flex-1 min-w-0 overflow-hidden gap-0.5">
                <span class="text-[15px] font-bold text-[#e8d5a3] line-clamp-2 leading-tight font-crimson">${j.n}</span>
                <div class="flex items-center gap-2 mt-0.5">${slotLabel}${qtdLabel}</div>
                <div class="mt-1">${skillLines}</div>
                <div class="mt-auto pt-2 border-t border-[#3a3020] flex items-center justify-between gap-2">
                    <div>
                        <span class="font-cinzel text-[13px] text-[#6b5e43] uppercase tracking-widest">Disp. </span>
                        <span class="font-cinzel font-bold text-[16px] leading-none ${avail>0?'text-[#60d060]':'text-[#e84040]'}">${avail}</span>
                    </div>
                    <div class="flex gap-1.5" onclick="event.stopPropagation()">
                        <button onclick="editFromBau(function(){loadEditJewel('${j.id}')})" class="nav-btn h-[28px] !text-[11px] !px-2 !text-[#c9a84c] !border-[#c9a84c]/50 hover:bg-[#c9a84c] hover:!text-[#1a160f]">✎ Editar</button>
                        <button onclick="deleteItem('decorations','${j.id}')" class="nav-btn h-[28px] !text-[11px] !px-2 !text-[#e84040] !border-[#e84040]/40 hover:bg-[#e84040] hover:!text-white">✖</button>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
    if(!html) html='<p class="text-[15px] text-[#c9b07a] italic text-center py-8 uppercase tracking-[3px] font-cinzel w-full">Nenhum Adorno no Baú.</p>';
    container.innerHTML=html;
}

function changeJewelQtd(id, amount){
    const j=DB.decorations.find(d=>d.id===id);
    if(!j) return;
    if(j.qtd===undefined) j.qtd=1;
    if(amount<0){
        let used=0;
        ALL_SLOTS.forEach(slot=>{
            if(build[slot].joias) build[slot].joias.forEach(eq=>{ if(eq&&eq.id===id) used++; });
        });
        if(j.qtd<=used){ toast('Não é possível remover: adorno está equipado na Build!','err'); return; }
    }
    j.qtd+=amount; if(j.qtd<0) j.qtd=0;
    save(); renderJewelStock();
    if(currentActiveSlot) openEditor(currentActiveSlot);
}

// ── Presets ───────────────────────────────────────────────
function renderPresets(){
    const sel     = document.getElementById('preset-selector');
    const btnLoad = document.getElementById('btn-load-preset');
    const btnDel  = document.getElementById('btn-del-preset');
    const btnCmp  = document.getElementById('btn-compare-preset');
    if(!sel) return;
    const hasPresets = DB.presets&&Object.keys(DB.presets).length>0;
    sel.classList.toggle('hidden', !hasPresets);
    if(btnLoad) btnLoad.classList.toggle('hidden', !hasPresets);
    if(btnDel)  btnDel.classList.toggle('hidden', !hasPresets);
    if(btnCmp)  btnCmp.classList.toggle('hidden', !hasPresets);
    if(hasPresets) sel.innerHTML=Object.keys(DB.presets).map(p=>`<option value="${p}">${p}</option>`).join('');
}

function comparePreset(){
    const sel = document.getElementById('preset-selector');
    if(!sel||!sel.value) return;
    const name = sel.value;
    const preset = DB.presets[name];
    if(!preset) return;

    // Calcular stats da build atual
    const cur = calcBuildStats(build);
    // Calcular stats do preset
    const pre = calcBuildStats(preset);

    const diffColor = (a,b,higher='good')=>{
        if(a===b) return 'text-[#6b5e43]';
        const better = higher==='good' ? a>b : a<b;
        return better ? 'text-[#60d060]' : 'text-[#e84040]';
    };
    const row = (label, curVal, preVal, unit='', higher='good')=>`
        <tr class="border-b border-[#2a2010]">
            <td class="py-2 pr-3 text-[14px] font-crimson text-[#c9b07a]">${label}</td>
            <td class="py-2 px-2 text-center text-[14px] font-cinzel font-bold ${diffColor(curVal,preVal,higher)}">${curVal}${unit}</td>
            <td class="py-2 px-2 text-center text-[14px] font-cinzel font-bold ${diffColor(preVal,curVal,higher)}">${preVal}${unit}</td>
        </tr>`;

    // Calcular dano real por golpe para cada build
    const calcRealDmg = (b, stats) => {
        const wd = b['weapon']&&b['weapon'].data;
        if(!wd||!wd.weaponType) return null;
        const mv = typeof motionValues!=='undefined' ? motionValues[wd.weaponType] : null;
        if(!mv) return null;
        const sharp = sharpnessMultTable[wd.sharpness]||1;
        const atk = Math.round(stats.atk * sharp);
        const critMlt = 1.25; // base sem Reforço Crítico para comparação
        return mv.golpes.map(g=>({
            nome: g.nome, tipo: g.tipo,
            normal: Math.round(atk * g.mv * 70/100),
            crit:   stats.aff>0 ? Math.round(atk * critMlt * g.mv * 70/100) : null,
            ko:     g.ko||0, ex: g.ex||0,
        })).sort((a,b)=>a.normal-b.normal);
    };
    const curDmg = calcRealDmg(build, cur);
    const preDmg = calcRealDmg(DB.presets[name], pre);
    const tipoCor = {'C':'#e3c421','I':'#c090e0','P':'#70b0e0'};

    const dmgCompareHtml = (curDmg && preDmg) ? `
        <div class="mt-4 pt-3 border-t border-[#4a412f]">
            <div class="text-[12px] font-cinzel text-[#6b5e43] uppercase mb-2">Dano Real por Golpe (Normal, Zona 70)</div>
            <table style="width:100%;border-collapse:collapse">
                <thead><tr style="border-bottom:1px solid #2a2010">
                    <th style="text-align:left;font-size:10px;font-family:'Cinzel',serif;color:#6b5e43;padding:3px 6px">Golpe</th>
                    <th style="text-align:center;font-size:10px;font-family:'Cinzel',serif;color:#e8d5a3;padding:3px 6px">Atual</th>
                    <th style="text-align:center;font-size:10px;font-family:'Cinzel',serif;color:#70b0e0;padding:3px 6px">${name}</th>
                    <th style="text-align:center;font-size:10px;font-family:'Cinzel',serif;color:#6b5e43;padding:3px 6px">Δ</th>
                </tr></thead>
                <tbody>
                ${curDmg.map((cg,i)=>{
                    const pg = preDmg.find(g=>g.nome===cg.nome)||preDmg[i]||cg;
                    const diff = cg.normal - pg.normal;
                    const dColor = diff>0?'#60d060':diff<0?'#e84040':'#6b5e43';
                    return `<tr style="border-bottom:1px solid #1a1608">
                        <td style="padding:4px 6px">
                            <span style="font-family:'Crimson Text',serif;font-size:12px;color:#c9b07a">${cg.nome}</span>
                            <span style="font-size:10px;font-family:'Cinzel',serif;color:${tipoCor[cg.tipo]||'#e3c421'};margin-left:4px">${cg.tipo==='C'?'C':cg.tipo==='I'?'I':'P'}</span>
                        </td>
                        <td style="text-align:center;font-family:'Cinzel',serif;font-size:13px;font-weight:bold;color:#e8d5a3;padding:4px 6px">${cg.normal}</td>
                        <td style="text-align:center;font-family:'Cinzel',serif;font-size:13px;font-weight:bold;color:#70b0e0;padding:4px 6px">${pg.normal}</td>
                        <td style="text-align:center;font-family:'Cinzel',serif;font-size:12px;font-weight:bold;color:${dColor};padding:4px 6px">${diff>0?'+'+diff:diff===0?'=':diff}</td>
                    </tr>`;
                }).join('')}
                </tbody>
            </table>
        </div>` : '';

    const bodyHtml=`
        <table style="width:100%;border-collapse:collapse">
            <thead><tr class="border-b border-[#4a412f]">
                <th class="py-2 pr-3 text-left text-[11px] font-cinzel uppercase text-[#6b5e43]">Stat</th>
                <th class="py-2 px-2 text-center text-[11px] font-cinzel uppercase text-[#e8d5a3]">Atual</th>
                <th class="py-2 px-2 text-center text-[11px] font-cinzel uppercase text-[#70b0e0]">${name}</th>
            </tr></thead>
            <tbody>
                ${row('Ataque', cur.atk, pre.atk)}
                ${row('Afinidade', cur.aff, pre.aff, '%')}
                ${row('Defesa', cur.def, pre.def)}
                ${cur.sharpMult!==1||pre.sharpMult!==1 ? row('Afiação ×', cur.sharpMult.toFixed(2), pre.sharpMult.toFixed(2)) : ''}
                ${row('Res. Fogo', cur.res[0], pre.res[0],'','good')}
                ${row('Res. Água', cur.res[1], pre.res[1],'','good')}
                ${row('Res. Raio', cur.res[2], pre.res[2],'','good')}
                ${row('Res. Gelo', cur.res[3], pre.res[3],'','good')}
                ${row('Res. Dragão', cur.res[4], pre.res[4],'','good')}
            </tbody>
        </table>
        ${dmgCompareHtml}
        <div class="mt-4 pt-3 border-t border-[#4a412f]">
            <div class="text-[12px] font-cinzel text-[#6b5e43] uppercase mb-2">Habilidades diferentes</div>
            ${(()=>{
                const allSk=new Set([...Object.keys(cur.skills),...Object.keys(pre.skills)]);
                let rows='';
                allSk.forEach(s=>{
                    const cv=cur.skills[s]||0, pv=pre.skills[s]||0;
                    if(cv===pv) return;
                    rows+=`<div class="flex justify-between text-[13px] py-1 border-b border-[#1e1a10]">
                        <span class="font-crimson text-[#c9b07a]">${s}</span>
                        <span>
                            <span class="${cv>pv?'text-[#60d060]':'text-[#e84040]'} font-cinzel font-bold">${cv>0?'Nv '+cv:'—'}</span>
                            <span class="text-[#4a412f] mx-1">→</span>
                            <span class="${pv>cv?'text-[#60d060]':'text-[#e84040]'} font-cinzel font-bold">${pv>0?'Nv '+pv:'—'}</span>
                        </span>
                    </div>`;
                });
                return rows||'<p class="text-[#6b5e43] italic text-[13px]">Mesmas habilidades.</p>';
            })()}
        </div>`;

    showStatModal('⇄ Comparar Builds', 'Atual vs '+name, bodyHtml);
}

// Calcular stats resumidos de uma build (para comparação)
function calcBuildStats(b){
    let atk=0,aff=0,def=0,res=[0,0,0,0,0],skills={},sharpMult=1;
    ALL_SLOTS.forEach(slot=>{
        const it=b[slot]&&b[slot].data;
        if(!it||it.name==='---'||it.n==='---') return;
        if(slot==='weapon'){
            atk=it.atk||0; aff=it.aff||0;
            if(it.sharpness&&sharpnessMultTable[it.sharpness]) sharpMult=sharpnessMultTable[it.sharpness];
        } else if(slot!=='charm'){
            def+=it.def||0;
            if(it.res) it.res.forEach((r,i)=>res[i]+=r);
        }
        if(it.skills&&slot!=='weapon') Object.keys(it.skills).forEach(s=>skills[s]=(skills[s]||0)+it.skills[s]);
        if(b[slot].joias) b[slot].joias.forEach(j=>{ if(j?.skills) Object.keys(j.skills).forEach(s=>skills[s]=(skills[s]||0)+j.skills[s]); });
    });
    // Aplicar Reforço de Ataque e Olho Crítico
    const atkLvl=skills['Reforço de Ataque']||0;
    const atkBt=[0,3,6,9,12,15,18,21];
    atk+=atkBt[Math.min(atkLvl,7)];
    const oCritT=[0,5,10,15,20,25,30,40];
    aff+=(oCritT[Math.min(skills['Olho Crítico']||0,7)])+(atkLvl>=4?5:0);
    const defLvl=skills['Reforço de Defesa']||0;
    const defFt=[0,5,10,10,20,20,35,35],defPt=[0,0,0,5,5,8,8,10];
    def+=Math.round(def*defPt[Math.min(defLvl,7)]/100)+defFt[Math.min(defLvl,7)];
    return {atk,aff,def,res,skills,sharpMult};
}

function savePreset(){
    const name=document.getElementById('preset-name').value.trim();
    if(!name){ toast('Digite um nome para a build!','err'); return; }
    if(!DB.presets) DB.presets={};
    DB.presets[name]=JSON.parse(JSON.stringify(build));
    save(); renderPresets();
    document.getElementById('preset-name').value='';
    toast(`Build "${name}" salva!`);
}

function loadPreset(){
    const name=document.getElementById('preset-selector').value;
    if(!name||!DB.presets[name]){ toast('Selecione uma build válida.','err'); return; }
    const preset=DB.presets[name];
    ALL_SLOTS.forEach(slot=>{
        const list=getList(slot);
        // FIX: Re-conecta ao DB atual
        build[slot].data=list.find(p=>p.id===preset[slot].data.id)||list[0];
        build[slot].joias=(preset[slot].joias||[]).map(j=>
            j?DB.decorations.find(d=>d.id===j.id)||null:null
        );
    });
    save(); updateAllStats(); renderArmorList(); renderJewelStock();
    openEditor(currentActiveSlot||'weapon');
    toast(`Build "${name}" carregada!`);
}

async function deletePreset(){
    const name=document.getElementById('preset-selector').value;
    if(!name||!DB.presets[name]){ toast('Selecione uma build para excluir.','err'); return; }
    const ok=await confirmDialog(`Apagar a Build "${name}"?`);
    if(ok){ delete DB.presets[name]; save(); renderPresets(); toast(`Build "${name}" excluída.`); }
}

// ── Stats ─────────────────────────────────────────────────
function renderSkillPips(skillName, currentLevel){
    const max = maxSkills[skillName] || 7;
    const isMaxed = currentLevel >= max;
    let html = '<div class="skill-bar mt-1.5">';
    for(let i = 0; i < max; i++){
        const active = i < currentLevel;
        html += `<div class="skill-pip ${active ? (isMaxed ? 'pip-maxed' : 'pip-active') : 'pip-empty'}"></div>`;
    }
    return html + '</div>';
}

function updateAllStats(sharpnessOverride){
    let atkBase=0, affBase=0, defBaseArmor=0, defWeapon=0;
    let resTotal=[0,0,0,0,0], skills={}, sets={}, defTotal=0;
    let weaponElementHtml='', weaponSharpnessHtml='', weaponSharpnessBase2=null, weaponElemData=null;

    // breakdown detalhado por peça
    let defBreakdown=[], resBreakdown=[[],[],[],[],[]];

    ALL_SLOTS.forEach(slot=>{
        const it=build[slot].data;
        if(!it||it.name==='---'||it.n==='---') return;
        const label=locs[slot]||slot;
        const nm=it.name||it.n;

        if(slot==='weapon'){
            atkBase=it.atk||0; affBase=it.aff||0;
            defWeapon=it.def||0; defTotal+=it.def||0;
            if(it.def) defBreakdown.push({label:'Arma',name:nm,val:it.def,cls:'text-[#c9b07a]'});
            if(it.specialSkill&&it.specialSkill!==''){
                skills[it.specialSkill]=(skills[it.specialSkill]||0)+1;
            }
            if(it.element&&it.element!=='Nenhum'){
                // Salvar dados do elemento — HTML gerado após mvData estar disponível
                weaponElemData = {
                    element:    it.element,
                    elementVal: it.elementVal||0,
                    elderseal:  it.elderseal&&it.elderseal!=='Nenhum' ? it.elderseal : null,
                };
            }
            if(it.sharpness&&it.sharpness!=='Nenhuma'){
                weaponSharpnessBase2=it.sharpness; // salvar para gerar HTML após cálculos
            }
        } else if(slot!=='charm'){
            defBaseArmor+=it.def||0; defTotal+=it.def||0;
            if(it.def) defBreakdown.push({label,name:nm,val:it.def,cls:'text-[#c9b07a]'});
            if(it.res) it.res.forEach((r,i)=>{ resTotal[i]+=r; if(r!==0) resBreakdown[i].push({label,val:r}); });
            if(it.set&&it.set!=='Nenhum') sets[it.set]=(sets[it.set]||0)+1;
        }

        if(it.skills&&slot!=='weapon')
            Object.keys(it.skills).forEach(s=>skills[s]=(skills[s]||0)+it.skills[s]);
        if(build[slot].joias)
            build[slot].joias.forEach(j=>{ if(j?.skills) Object.keys(j.skills).forEach(s=>skills[s]=(skills[s]||0)+j.skills[s]); });
    });

    // ══════════════════════════════════════════════════════════════
    // CÁLCULO COMPLETO DE STATS COM TODAS AS HABILIDADES
    // ══════════════════════════════════════════════════════════════

    // ── ATAQUE ────────────────────────────────────────────────────
    // Reforço de Ataque: +3/+6/+9/+12/+15/+18/+21
    const atkLvl = skills['Reforço de Ataque']||0;
    const atkBonusTable = [0,3,6,9,12,15,18,21];
    const bonusAtk = atkBonusTable[Math.min(atkLvl,7)];
    // Agitador: +4/+8/+12/+16/+20/+24/+28 (ativo)
    const agitLvl = skills['Agitador']||0;
    const agitAtkTable=[0,4,8,12,16,20,24,28];
    const agitAffTable=[0,5,5,7,7,10,15,20];
    const bonusAtkFromAgit = agitAtkTable[Math.min(agitLvl,7)];
    const bonusAffFromAgit = agitAffTable[Math.min(agitLvl,7)];

    const finalAtk = atkBase + bonusAtk + bonusAtkFromAgit;

    // ── AFINIDADE ────────────────────────────────────────────────
    // Reforço de Ataque Nv4+ → +5% afin
    const bonusAffFromAtk = atkLvl>=4 ? 5 : 0;
    // Olho Crítico: +5/+10/+15/+20/+25/+30/+40%
    const oCritLvl = skills['Olho Crítico']||0;
    const oCritTable = [0,5,10,15,20,25,30,40];
    const bonusAffFromOcrit = oCritTable[Math.min(oCritLvl,7)];
    // Poder Latente: +10/+20/+30/+40/+50/+50/+60% (ativo)
    const plLvl = skills['Poder Latente']||0;
    const plAffTable=[0,10,20,30,40,50,50,60];
    const bonusAffFromPL = plAffTable[Math.min(plLvl,7)];
    // Saque Crítico: +30/+60/+100% afin em ataques imediatos
    const saqCritLvl = skills['Saque Crítico']||0;
    const saqCritAffTable=[0,30,60,100];
    const bonusAffFromSaqCrit = saqCritAffTable[Math.min(saqCritLvl,3)];

    const totalBonusAff = bonusAffFromAtk + bonusAffFromOcrit + bonusAffFromAgit + bonusAffFromPL;
    const finalAff = affBase + totalBonusAff;
    const affColor = finalAff>0?'text-[#4090f0]':(finalAff<0?'text-[#e84040]':'text-[#e8d5a3]');
    // Afinidade efetiva em partes fracas (Exploração de Fraqueza)
    const expFraqLvl = skills['Exploração de Fraqueza']||0;
    const expFraqAffTable=[0,10,15,30];
    const bonusAffWeakspot = expFraqAffTable[Math.min(expFraqLvl,3)];
    const affWeakspot = finalAff + bonusAffWeakspot;
    const affWeakspotColor = affWeakspot>0?'text-[#4090f0]':(affWeakspot<0?'text-[#e84040]':'text-[#e8d5a3]');

    // ── AFIAÇÃO / ARTESANATO ─────────────────────────────────────
    // Artesanato aumenta a barra de fio (não muda o nível de afiação — visual apenas)
    const artesLvl = skills['Artesanato']||0;
    const weaponSharpnessBase = build['weapon']&&build['weapon'].data&&build['weapon'].data.sharpness!=='Nenhuma'
        ? build['weapon'].data.sharpness : null;
    const weaponSharpness = sharpnessOverride || weaponSharpnessBase;
    const sharpMult = weaponSharpness ? (sharpnessMultTable[weaponSharpness]||1) : 1;
    // IMPORTANTE: finalAtk é o valor do jogo (já modificado internamente).
    // Afiação NÃO multiplica o ataque exibido — só entra no Dano Real por golpe.
    const finalAtkSharp = finalAtk; // exibição = ataque sem afiação

    // ── DANO EM PARTES FRACAS ────────────────────────────────────
    // Exploração de Fraqueza: +5%/+15%/+20% dano em partes feridas
    const expFraqDmgTable=[0,5,15,20];
    const bonusDmgWeakspot = expFraqDmgTable[Math.min(expFraqLvl,3)];
    const finalAtkWeakspot = Math.round(finalAtkSharp * (1 + bonusDmgWeakspot/100));

    // ── REFORÇO CRÍTICO ──────────────────────────────────────────
    // Bônus de dano em acertos críticos: 25%(base) + Reforço Crítico
    const refCritLvl = skills['Reforço Crítico']||0;
    const critDmgTable=[25,30,35,40]; // base 25%, Nv1=30%, Nv2=35%, Nv3=40%
    const critDmgBonus = critDmgTable[Math.min(refCritLvl,3)];
    // Dano em crítico com afiação
    const finalAtkCrit = Math.round(finalAtkSharp * (1 + critDmgBonus/100));
    // Crítico em partes feridas (combinação de Expl. Fraqueza + Reforço Crítico)
    const finalAtkCritWeak = (finalAtkWeakspot>finalAtkSharp && finalAtkCrit>finalAtkSharp)
        ? Math.round(finalAtkWeakspot * (1 + critDmgBonus/100)) : 0;

    // ── DANO REAL ESTIMADO (Motion Values por golpe) ──────────────
    const weaponData = build['weapon']&&build['weapon'].data;
    const wType = weaponData&&weaponData.weaponType ? weaponData.weaponType : '';
    const mvData = wType && typeof motionValues!=='undefined' ? motionValues[wType] : null;

    // ── Gerar barra de afiação — finalAtk e mvData disponíveis ───
    if(weaponSharpnessBase2){
        const scHex={Vermelha:'#e84040',Laranja:'#e89040',Amarela:'#e8e040',Verde:'#60d060',Azul:'#4090f0',Branca:'#f0f8ff',Roxa:'#c090e0'};
        const sharpOrder=['Vermelha','Laranja','Amarela','Verde','Azul','Branca','Roxa'];
        const curSharp=sharpnessOverride||weaponSharpnessBase2;
        const sharpBtns=sharpOrder.map(s=>{
            const mult=sharpnessMultTable[s]||1;
            const dmg=Math.round(finalAtk*mult);
            const isCur=s===curSharp;
            const borderStyle=isCur?'border:2px solid #fff;box-shadow:0 0 6px rgba(255,255,255,.6);opacity:1':'opacity:0.35';
            return `<button title="${s}: ×${mult} = ${dmg}" onclick="event.stopPropagation();simulateSharpness('${s}')"
                style="flex:1;height:22px;background:${scHex[s]};${borderStyle};border-radius:3px;transition:opacity .15s;cursor:pointer"
                onmouseover="if(this.style.opacity!='1')this.style.opacity='.7'"
                onmouseout="if(this.style.opacity!='1')this.style.opacity='.35'"></button>`;
        }).join('');
        weaponSharpnessHtml=`<div style="display:flex;gap:3px;width:100%;margin-top:6px">${sharpBtns}</div>`;
    }

    // ── Gerar elemento AGORA que mvData está disponível ──────────
    if(weaponElemData){
        const ed = weaponElemData;
        const eCors={Fogo:'#e06030',Água:'#70b0e0',Raio:'#facc15',Gelo:'#e0f2fe',Dragão:'#9060c0'};
        const eIcons={Fogo:'🔥',Água:'💧',Raio:'⚡',Gelo:'❄️',Dragão:'🐉'};
        const eCor  = eCors[ed.element]||'#e06030';
        const eBase = ed.elementVal/10;
        const elemRowsHtml = mvData ? mvData.golpes.slice().sort((a,b)=>(a.el||0)-(b.el||0)).map(g=>{
            const dmg = Math.round(eBase*(g.el||0));
            return `<div class="flex justify-between items-center py-1 border-b border-[#1e1a10] last:border-0">
                <span class="font-crimson text-[13px] text-[#c9b07a]">${g.nome}</span>
                <div class="flex items-center gap-3">
                    <span class="font-cinzel text-[11px] text-[#4a412f]">×${(g.el||0).toFixed(1)}</span>
                    <span class="font-cinzel font-bold text-[14px]" style="color:${eCor}">${dmg>0?dmg:'—'}</span>
                </div>
            </div>`;
        }).join('') : '';
        const elderMap = {'Baixo':'~33%','Médio':'~66%','Alto':'~100%'};
        const eldersealHtml = ed.elderseal
            ? `<div class="mt-2 pt-2 border-t border-[#3a3020]">
                <span style="color:#9060c0;font-family:'Cinzel',serif;font-size:11px;text-transform:uppercase">🐉 Selo Ancião: ${ed.elderseal}</span>
                <span style="color:#6b5e43;font-size:10px;margin-left:6px">(${elderMap[ed.elderseal]||'?'} chance de suprimir aura)</span>
               </div>` : '';
        weaponElementHtml=`
        <div class="stat-card cursor-pointer hover:border-[#e8d5a3] transition rounded shadow-md" onclick="toggleBreakdown('breakdown-ele')">
            <div class="flex justify-between items-center">
                <span class="stat-label">Elemento</span>
                <span style="color:${eCor}" class="font-cinzel font-bold text-lg leading-none">${eIcons[ed.element]||''} ${ed.element} ${ed.elementVal||''}</span>
            </div>
            <div class="stat-breakdown hidden mt-2" id="breakdown-ele">
                <div class="text-[11px] font-cinzel text-[#6b5e43] mb-2 italic">Base ${eBase.toFixed(1)} × mult. golpe · Hitzone elemental varia por monstro</div>
                ${elemRowsHtml}
                ${eldersealHtml}
            </div>
        </div>`;
    }
    const hitzoneNormal = 70;
    const hitzoneWeak   = 80;
    const hitzoneToco   = 45; // toco da área de treinamento
    const atkWithSharp = Math.round(finalAtk * sharpMult);
    const critMult = 1 + critDmgBonus/100;
    // Calcular dano por golpe
    // Multiplicadores de habilidades de status
    const koMult  = 1 + (skills['Atordoante']     ? [0,.20,.30,.40,.50,.60][Math.min(skills['Atordoante'],5)]     : 0);
    const exMult  = 1 + (skills['Ladrão de Vigor'] ? [0,.20,.30,.40,.50,.60][Math.min(skills['Ladrão de Vigor'],5)]: 0);
    const qpMult  = 1 + (skills['Quebra-parte']    ? [0,.10,.20,.30][Math.min(skills['Quebra-parte'],3)]           : 0);

    const tipoNome = { 'C':'Corte', 'I':'Impacto', 'P':'Projétil' };
    const tipoCor  = { 'C':'#e3c421', 'I':'#c090e0', 'P':'#70b0e0' };

    // Elemento da arma
    const wData    = build['weapon']&&build['weapon'].data;
    const hasElem  = wData&&wData.element&&wData.element!=='Nenhum'&&wData.elementVal;
    // O jogo divide o elementVal por 10 internamente
    const elemBase = hasElem ? (wData.elementVal/10) : 0;
    const elemNome = hasElem ? wData.element : '';
    const elemIcon = {Fogo:'🔥',Água:'💧',Raio:'⚡',Gelo:'❄️',Dragão:'🐉'};
    const elemCor  = {Fogo:'#e06030',Água:'#70b0e0',Raio:'#facc15',Gelo:'#e0f2fe',Dragão:'#9060c0'};
    // Elderseal info
    const elderseal = wData&&wData.elderseal&&wData.elderseal!=='Nenhum' ? wData.elderseal : null;
    const eldersealChance = {Baixo:'~33%', Médio:'~66%', Alto:'~100%'};

    const realDmgGolpes = mvData ? mvData.golpes.map(g=>{
        const tocoVal  = Math.round(atkWithSharp * g.mv * hitzoneToco/100);
        const normalVal= Math.round(atkWithSharp * g.mv * hitzoneNormal/100);
        const fracoVal = Math.round(atkWithSharp * g.mv * hitzoneWeak/100);
        const koBase   = g.ko||0;
        const exBase   = g.ex||0;
        const elMult   = g.el!=null ? g.el : 1.0;
        const isQP     = g.tipo!=='P';
        // Dano elemental = (elemBase) × elMult (hitzone elemental varia por monstro)
        const elemDmg  = hasElem ? Math.round(elemBase * elMult) : 0;
        return {
            nome:      g.nome,
            mv:        g.mv,
            tipo:      g.tipo||'C',
            toco:      tocoVal,
            normal:    normalVal,
            fraco:     fracoVal,
            crit:      finalAff>0 ? Math.round(atkWithSharp * critMult * g.mv * hitzoneNormal/100) : null,
            critFraco: finalAff>0 ? Math.round(atkWithSharp * critMult * g.mv * hitzoneWeak/100)  : null,
            ko:        koBase>0 ? Math.round(koBase * koMult) : 0,
            ex:        exBase>0 ? Math.round(exBase * exMult) : 0,
            qpBonus:   isQP&&qpMult>1 ? Math.round(normalVal*qpMult)-normalVal : 0,
            elemDmg,
            elMult,
        };
    }).sort((a,b)=>a.normal-b.normal) : null;
    const mv = realDmgGolpes ? realDmgGolpes[0].mv : null;
    const realDmgBase     = realDmgGolpes ? realDmgGolpes[0].normal : null;
    const realDmgWeak     = realDmgGolpes ? realDmgGolpes[0].fraco  : null;
    const realDmgCrit     = realDmgGolpes ? realDmgGolpes[0].crit   : null;
    const realDmgWeakCrit = realDmgGolpes ? realDmgGolpes[0].critFraco : null;

    // ── QUEBRA-PARTE ─────────────────────────────────────────────
    const qpLvl = skills['Quebra-parte']||0;
    const qpDmgTable=[0,10,20,30];
    const bonusDmgQP = qpDmgTable[Math.min(qpLvl,3)];
    const finalAtkQP = Math.round(finalAtkSharp * (1 + bonusDmgQP/100));

    // ── NO AR ────────────────────────────────────────────────────
    const noArLvl = skills['No Ar']||0;
    const finalAtkAir = noArLvl ? Math.round(finalAtkSharp * 1.30) : 0;

    // ── REFORÇO DE VIDA ──────────────────────────────────────────
    const vidaLvl = skills['Reforço de Vida']||0;
    const vidaTable=[0,15,30,50];
    const bonusVida = vidaTable[Math.min(vidaLvl,3)];

    // ── ATORDOANTE / LADRÃO DE VIGOR ─────────────────────────────
    const atordLvl = skills['Atordoante']||0;
    const atordTable=[0,20,30,40,50,60];
    const bonusAtord = atordTable[Math.min(atordLvl,5)];
    const lavLvl = skills['Ladrão de Vigor']||0;
    const lavTable=[0,20,30,40,50,60];
    const bonusLav = lavTable[Math.min(lavLvl,5)];

    // ── DEFESA ───────────────────────────────────────────────────
    // Reforço de Defesa: +5,+10,+5%+10,+5%+20+res3,+8%+20+res3,+8%+35+res5,+10%+35+res5
    const defLvl = skills['Reforço de Defesa']||0;
    const defFlatTable=[0,5,10,10,20,20,35,35];
    const defPctTable=[0,0,0,5,5,8,8,10];
    const defResTable=[0,0,0,0,3,3,5,5];
    const bonusDefFlat = defFlatTable[Math.min(defLvl,7)];
    const bonusDefPct  = defPctTable[Math.min(defLvl,7)];
    const bonusDefRes  = defResTable[Math.min(defLvl,7)];
    const bonusDef = Math.round(defTotal * bonusDefPct/100) + bonusDefFlat;
    const finalDef = defTotal + bonusDef;
    // Resistência bônus do Reforço de Defesa
    if(bonusDefRes>0){
        for(let i=0;i<5;i++) resTotal[i]+=bonusDefRes;
    }

        // helper inline para linhas de breakdown
    const bd = (label, val, cls='text-[#e8d5a3]') =>
        `<div class="flex justify-between"><span class="text-[#c9b07a]">${label}:</span><span class="${cls}">${val}</span></div>`;
    const bdBonus = (label, val, unit='') => val ?
        `<div class="flex justify-between"><span class="text-[#c9b07a]">${label}:</span><span class="text-[#60d060]">+${val}${unit}</span></div>` : '';

document.getElementById('offense-display').innerHTML=`
        <div class="stat-card rounded shadow-md">
            <!-- Linha principal: Ataque -->
            <div class="flex justify-between items-center cursor-pointer hover:opacity-80 transition" onclick="toggleBreakdown('breakdown-atk')">
                <span class="stat-label">Ataque</span>
                <span class="text-[#e8d5a3] font-cinzel font-bold text-[20px] leading-none">${finalAtkSharp}</span>
            </div>
            <!-- Barra de afiação (se existir) -->
            ${weaponSharpnessHtml ? `<div class="mt-2">${weaponSharpnessHtml}</div>` : ''}
            <!-- Breakdown: fontes do ataque -->
            <div class="stat-breakdown hidden mt-2" id="breakdown-atk">
                ${bd('Base', atkBase)}

                ${bdBonus('Reforço de Ataque', bonusAtk)}
                ${bdBonus('Agitador', bonusAtkFromAgit)}
            </div>
        </div>
        <!-- Cenários de dano bruto -->
        ${(finalAtkWeakspot>finalAtkSharp||finalAtkCrit>finalAtkSharp||finalAtkCritWeak) ? `
        <div class="stat-card rounded shadow-md cursor-pointer hover:border-[#e8d5a3] transition" onclick="toggleBreakdown('breakdown-scenarios')">
            <div class="flex justify-between items-center">
                <span class="stat-label">Cenários <span class="text-[12px] font-crimson normal-case font-normal text-[#8a7a56]">(ataque bruto)</span></span>
                <span class="text-[#8a7a56] font-cinzel text-[13px]">▼</span>
            </div>
            <div class="stat-breakdown hidden mt-2 space-y-1" id="breakdown-scenarios">
                ${finalAtkCrit>finalAtkSharp ? `<div class="flex justify-between"><span class="text-[#c9b07a]">Crítico:</span><span class="text-[#4090f0] font-cinzel font-bold">${finalAtkCrit}</span></div>` : ''}
                ${finalAtkWeakspot>finalAtkSharp ? `<div class="flex justify-between"><span class="text-[#c9b07a]">PF:</span><span class="text-[#e3c421] font-cinzel font-bold">${finalAtkWeakspot}</span></div>` : ''}
                ${finalAtkCritWeak ? `<div class="flex justify-between"><span class="text-[#c9b07a]">PF/CRIT:</span><span class="text-[#00bfff] font-cinzel font-bold">${finalAtkCritWeak}</span></div>` : ''}
                ${finalAtkQP>finalAtkSharp ? `<div class="flex justify-between"><span class="text-[#c9b07a]">Quebra-parte:</span><span class="text-[#c090e0] font-cinzel font-bold">${finalAtkQP}</span></div>` : ''}
                ${finalAtkAir ? `<div class="flex justify-between"><span class="text-[#c9b07a]">No Ar:</span><span class="text-[#facc15] font-cinzel font-bold">${finalAtkAir}</span></div>` : ''}
            </div>
        </div>` : ''}
        <!-- Dano Real por golpe — tabela HTML real -->
        ${realDmgGolpes ? (()=>{
            const hasCrit = finalAff>0;
            const hasCPF  = finalAff>0;
            const hasKO   = realDmgGolpes.some(g=>g.ko>0);
            const hasEX   = realDmgGolpes.some(g=>g.ex>0);
            const hasQP   = realDmgGolpes.some(g=>g.qpBonus>0);
            const thCls = 'py-1 px-2 text-[10px] font-cinzel uppercase tracking-wide text-center';
            const tdCls = 'py-1.5 px-2 text-[13px] font-cinzel font-bold text-center tabular-nums';
            const tipoNome = { 'C':'Corte', 'I':'Impacto', 'P':'Projétil' };
            const tipoCor  = { 'C':'#e3c421', 'I':'#c090e0', 'P':'#70b0e0' };
            return `
        <div class="stat-card rounded shadow-md cursor-pointer hover:border-[#e8d5a3] transition" onclick="toggleBreakdown('breakdown-real-dmg')">
            <div class="flex justify-between items-center">
                <span class="stat-label">Dano Real / Golpe</span>
                <span class="text-[#8a7a56] font-cinzel text-[13px]">▼</span>
            </div>
            <div class="stat-breakdown hidden mt-3 overflow-x-auto" id="breakdown-real-dmg">
                <table style="width:100%;border-collapse:collapse">
                    <thead>
                        <tr style="border-bottom:1px solid #2a2010">
                            <th class="${thCls} text-left" style="color:#6b5e43;min-width:110px">Golpe</th>
                            <th class="${thCls}" style="color:#c9b07a;min-width:48px">Treino</th>
                            <th class="${thCls}" style="color:#8a8a8a;min-width:48px">Normal</th>
                            <th class="${thCls}" style="color:#ffffff;min-width:48px">PF</th>
                            ${hasCrit ? `<th class="${thCls}" style="color:#e3c421;min-width:48px">CRIT</th>` : ''}
                            ${hasCPF  ? `<th class="${thCls}" style="color:#38bdf8;text-shadow:0 0 4px rgba(56,189,248,0.5);min-width:52px">PF/CRIT</th>` : ''}
                            ${hasKO   ? `<th class="${thCls}" style="color:#c090e0;min-width:44px">KO</th>` : ''}
                            ${hasEX   ? `<th class="${thCls}" style="color:#70b0e0;min-width:40px">EX</th>` : ''}
                            ${hasQP   ? `<th class="${thCls}" style="color:#f97316;min-width:44px">QP</th>` : ''}
                        </tr>
                    </thead>
                    <tbody>
                        ${realDmgGolpes.map(g=>`
                        <tr style="border-bottom:1px solid #1a1608">
                            <td style="padding:5px 8px">
                                <div class="font-crimson text-[13px] leading-tight" style="color:#c9b07a">${g.nome}</div>
                                <div class="font-cinzel text-[10px]">
                                    <span style="color:${tipoCor[g.tipo]||'#e3c421'}">${tipoNome[g.tipo]||'Corte'}</span>
                                    <span style="color:#3a3020"> · MV ${(g.mv*100).toFixed(0)}%</span>
                                </div>
                            </td>
                            <td class="${tdCls}" style="color:#c9b07a">${g.toco}</td>
                            <td class="${tdCls}" style="color:#8a8a8a">${g.normal}</td>
                            <td class="${tdCls}" style="color:#ffffff">${g.fraco}</td>
                            ${hasCrit ? `<td class="${tdCls}" style="color:#e3c421">${g.crit||'—'}</td>` : ''}
                            ${hasCPF  ? `<td class="${tdCls}" style="color:#38bdf8;text-shadow:0 0 4px rgba(56,189,248,0.5)">${g.critFraco||'—'}</td>` : ''}
                            ${hasKO   ? `<td class="${tdCls}" style="color:#c090e0">${g.ko>0?g.ko:'—'}</td>` : ''}
                            ${hasEX   ? `<td class="${tdCls}" style="color:#70b0e0">${g.ex>0?g.ex:'—'}</td>` : ''}
                            ${hasQP   ? `<td class="${tdCls}" style="color:#f97316">${g.qpBonus>0?'+'+g.qpBonus:'—'}</td>` : ''}
                        </tr>`).join('')}
                    </tbody>
                </table>
                <!-- Legenda das colunas de status -->
                <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;padding-top:6px;border-top:1px solid #2a2010">
                    <span style="font-size:10px;color:#6b5e43;font-style:italic">Afiação ×${sharpMult.toFixed(2)}</span>
                    ${hasKO ? `<span style="font-size:10px;color:#c090e0">● KO/hit${koMult>1?' ×'+koMult.toFixed(2):''}</span>` : ''}
                    ${hasEX ? `<span style="font-size:10px;color:#70b0e0">● EX/hit${exMult>1?' ×'+exMult.toFixed(2):''}</span>` : ''}
                    ${hasQP ? `<span style="font-size:10px;color:#f97316">● QP = Quebra-parte Nv${skills['Quebra-parte']||0}</span>` : ''}
                </div>


            </div>
        </div>`;
        })() : ''}
        <!-- Afinidade -->
        <div class="stat-card cursor-pointer hover:border-[#e8d5a3] transition rounded shadow-md" onclick="toggleBreakdown('breakdown-aff')">
            <div class="flex justify-between items-center">
                <span class="stat-label">Afinidade</span>
                <span class="${affColor} font-cinzel font-bold text-[20px] leading-none">${finalAff}%</span>
            </div>
            <div class="stat-breakdown hidden" id="breakdown-aff">
                ${bd('Arma', affBase+'%')}
                ${bdBonus('Reforço de Ataque', bonusAffFromAtk, '%')}
                ${bdBonus('Olho Crítico', bonusAffFromOcrit, '%')}
                ${bdBonus('Agitador', bonusAffFromAgit, '%')}
                ${bdBonus('Poder Latente', bonusAffFromPL, '%')}
                ${bonusAffWeakspot ? `<div class="flex justify-between mt-1 pt-1 border-t border-[#3a3020]"><span class="text-[#c9b07a]">PF (afin.):</span><span class="text-[#e3c421]">+${bonusAffWeakspot}% → ${affWeakspot}%</span></div>` : ''}
                ${bonusDmgWeakspot ? `<div class="flex justify-between"><span class="text-[#c9b07a]">PF (dano):</span><span class="text-[#e3c421]">+${bonusDmgWeakspot}%</span></div>` : ''}
                ${bonusAffFromSaqCrit ? `<div class="flex justify-between"><span class="text-[#c9b07a]">Saque Crítico:</span><span class="text-[#4090f0]">+${bonusAffFromSaqCrit}%</span></div>` : ''}
            </div>
        </div>
        <!-- Bônus de atordoamento/exaustão (compactos) -->
        ${(bonusAtord||bonusLav) ? `
        <div class="stat-card rounded shadow-md">
            ${bonusAtord ? `<div class="flex justify-between items-center ${bonusLav?'mb-1':''}"><span class="stat-label">Atordoamento</span><span class="text-[#e8d5a3] font-cinzel font-bold text-[18px]">+${bonusAtord}%</span></div>` : ''}
            ${bonusLav   ? `<div class="flex justify-between items-center"><span class="stat-label">Exaustão</span><span class="text-[#e8d5a3] font-cinzel font-bold text-[18px]">+${bonusLav}%</span></div>` : ''}
        </div>` : ''}
        ${weaponElementHtml}`;

    

    document.getElementById('defense-display').innerHTML=`
        ${bonusVida ? `
        <div class="stat-card cursor-pointer hover:border-[#e8d5a3] transition rounded shadow-md" onclick="toggleBreakdown('breakdown-vida')">
            <div class="flex justify-between items-center">
                <span class="stat-label">Vida</span>
                <span class="text-[#60d060] font-cinzel font-bold text-[20px] leading-none">+${bonusVida}</span>
            </div>
            <div class="stat-breakdown hidden" id="breakdown-vida">
                ${bd('Reforço de Vida Nv'+vidaLvl, '+'+bonusVida)}
            </div>
        </div>` : ''}
        <div class="stat-card cursor-pointer hover:border-[#e8d5a3] transition rounded shadow-md" onclick="toggleBreakdown('breakdown-def')">
            <div class="flex justify-between items-center">
                <span class="stat-label">Defesa</span>
                <span class="text-[#e8d5a3] font-cinzel font-bold text-[20px] leading-none">${finalDef}</span>
            </div>
            <div class="stat-breakdown hidden" id="breakdown-def">
                ${defBreakdown.map(d=>`<div class="flex justify-between"><span class="text-[#c9b07a]">${d.label}:</span><span class="text-[#e8d5a3]">${d.val}</span></div>`).join('')}
                ${bdBonus('Reforço (flat)', bonusDefFlat)}
                ${bdBonus('Reforço (%)', bonusDefPct, '%')}
            </div>
        </div>`;

    

    const resIcons=['🔥','💧','⚡','❄️','🐉'];
    const resNames=['Fogo','Água','Raio','Gelo','Dragão'];
    const resColors=['text-[#e06030]','text-[#70b0e0]','text-[#facc15]','text-[#e0f2fe]','text-[#9060c0]'];
    document.getElementById('resist-display').innerHTML=resTotal.map((r,i)=>{
        const bdId='breakdown-res-'+i;
        const details=resBreakdown[i].map(d=>`<div class="flex justify-between text-[12px]"><span class="text-[#c9b07a]">${d.label}:</span><span class="${d.val<0?'text-[#e84040]':resColors[i]}">${d.val>0?'+'+d.val:d.val}</span></div>`).join('');
        return `<div class="bg-[#252016] py-2.5 px-1 border border-[#6b5e43] text-center flex flex-col items-center justify-center rounded shadow-md cursor-pointer hover:border-[#e8d5a3] transition" onclick="toggleBreakdown('${bdId}')">
            <span class="text-[13px] font-cinzel font-bold ${resColors[i]} mb-1 leading-none">${resIcons[i]}</span>
            <span class="text-[16px] font-cinzel font-bold ${r<0?'text-[#e84040]':resColors[i]} leading-none mt-0.5">${r}</span>
            ${details?`<div class="stat-breakdown hidden text-left w-full px-1 mt-1" id="${bdId}">${details}</div>`:''}
        </div>`;
    }).join('');

    // Skills — apenas habilidades ativas na build atual
    let skillsHtml=Object.keys(skills).sort().map(s=>{
        let lvl=skills[s];
        const max=maxSkills[s]||7;
        const isMaxed=lvl>=max;
        const enc=encodeURIComponent(s);
        return `
        <div class="p-3 bg-[#252016] border ${isMaxed?'border-[#e8d5a3]/50':'border-[#6b5e43]'} flex items-center justify-between rounded shadow-sm group hover:border-[#e8d5a3] transition cursor-pointer" onclick="showSkillModal(decodeURIComponent('${enc}'))" data-skill="${enc}">
            <div class="flex flex-col">
                <span class="text-[15px] font-bold font-crimson ${isMaxed?'text-[#e8d5a3]':'text-[#c9b07a]'} group-hover:text-white">${s}</span>
                ${renderSkillPips(s,lvl)}
            </div>
            <span class="font-cinzel text-[14px] font-bold ${isMaxed?'text-[#e8d5a3]':'text-[#8a6e3a]'}">${lvl}/${max}</span>
        </div>`;
    }).join('');

    // ── Sets ativos — suporte a múltiplos bônus por nível ──────
    let activeSetsHeader='';
    let setsDisplayHtml='';
    // Bônus de set — mostrar TODOS (ativos em dourado, inativos em cinza)
    // agrupados por set, clicáveis, mostrando req e desc no modal
    Object.keys(sets).sort().forEach(setName=>{
        if(setName==='Nenhum'||!setName) return;
        const count=sets[setName];
        const bonuses=typeof setBonuses!=='undefined'&&setBonuses[setName];

        if(bonuses && Array.isArray(bonuses)){
            bonuses.forEach(b=>{
                const isActive=count>=b.req;
                // Montar info completa para o modal ao clicar
                const modalInfo=encodeURIComponent(JSON.stringify({
                    name:b.name, setName, req:b.req, desc:b.desc, count
                }));
                setsDisplayHtml+=`
                <div class="px-3 py-2.5 bg-[#252016] border ${isActive?'border-[#c9a84c]/50':'border-[#3a3020]'} flex items-center justify-between rounded shadow-sm group hover:border-[#e8d5a3] transition cursor-pointer"
                    onclick="showSetBonusModal(decodeURIComponent('${modalInfo}'))">
                    <span class="text-[15px] font-bold font-crimson ${isActive?'text-[#e8d5a3]':'text-[#6b5e43]'} group-hover:text-white leading-tight">${b.name}</span>
                    <span class="font-cinzel text-[14px] font-bold ${isActive?'text-[#c9a84c]':'text-[#4a412f]'} ml-2 shrink-0">${count}/${b.req}</span>
                </div>`;
            });
        } else {
            const desc=bonuses||`Bônus de ${setName}`;
            const match=desc.match(/(\d+)\s*(pe[çc]|pea)/i);
            const req=match?parseInt(match[1]):2;
            const isActive=count>=req;
            const skillName=desc.includes(':')?desc.split(':')[1].trim():setName;
            const modalInfo=encodeURIComponent(JSON.stringify({
                name:skillName, setName, req, desc, count
            }));
            setsDisplayHtml+=`
            <div class="px-3 py-2.5 bg-[#252016] border ${isActive?'border-[#c9a84c]/50':'border-[#3a3020]'} flex items-center justify-between rounded shadow-sm group hover:border-[#e8d5a3] transition cursor-pointer"
                onclick="showSetBonusModal(decodeURIComponent('${modalInfo}'))">
                <span class="text-[15px] font-bold font-crimson ${isActive?'text-[#e8d5a3]':'text-[#6b5e43]'} group-hover:text-white">${skillName}</span>
                <span class="font-cinzel text-[14px] font-bold ${isActive?'text-[#c9a84c]':'text-[#4a412f]'} ml-2 shrink-0">${count}/${req}</span>
            </div>`;
        }
    });

    // Badges de set ativo no header E texto completo abaixo das skills
    document.getElementById('active-set-bonuses').innerHTML=activeSetsHeader;
    // Sets aparecem ABAIXO das habilidades comuns no skill-display
    const setsWrapped = setsDisplayHtml
        ? `<div class="border-t border-[#4a412f] mt-3 pt-3 flex flex-col gap-1.5">${setsDisplayHtml}</div>` : '';
    document.getElementById('skill-display').innerHTML=`<div class="flex flex-col gap-2">${skillsHtml}</div>`+setsWrapped;
}

// ── Admin — CRUD ──────────────────────────────────────────
function adminSaveWeapon(){
    const name=document.getElementById('adm-w-name').value.trim();
    if(!name){ toast('Dê um nome à arma!','err'); return; }
    const slots=[]; [1,2,3].forEach(i=>{ const v=parseInt(document.getElementById(`adm-w-slot-${i}`).value); if(v>0) slots.push(v); });
    // Clampar valores para faixas realistas
    const clamp=(v,mn,mx)=>Math.max(mn,Math.min(mx,v||0));
    const weapon={
        id: editingWeaponId||'w_'+Date.now(), name,
        weaponType: document.getElementById('adm-w-type').value||'',
        rarity: parseInt(document.getElementById('adm-w-rar').value),
        atk: clamp(parseInt(document.getElementById('adm-w-atk').value),0,9999),
        aff: clamp(parseInt(document.getElementById('adm-w-aff').value),-100,100),
        element: document.getElementById('adm-w-el-type').value,
        elementVal: clamp(parseInt(document.getElementById('adm-w-el-val').value),0,2000),
        elderseal: document.getElementById('adm-w-elder').value,
        sharpness: document.getElementById('adm-w-sharp').value,
        def: clamp(parseInt(document.getElementById('adm-w-def').value),0,500),
        slots, skills:{},
        specialSkill: document.getElementById('adm-w-special-sk').value||''
    };
    if(editingWeaponId){
        const idx=DB.weapons.findIndex(i=>i.id===editingWeaponId);
        if(idx!==-1) DB.weapons[idx]=weapon; else DB.weapons.push(weapon);
    } else { DB.weapons.push(weapon); }
    save(); cancelEditWeapon(); renderAdminList(); updateAllStats();
    toast(editingWeaponId?'Arma atualizada!':'Arma registrada!');
}

function loadEditWeapon(id){
    const it=DB.weapons.find(i=>i.id===id); if(!it) return;
    editingWeaponId=id;
    document.getElementById('adm-w-name').value=it.name;
    if(document.getElementById('adm-w-type')) document.getElementById('adm-w-type').value=it.weaponType||'';
    const rarSel=document.getElementById('adm-w-rar'); rarSel.value=it.rarity||1; updateRarityColor(rarSel);
    document.getElementById('adm-w-atk').value=it.atk||'';
    document.getElementById('adm-w-aff').value=it.aff||'';
    document.getElementById('adm-w-el-type').value=it.element||'Nenhum';
    document.getElementById('adm-w-el-val').value=it.elementVal||'';
    document.getElementById('adm-w-elder').value=it.elderseal||'Nenhum';
    document.getElementById('adm-w-def').value=it.def||'';
    setSharp(it.sharpness||'Vermelha');
    [1,2,3].forEach(i=>document.getElementById(`adm-w-slot-${i}`).value=it.slots[i-1]||0);
    document.getElementById('adm-w-special-sk').value=it.specialSkill||'';
    document.getElementById('btn-save-weapon').innerText='Atualizar Arma';
    document.getElementById('btn-cancel-weapon').classList.remove('hidden');
    scrollToAdmin('form-weapon');
}

function cancelEditWeapon(){
    editingWeaponId=null;
    ['adm-w-name','adm-w-atk','adm-w-aff','adm-w-el-val','adm-w-def'].forEach(id=>document.getElementById(id).value='');
    if(document.getElementById('adm-w-type')) document.getElementById('adm-w-type').value='';
    const r=document.getElementById('adm-w-rar'); r.value=1; updateRarityColor(r);
    document.getElementById('adm-w-el-type').value='Nenhum';
    document.getElementById('adm-w-elder').value='Nenhum';
    setSharp('Vermelha');
    [1,2,3].forEach(i=>document.getElementById(`adm-w-slot-${i}`).value=0);
    document.getElementById('adm-w-special-sk').value='';
    document.getElementById('btn-save-weapon').innerText='Registrar Arma';
    document.getElementById('btn-cancel-weapon').classList.add('hidden');
}

function adminSaveArmor(){
    const cat=document.getElementById('adm-a-cat').value;
    const name=document.getElementById('adm-a-name').value.trim();
    if(!name){ toast('Dê um nome à armadura!','err'); return; }
    const slots=[]; [1,2,3].forEach(i=>{ const v=parseInt(document.getElementById(`adm-a-slot-${i}`).value); if(v>0) slots.push(v); });
    const item={
        id: editingArmorId||'a_'+Date.now(), name,
        rarity: parseInt(document.getElementById('adm-a-rar').value),
        def: clamp(parseInt(document.getElementById('adm-a-def').value),0,500),
        res: [0,1,2,3,4].map(i=>clamp(parseInt(document.getElementById('adm-a-res-'+i).value)||-100,-100,100)),
        slots, skills:{},
        set: document.getElementById('adm-a-set').value||'Nenhum'
    };
    // FIX: suporte a 3 habilidades por peça
    [1,2,3].forEach(i=>{
        const sk=document.getElementById(`adm-a-sk${i}-n`).value;
        if(sk) item.skills[sk]=parseInt(document.getElementById(`adm-a-sk${i}-v`).value)||1;
    });
    if(editingArmorId){
        // FIX: edita in-place em vez de deletar+push (preserva posição)
        let found=false;
        ['head','chest','arms','waist','legs'].forEach(c=>{
            const idx=DB.armors[c].findIndex(i=>i.id===editingArmorId);
            if(idx!==-1){ DB.armors[c][idx]=item; found=true; }
        });
        if(!found) DB.armors[cat].push(item);
    } else { DB.armors[cat].push(item); }
    save(); cancelEditArmor(); renderAdminList(); updateAllStats();
    toast(editingArmorId?'Armadura atualizada!':'Armadura registrada!');
}

function loadEditArmor(cat, id){
    const it=DB.armors[cat].find(i=>i.id===id); if(!it) return;
    editingArmorId=id;
    document.getElementById('adm-a-cat').value=cat;
    document.getElementById('adm-a-name').value=it.name;
    const r=document.getElementById('adm-a-rar'); r.value=it.rarity||1; updateRarityColor(r);
    updateArmorIconTitle();
    document.getElementById('adm-a-set').value=it.set||'Nenhum';
    document.getElementById('adm-a-def').value=it.def||'';
    it.res.forEach((rv,i)=>document.getElementById('adm-a-res-'+i).value=rv);
    [1,2,3].forEach(i=>document.getElementById(`adm-a-slot-${i}`).value=it.slots[i-1]||0);
    const sks=Object.keys(it.skills||{});
    [1,2,3].forEach((i,idx)=>{
        const skEl=document.getElementById(`adm-a-sk${i}-n`);
        const vEl =document.getElementById(`adm-a-sk${i}-v`);
        skEl.value=sks[idx]||'';
        if(sks[idx]){ updateSkillLevelSelect(`adm-a-sk${i}-n`,`adm-a-sk${i}-v`); vEl.value=it.skills[sks[idx]]; }
        else vEl.value='1';
    });
    document.getElementById('btn-save-armor').innerText='Atualizar Armadura';
    document.getElementById('btn-cancel-armor').classList.remove('hidden');
    scrollToAdmin('form-armor');
}

function cancelEditArmor(){
    editingArmorId=null;
    ['adm-a-name','adm-a-def'].forEach(id=>document.getElementById(id).value='');
    const r=document.getElementById('adm-a-rar'); r.value=1; updateRarityColor(r);
    document.getElementById('adm-a-set').value='Nenhum';
    [1,2,3].forEach(i=>document.getElementById(`adm-a-slot-${i}`).value=0);
    [0,1,2,3,4].forEach(i=>document.getElementById(`adm-a-res-${i}`).value='');
    [1,2,3].forEach(i=>{ document.getElementById(`adm-a-sk${i}-n`).value=''; document.getElementById(`adm-a-sk${i}-v`).value='1'; });
    document.getElementById('btn-save-armor').innerText='Registrar Armadura';
    document.getElementById('btn-cancel-armor').classList.add('hidden');
}

function adminSaveJewel(){
    const type=document.getElementById('adm-j-type').value;
    const name=document.getElementById('adm-j-n').value.trim();
    if(!name){ toast('Preencha o nome do acessório!','err'); return; }
    let j={ id: editingJewelId||(type==='charms'?'c_':'j_')+Date.now(), n:name, skills:{} };
    if(type==='decorations'){
        const s=parseInt(document.getElementById('adm-j-s').value);
        if(isNaN(s)||s===0){ toast('Selecione o nível do Adorno!','err'); return; }
        const qInput=document.getElementById('adm-j-qtd').value;
        j.s=s; j.qtd=qInput===''?1:parseInt(qInput);
    } else {
        j.rarity=parseInt(document.getElementById('adm-j-rar').value);
    }
    [1,2].forEach(i=>{ const sk=document.getElementById(`adm-j-sk${i}`).value; if(sk) j.skills[sk]=parseInt(document.getElementById(`adm-j-v${i}`).value)||1; });

    // FIX: detecta tipo pelo prefixo do ID, não por suposição
    if(editingJewelId){
        const isCharmEdit=editingJewelId.startsWith('c_');
        if(isCharmEdit){ const idx=DB.charms.findIndex(i=>i.id===editingJewelId); if(idx!==-1) DB.charms[idx]=j; else DB.charms.push(j); }
        else           { const idx=DB.decorations.findIndex(i=>i.id===editingJewelId); if(idx!==-1) DB.decorations[idx]=j; else DB.decorations.push(j); }
    } else {
        if(type==='charms') DB.charms.push(j); else DB.decorations.push(j);
    }
    save(); cancelEditJewel(); renderAdminList(); renderJewelStock(); updateAllStats();
    toast(editingJewelId?(type==='charms'?'Amuleto atualizado!':'Adorno atualizado!'):(type==='charms'?'Amuleto adicionado!':'Adorno adicionado!'));
}

function loadEditJewel(id){
    const isCharm=id.startsWith('c_');
    const j=isCharm?DB.charms.find(i=>i.id===id):DB.decorations.find(i=>i.id===id);
    if(!j) return;
    editingJewelId=id;
    document.getElementById('adm-j-type').value=isCharm?'charms':'decorations';
    toggleAccType();
    document.getElementById('adm-j-n').value=j.n;
    if(isCharm){ const r=document.getElementById('adm-j-rar'); r.value=j.rarity||1; updateRarityColor(r); }
    else{ document.getElementById('adm-j-s').value=j.s; document.getElementById('adm-j-qtd').value=j.qtd!==undefined?j.qtd:''; }
    const sks=Object.keys(j.skills||{});
    [1,2].forEach((i,idx)=>{ document.getElementById(`adm-j-sk${i}`).value=sks[idx]||''; document.getElementById(`adm-j-v${i}`).value=sks[idx]?j.skills[sks[idx]]:'1'; });
    document.getElementById('btn-save-jewel').innerText=isCharm?'Atualizar Amuleto':'Atualizar Adorno';
    document.getElementById('btn-cancel-jewel').classList.remove('hidden');
    scrollToAdmin('form-jewel');
}

function cancelEditJewel(){
    editingJewelId=null;
    ['adm-j-n','adm-j-s','adm-j-qtd'].forEach(id=>document.getElementById(id).value='');
    const r=document.getElementById('adm-j-rar'); r.value=1; updateRarityColor(r);
    [1,2].forEach(i=>{
        document.getElementById(`adm-j-sk${i}`).value='';
        updateSkillLevelSelect(`adm-j-sk${i}`,`adm-j-v${i}`);
    });
    document.getElementById('btn-cancel-jewel').classList.add('hidden');
    document.getElementById('btn-save-jewel').innerText=document.getElementById('adm-j-type').value==='charms'?'Adicionar Amuleto':'Adicionar Adorno';
}

// FIX: deleteItem avisa se o item está equipado na build ativa
async function deleteItem(cat, id){
    // Checa se está na build
    const inBuild = ALL_SLOTS.some(slot=>build[slot].data.id===id);
    const msg = inBuild
        ? 'Este item está equipado na Build atual! Ao remover, o slot ficará vazio. Continuar?'
        : 'Remover item do baú? Isso não pode ser desfeito!';
    const ok = await confirmDialog(msg);
    if(!ok) return;
    if(cat==='decorations') DB.decorations=DB.decorations.filter(d=>d.id!==id);
    else if(cat==='charms') DB.charms=DB.charms.filter(d=>d.id!==id);
    else if(cat==='weapon') DB.weapons=DB.weapons.filter(i=>i.id!==id);
    else DB.armors[cat]=DB.armors[cat].filter(i=>i.id!==id);
    // FIX: Limpa a build se o item excluído estava equipado
    ALL_SLOTS.forEach(slot=>{
        if(build[slot].data.id===id){ build[slot].data=getList(slot)[0]; build[slot].joias=[]; }
    });
    save(); renderAdminList(); renderJewelStock(); renderArmorList(); updateAllStats();
    if(currentActiveSlot) openEditor(currentActiveSlot);
    toast('Item removido.');
}

function toggleAccType(){
    const type=document.getElementById('adm-j-type').value;
    const aFields=document.getElementById('form-adorno-fields');
    const cFields=document.getElementById('form-amuleto-fields');
    const iconEl=document.getElementById('icon-acc-form');
    const txtEl =document.getElementById('txt-acc-form');
    if(type==='decorations'){
        aFields.classList.remove('hidden'); cFields.classList.add('hidden');
        if(iconEl) iconEl.innerHTML=getIcon('decorations',26);
        if(txtEl)  txtEl.textContent='Cadastrar Adorno';
    } else {
        aFields.classList.add('hidden'); cFields.classList.remove('hidden');
        if(iconEl) iconEl.innerHTML=getIcon('charm',26);
        if(txtEl)  txtEl.textContent='Cadastrar Amuleto';
    }
    document.getElementById('btn-save-jewel').innerText=type==='charms'?'Adicionar Amuleto':'Adicionar Adorno';
}

function renderAdminList(){
    const listEquip=document.getElementById('admin-list-equip');
    const listDeco =document.getElementById('admin-list-decorations');
    // 4 baús separados: adornos | amuletos | armas | armaduras
    const decoOnlyData=[
        {id:'decorations',title:'Adornos',items:DB.decorations.filter(d=>d.s>0),type:'decorations'},
    ];
    const charmOnlyData=[
        {id:'charm',title:'Amuletos',items:DB.charms,type:'charms',iconSlot:'charm'},
    ];
    const weaponOnlyData=[
        {id:'weapon',title:'Armas',items:DB.weapons,type:'weapon'},
    ];
    const armorOnlyData=[
        {id:'head',  title:'Cabeça', items:DB.armors.head,  type:'armor'},
        {id:'chest', title:'Torso',  items:DB.armors.chest, type:'armor'},
        {id:'arms',  title:'Braços', items:DB.armors.arms,  type:'armor'},
        {id:'waist', title:'Cintura',items:DB.armors.waist, type:'armor'},
        {id:'legs',  title:'Pernas', items:DB.armors.legs,  type:'armor'},
    ];
    const equipData   = weaponOnlyData; // mantém compatibilidade
    const decoData    = [...decoOnlyData,...charmOnlyData]; // mantém compatibilidade
    const makeItemHtml=(col,it)=>{
        const rClass=col.type==='decorations'?'text-[#e8d5a3]':getRarityClass(it.rarity);
        const editFnBase = col.type==='weapon' ? `loadEditWeapon('${it.id}')` : (col.type==='decorations'||col.type==='charms') ? `loadEditJewel('${it.id}')` : `loadEditArmor('${col.id}','${it.id}')`;
        const editFn = `editFromBau(function(){${editFnBase}})`;
        const openModalFn = `showItemModal('${it.id}','${col.type}','${col.id||col.type}')`;
        const rarBadge = `<span class="${getRarityClass(it.rarity)} font-cinzel font-bold text-[13px]">R | ${it.rarity||1}</span>`;

        // Atributos completos
        let infoLines = '';
        const sharpColors={Vermelha:'#e84040',Laranja:'#e89040',Amarela:'#e8e040',Verde:'#60d060',Azul:'#4090f0',Branca:'#f0f8ff',Roxa:'#c090e0'};
        const resIcons=['🔥','💧','⚡','❄️','🐉'];
        const resNames=['Fogo','Água','Raio','Gelo','Dragão'];
        if(col.type==='weapon'){
            if(it.atk)  infoLines += `<span class="bau-info-line">⚔ Ataque: <b>${it.atk}</b></span>`;
            if(it.aff)  infoLines += `<span class="bau-info-line">Afinidade: <b>${it.aff>0?'+':''}${it.aff}%</b></span>`;
            if(it.sharpness&&it.sharpness!=='Nenhuma')
                infoLines += `<span class="bau-info-line" style="color:${sharpColors[it.sharpness]||'#c9b07a'}">● Afiação: ${it.sharpness}</span>`;
            if(it.element&&it.element!=='Nenhum')
                infoLines += `<span class="bau-info-line">${elementIcons[it.element]||''} ${it.element}: <b>${it.elementVal||0}</b></span>`;
            if(it.elderseal&&it.elderseal!=='Nenhum')
                infoLines += `<span class="bau-info-line">🐉 Selo Ancião: <b>${it.elderseal}</b></span>`;
            if(it.def)  infoLines += `<span class="bau-info-line">🛡 Bônus Def: <b>+${it.def}</b></span>`;
            if(it.slots&&it.slots.length)
                infoLines += `<span class="bau-info-line">Slots: <b>${it.slots.join(' · ')||'—'}</b></span>`;
            if(it.specialSkill&&it.specialSkill!=='')
                infoLines += `<span class="bau-info-line">✦ ${it.specialSkill}</span>`;
        } else if(col.type==='armor'){
            if(it.def)  infoLines += `<span class="bau-info-line">🛡 Defesa: <b>${it.def}</b></span>`;
            if(it.res)  it.res.forEach((v,i)=>{ if(v!==0) infoLines+=`<span class="bau-info-line">${resIcons[i]} ${resNames[i]}: <b>${v>0?'+'+v:v}</b></span>`; });
            if(it.slots&&it.slots.length)
                infoLines += `<span class="bau-info-line">Slots: <b>${it.slots.join(' · ')||'—'}</b></span>`;
            Object.keys(it.skills||{}).forEach(sk=>infoLines+=`<span class="bau-info-line">✦ ${sk}: <b>Nv ${it.skills[sk]}</b></span>`);
            if(it.set&&it.set!=='Nenhum')
                infoLines += `<span class="bau-info-line">Set: <b>${it.set}</b></span>`;
        } else if(col.type==='charms'){
            Object.keys(it.skills||{}).forEach(sk=>infoLines+=`<span class="bau-info-line">✦ ${sk}: <b>Nv ${it.skills[sk]}</b></span>`);
        }

        // Card idêntico ao adorno: ícone+info, btns no rodapé alinhados à direita
        return `<div class="jewel-stock-card flex gap-3 p-3.5 bg-[#252016] border border-[#4a412f] rounded-lg shadow-md hover:border-[#e8d5a3]/40 transition group cursor-pointer" onclick="${openModalFn}">
            <div class="flex-shrink-0 flex flex-col items-center justify-start gap-1 pt-0.5">
                ${getIcon(col.iconSlot||col.id||col.type,36,it.rarity)}
            </div>
            <div class="flex flex-col flex-1 min-w-0 overflow-hidden gap-0.5">
                <span class="text-[15px] font-bold ${rClass} line-clamp-2 leading-tight font-crimson">${it.name||it.n}</span>
                <div class="mt-0.5">${rarBadge}</div>
                <div class="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-0">${infoLines}</div>
                <div class="mt-auto pt-2 border-t border-[#3a3020] flex items-center justify-between gap-2" onclick="event.stopPropagation()">
                    <span></span>
                    <div class="flex gap-1.5">
                        <button onclick="${editFn}" class="nav-btn h-[28px] !text-[11px] !px-2 !text-[#c9a84c] !border-[#c9a84c]/50 hover:bg-[#c9a84c] hover:!text-[#1a160f]">✎ Editar</button>
                        <button onclick="deleteItem('${col.type}','${it.id}')" class="nav-btn h-[28px] !text-[11px] !px-2 !text-[#e84040] !border-[#e84040]/40 hover:bg-[#e84040] hover:!text-white">✖</button>
                    </div>
                </div>
            </div>
        </div>`;
    };
    // withHeader=true mostra sub-header de categoria (usado quando há múltiplas: armaduras)
    // withHeader=false suprime o sub-header (armas e amuletos já têm título no painel do Baú)
    const generateHtml=(cols,withHeader=true)=>cols.map(col=>{
        const filtered=col.items.filter(it=>it.id&&!it.id.toString().includes('_0'));
        if(!filtered.length) return '';
        const itemsHtml=filtered.map(it=>makeItemHtml(col,it)).join('');
        if(!withHeader) return `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">${itemsHtml}</div>`;
        return `<div class="w-full bg-[#2a251b]/40 p-5 border border-[#4a412f] flex flex-col rounded-lg">
            <p class="panel-title mb-4 !text-[13px]">${getIcon(col.iconSlot||col.id||col.type,30)}<span>${col.title}</span></p>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">${itemsHtml}</div>
        </div>`;
    }).join('');
    const empty = '<p class="text-[#4a412f] italic text-[14px] text-center py-6 font-cinzel">Nenhum item cadastrado. Vá ao Ferreiro para forjar.</p>';
    const charmHtml  = generateHtml(charmOnlyData, false)  || empty;
    const weaponHtml = generateHtml(weaponOnlyData, false) || empty;
    const armorHtml  = generateHtml(armorOnlyData, true)  || empty;
    // Ferreiro (IDs ocultos — compatibilidade)
    if(listEquip) listEquip.innerHTML = weaponHtml + armorHtml;
    if(listDeco)  listDeco.innerHTML  = charmHtml;
    // Baú: adornos via renderJewelStock(), demais 3 seções aqui
    const bauCharm =document.getElementById('bau-list-charm');
    const bauWeapon=document.getElementById('bau-list-weapon');
    const bauArmor =document.getElementById('bau-list-armor');
    if(bauCharm)  bauCharm.innerHTML  = charmHtml;
    if(bauWeapon) bauWeapon.innerHTML = weaponHtml;
    if(bauArmor)  bauArmor.innerHTML  = armorHtml;
}

// FIX: exportar imagem com detecção de protocolo file://
function exportJSON(){
    const data = JSON.stringify(DB, null, 2);
    const blob = new Blob([data], {type:'application/json'});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'HunterLab_Backup_' + new Date().toISOString().slice(0,10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
    toast('Backup exportado com sucesso!');
}

function importJSON(){
    const input = document.createElement('input');
    input.type  = 'file';
    input.accept= '.json';
    input.onchange = e => {
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            try {
                const data = JSON.parse(ev.target.result);
                // Validar estrutura básica
                if(!data.weapons && !data.armors && !data.decorations && !data.presets){
                    toast('Arquivo inválido — não é um backup do Hunter Lab.', 'err'); return;
                }
                // Mesclar — preservar dados existentes, adicionar novos
                if(data.weapons)     DB.weapons     = data.weapons;
                if(data.armors)      DB.armors      = data.armors;
                if(data.decorations) DB.decorations = data.decorations;
                if(data.charms)      DB.charms      = data.charms;
                if(data.presets)     DB.presets      = data.presets;
                save();
                populateDropdowns();
                renderArmorList();
                renderJewelStock();
                renderAdminList();
                renderPresets();
                updateAllStats();
                toast('Backup importado com sucesso! ' +
                    (data.weapons?.length||0) + ' armas, ' +
                    (Object.keys(data.armors||{}).reduce((a,k)=>a+(data.armors[k]?.length||0),0)) + ' armaduras, ' +
                    (data.decorations?.length||0) + ' adornos.');
            } catch(err) {
                toast('Erro ao ler o arquivo: ' + err.message, 'err');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function exportBuildImage(){
    if(window.location.protocol==='file:'){
        toast('Para exportar imagem, abra o app num servidor HTTP (ex: VS Code Live Server).','err'); return;
    }
    const buildView   =document.getElementById('view-build');
    const skillDisplay=document.getElementById('skill-display');
    const armorList   =document.getElementById('armor-list');
    const mainGrid    =buildView&&buildView.querySelector('.grid');
    if(!buildView) return;
    // Remover clipping temporariamente para captura completa
    const oldMaxH    =skillDisplay.style.maxHeight;
    const oldOverflow=skillDisplay.style.overflowY;
    const oldGridH   =mainGrid?mainGrid.style.minHeight:'';
    skillDisplay.style.maxHeight ='none';
    skillDisplay.style.overflowY ='visible';
    if(mainGrid) mainGrid.style.minHeight='auto';
    if(armorList){ armorList.style.overflow='visible'; }
    html2canvas(buildView,{backgroundColor:'#1a160f',scale:2,useCORS:true,allowTaint:true,
        windowWidth:1400,windowHeight:buildView.scrollHeight+100})
    .then(canvas=>{
        const link=document.createElement('a');
        link.download='Minha_Build_MHW.png';
        link.href=canvas.toDataURL('image/png');
        link.click();
        toast('Imagem exportada!');
    }).catch(err=>{
        console.error(err);
        toast('Erro ao gerar imagem. Tente via servidor HTTP.','err');
    }).finally(()=>{
        skillDisplay.style.maxHeight =oldMaxH;
        skillDisplay.style.overflowY=oldOverflow;
        if(mainGrid) mainGrid.style.minHeight=oldGridH;
        if(armorList) armorList.style.overflow='';
    });
}

// Scroll suave até o formulário no admin (mobile-friendly)
function scrollToAdmin(id){
    const el=document.getElementById(id);
    if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
}

// ── Mobile: drawer do editor ──────────────────────────────
function openMobileEditor(slot){
    openEditor(slot);
    const drawer=document.getElementById('mobile-editor-drawer');
    if(drawer) drawer.classList.remove('translate-y-full');
}
function closeMobileEditor(){
    const drawer=document.getElementById('mobile-editor-drawer');
    if(drawer) drawer.classList.add('translate-y-full');
    const overlay=document.getElementById('mobile-drawer-overlay');
    if(overlay) overlay.classList.add('hidden');
    // Limpar body do drawer para evitar estados stale
    const body=document.getElementById('mobile-editor-body');
    if(body) body.innerHTML='';
}

// ── Init ──────────────────────────────────────────────────
injectSlotOptions();
setSharp('Vermelha');
load();
populateDropdowns();
renderArmorList();
updateAllStats();
renderJewelStock();
renderPresets();
// Ícones nos títulos do Ferreiro
(function(){
    var wi=document.getElementById('icon-weapon-form');
    var ai=document.getElementById('icon-armor-form');
    var ji=document.getElementById('icon-acc-form');
    if(wi) wi.innerHTML=getIcon('weapon',26);
    if(ai) ai.innerHTML=getIcon('head',26);
    if(ji) ji.innerHTML=getIcon('decorations',26);
    // Garante ícone e texto corretos no carregamento
    if(document.getElementById('title-acc')) toggleAccType();
    // Forçar dark em selects + aplicar cor de raridade nos selects de raridade
    document.querySelectorAll('select').forEach(s=>{
        s.style.setProperty('background','#252016','important');
        if(!s.classList.toString().includes('rarity-')) s.style.setProperty('color','#d9b85c','important');
    });
    // Aplicar cor de raridade nos selects que já têm classe rarity-N
    toggleSharpnessField();
    ['adm-w-rar','adm-a-rar','adm-j-rar'].forEach(id=>{
        const el=document.getElementById(id); if(el) updateRarityColor(el);
    });
})();