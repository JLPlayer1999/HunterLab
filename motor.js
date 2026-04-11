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
    1:'#9ca3af',  // cinza — R1
    2:'#e2e8f0',  // branco acinzentado — R2
    3:'#86efac',  // verde claro — R3
    4:'#4ade80',  // verde — R4
    5:'#fbbf24',  // âmbar/dourado — R5 (Iceborne base)
    6:'#f97316',  // laranja — R6
    7:'#ef4444',  // vermelho — R7
    8:'#c084fc',  // roxo claro — R8
    9:'#60a5fa',  // azul — R9
    10:'#34d399', // esmeralda — R10
    11:'#e8d5a3', // ouro/dourado claro — R11
    12:'#cffafe'  // ciano gelo — R12 (Iceborne master)
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
        levelsHtml = data.levels.map((desc, i) => {
            const lv = i + 1;
            const isActive = lv <= curLevel;
            return `<div class="flex gap-4 py-3 border-b border-[#3a3020] last:border-0">
                <div class="flex-shrink-0 flex flex-col items-center gap-1 pt-0.5" style="min-width:42px">
                    <span class="font-cinzel font-bold text-[14px] leading-none ${isActive ? 'modal-lv-active-num' : 'text-[#5a4e38]'}">Nv ${lv}</span>
                    <span class="text-[11px] leading-none ${isActive ? 'modal-lv-active-dot' : 'text-[#3a3020]'}">${isActive ? '▪' : '▫'}</span>
                </div>
                <span class="text-[18px] font-crimson leading-snug ${isActive ? 'modal-lv-active-text' : 'text-[#7a6e52]'}">${desc}</span>
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
        if(it.specialSkill&&it.specialSkill!=='') rows += gearRow('Hab. Especial', it.specialSkill);
        if(it.slots&&it.slots.length) rows += gearRow('Slots', it.slots.join(' · ')||'—');
    } else if(type==='charms'){
        Object.keys(it.skills||{}).forEach(sk=>rows+=gearRow(sk,'Nv '+it.skills[sk]));
    } else if(type==='decorations'){
        rows += gearRow('Slot', it.s);
        rows += gearRow('Quantidade', it.qtd!==undefined?it.qtd:1);
        Object.keys(it.skills||{}).forEach(sk=>rows+=gearRow(sk,'+'+it.skills[sk]));
    } else {
        if(it.def) rows += gearRow('Defesa', it.def);
        const rIcons=['🔥','💧','⚡','❄️','🐉'], rNames=['Fogo','Água','Raio','Gelo','Dragão'];
        (it.res||[]).forEach((v,i)=>{ if(v!==0) rows+=gearRow(rIcons[i]+' '+rNames[i],(v>0?'+':'')+v); });
        Object.keys(it.skills||{}).forEach(sk=>rows+=gearRow(sk,'Nv '+it.skills[sk]));
        if(it.set&&it.set!=='Nenhum') rows+=gearRow('Set',it.set);
        if(it.slots&&it.slots.length) rows+=gearRow('Slots',it.slots.join(' · ')||'—');
    }

    const iconSlot = type==='weapon'?'weapon':type==='charms'?'charm':type==='decorations'?'decorations':catId;
    document.getElementById('gear-modal-icon').innerHTML   = getIcon(iconSlot,40,rar);
    document.getElementById('gear-modal-title').textContent = nm;
    document.getElementById('gear-modal-sub').textContent   = (locs[iconSlot]||type)+' · ♦ R'+rar;
    document.getElementById('gear-modal-sub').style.color   = getRarityColor(rar);
    document.getElementById('gear-modal-rows').innerHTML    = rows||'<p class="text-[#6b5e43] italic text-[14px]">Sem informações.</p>';
    document.getElementById('gear-modal').classList.remove('hidden');
}

function gearRow(label, value){
    return `<div class="flex justify-between items-baseline py-2 border-b border-[#3a3020] last:border-0 gap-4">
        <span class="font-cinzel text-[13px] text-[#8a7a5a] uppercase tracking-wide flex-shrink-0">${label}</span>
        <span class="font-crimson text-[16px] text-[#e8d5a3] text-right">${value}</span>
    </div>`;
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
    const opts=`<option value="0">-</option><option value="4">♦ 4</option><option value="3">♦ 3</option><option value="2">♦ 2</option><option value="1">♦ 1</option>`;
    ['adm-w-slot-1','adm-w-slot-2','adm-w-slot-3','adm-a-slot-1','adm-a-slot-2','adm-a-slot-3'].forEach(id=>{
        const el=document.getElementById(id); if(el) el.innerHTML=opts;
    });
    const jSlot = document.getElementById('adm-j-s');
    if(jSlot) jSlot.innerHTML=`<option value="" disabled selected>-</option><option value="4">♦ 4</option><option value="3">♦ 3</option><option value="2">♦ 2</option><option value="1">♦ 1</option>`;
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
    const max = (sk && maxSkills[sk]) ? maxSkills[sk] : 5;
    const cur = parseInt(lvlEl.value) || 1;
    let html='';
    for(let i=1;i<=max;i++) html+=`<option value="${i}" ${i===Math.min(cur,max)?'selected':''}>${i}</option>`;
    lvlEl.innerHTML=html;
}

function updateArmorIconTitle(){
    const cat=document.getElementById('adm-a-cat');
    const titleEl=document.getElementById('title-armor');
    if(cat && titleEl) titleEl.innerHTML=`${getIcon(cat.value,32)}<span>Forjar Armadura</span>`;
}

function updateRarityColor(sel){
    sel.className=sel.className.replace(/rarity-\d+/g,'');
    sel.classList.add(`rarity-${sel.value}`);
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

window.toggleBreakdown = function(id){
    const el=document.getElementById(id); if(el) el.classList.toggle('hidden');
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
            ? `<span class="${rClass} font-bold text-[13px] ml-2 font-cinzel">♦ R${item.rarity}</span>` : '';

        let decosHtml='';
        if(!isEmpty && item.slots && item.slots.length>0){
            decosHtml=`<div class="flex flex-wrap gap-1.5 mt-2.5">`+item.slots.map((s,idx)=>{
                const filled = build[slot].joias && build[slot].joias[idx];
                return filled
                    ? `<div class="deco-badge deco-filled" title="${filled.n}" onclick="event.stopPropagation();showJewelModal('${filled.id}')">
                           ${s===filled.s
                             ? `<span class="deco-joia-num">${s}</span>`
                             : `<span class="deco-slot-num">${s}</span><span class="deco-sep">|</span><span class="deco-joia-num">${filled.s}</span>`
                           }
                       </div>`
                    : `<div class="deco-badge deco-empty">
                           <span class="deco-slot-num deco-slot-empty">${s}</span>
                       </div>`;
            }).join('')+`</div>`;
        }

        return `<div onclick="openEditor('${slot}')" class="slot-card flex items-center gap-3 p-4 bg-[#252016] border border-[#4a412f] cursor-pointer hover:border-[#e8d5a3] transition-all rounded shadow-md group ${isEmpty?'':'border-l-4 !border-l-[#c9a84c]'}">
            ${getIcon(slot,40,item.rarity)}
            <div class="flex-1 overflow-hidden min-w-0">
                <div class="text-[12px] uppercase tracking-[2px] text-[#c9b07a] font-cinzel font-bold flex items-center flex-wrap leading-none">
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
        ${!isEmpty&&item.rarity?`<span class="inline-block mt-2 text-[13px] font-bold font-cinzel ${getRarityClass(item.rarity)}">♦ Raridade ${item.rarity}</span>`:''}
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
            ${getIcon('decorations',32)} Adornos
        </h3>
        ${isEmpty?'<p class="text-[#4a412f] italic text-sm">Selecione um equipamento primeiro.</p>':
        item.slots.map((s,idx)=>`
            <div class="mb-4">
                <label class="text-[14px] text-[#70b0e0] font-cinzel flex items-center gap-1.5 tracking-widest leading-none mb-2">Slot ${s} <span style="color:#00bfff;text-shadow:0 0 4px rgba(0,191,255,.7);font-size:17px;line-height:1">♦</span></label>
                <select onchange="equipJewel('${slot}',${idx},this.value)" class="w-full bg-[#252016] text-[15px] p-2.5 border border-[#4a412f] text-[#d9b85c] hover:border-[#e8d5a3] focus:border-[#e8d5a3] rounded shadow-inner">
                    <option value="">— Vazio —</option>
                    ${DB.decorations.filter(d=>d.s<=s).map(d=>{
                        const isSelected = joias[idx]&&joias[idx].id===d.id;
                        const avail = getAvailableStock(d.id);
                        if(!isSelected&&avail<=0) return '';
                        return `<option value="${d.id}" ${isSelected?'selected':''}>${d.n} (♦${d.s}) — ${avail} disp.</option>`;
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
            if(item.specialSkill&&item.specialSkill!=='')
                info+=`<p class="font-cinzel font-bold text-[#e8d5a3] text-[14px] mt-4 border-t border-[#4a412f] pt-3 uppercase tracking-[1px]">✦ ${item.specialSkill}</p>`;
        } else if(slot!=='charm'){
            info+=`<p class="text-[#d9b85c] mb-3 text-[15px]">Defesa: <span class="text-[#70b0e0] font-cinzel font-bold">${item.def}</span></p>`;
            const rI=['🔥','💧','⚡','❄️','🐉'];
            const rC=['text-[#e06030]','text-[#70b0e0]','text-[#facc15]','text-[#e0f2fe]','text-[#9060c0]'];
            info+=`<div class="flex flex-wrap gap-2 text-[14px] mb-4 font-cinzel font-bold">${item.res.map((r,i)=>`<span class="bg-[#1a160f] px-2 py-1 border border-[#4a412f] rounded ${rC[i]}">${rI[i]} ${r}</span>`).join('')}</div>`;
        }
        if(slot!=='weapon'&&!isEmpty){
            const sks=Object.keys(item.skills||{});
            if(sks.length) info+=`<div class="mt-5 pt-4 border-t border-[#3a3020] space-y-3">${sks.map(sk=>`<div class="flex justify-between items-baseline gap-2"><span class="text-[#a89060] text-[15px] font-crimson leading-none">${sk}</span><span class="text-[#6a5e40] font-cinzel text-[12px] flex-shrink-0">Nv ${item.skills[sk]}</span></div>`).join('')}</div>`;
        }
        if(item.set&&item.set!=='Nenhum')
            info+=`<div class="mt-4"><button onclick="document.getElementById('sb-detail').classList.toggle('hidden')" class="font-cinzel font-bold text-[#e8d5a3] text-[14px] uppercase border-b border-[#e8d5a3] pb-0.5 hover:text-white transition">Set: ${item.set}</button><div id="sb-detail" class="hidden mt-2 p-3 bg-[#1a160f] border border-[#d9b85c]/40 rounded text-[14px] text-[#e8d5a3] italic leading-snug">${typeof setBonuses!=='undefined'&&setBonuses[item.set]?setBonuses[item.set]:item.set}</div></div>`;
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

function renderJewelStock(){
    const container=document.getElementById('jewel-stock-list');
    if(!container) return;
    let html=DB.decorations.map(j=>{
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
                        <span class="font-cinzel text-[12px] text-[#6b5e43] uppercase tracking-widest">Disp. </span>
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
    const container=document.getElementById('load-preset-container');
    const divider  =document.getElementById('preset-divider');
    const sel      =document.getElementById('preset-selector');
    if(!sel||!container) return;
    const hasPresets = DB.presets&&Object.keys(DB.presets).length>0;
    container.classList.toggle('hidden', !hasPresets);
    container.classList.toggle('flex', hasPresets);
    if(divider){ divider.classList.toggle('hidden',!hasPresets); divider.classList.toggle('xl:block',hasPresets); }
    sel.innerHTML='<option value="" disabled selected>— Selecione —</option>'+
        (hasPresets?Object.keys(DB.presets).map(p=>`<option value="${p}">${p}</option>`).join(''):'');
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
        // Separador apenas entre grupos, e NUNCA se este pip for o último
        const isLastPip = (i === max - 1);
        if(i > 0 && i % 4 === 0 && !isLastPip) html += '<div class="skill-bar-sep"></div>';
        const active = i < currentLevel;
        html += `<div class="skill-pip ${active ? (isMaxed ? 'pip-maxed' : 'pip-active') : 'pip-empty'}"></div>`;
    }
    return html + '</div>';
}

function updateAllStats(){
    let atkBase=0, affBase=0, defBaseArmor=0, defWeapon=0;
    let resTotal=[0,0,0,0,0], skills={}, sets={}, defTotal=0;
    let weaponElementHtml='', weaponSharpnessHtml='';

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
                const icon=elementIcons[it.element]||'';
                const eColor=elementColors[it.element]||'text-[#e06030]';
                weaponElementHtml=`
                <div class="stat-card cursor-pointer hover:border-[#e8d5a3] transition rounded shadow-md" onclick="toggleBreakdown('breakdown-ele')">
                    <div class="flex justify-between items-center">
                        <span class="stat-label">Elemento</span>
                        <span class="${eColor} font-cinzel font-bold text-lg leading-none">${icon} ${it.element} ${it.elementVal||''}</span>
                    </div>
                    <div class="stat-breakdown hidden" id="breakdown-ele">
                        <div class="flex justify-between"><span class="text-[#c9b07a]">Arma:</span><span class="text-white">${it.elementVal||0}</span></div>
                        ${it.elderseal&&it.elderseal!=='Nenhum'?`<div class="flex justify-between"><span>Selo Ancião:</span><span class="${elementColors['Dragão']}">${it.elderseal}</span></div>`:''}
                    </div>
                </div>`;
            }
            if(it.sharpness&&it.sharpness!=='Nenhuma'){
                weaponSharpnessHtml=`
                <div class="stat-card cursor-pointer hover:border-[#e8d5a3] transition rounded shadow-md" onclick="toggleBreakdown('breakdown-shp')">
                    <div class="flex justify-between items-center">
                        <span class="stat-label">Afiação</span>
                        <div class="w-14 h-3 ${sharpColors[it.sharpness]} border border-[#3d3423] rounded-sm shadow-inner"></div>
                    </div>
                    <div class="stat-breakdown hidden" id="breakdown-shp">
                        <div class="flex justify-between"><span class="text-[#c9b07a]">Arma:</span><span class="text-white capitalize">${it.sharpness}</span></div>
                    </div>
                </div>`;
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

    // Bônus de habilidades nos stats
    const bonusAtk = (skills['Reforço de Ataque']||0)*15;
    const finalAtk = atkBase + bonusAtk;
    const bonusAff = (skills['Olho Crítico']||0)*5;
    const finalAff = affBase + bonusAff;
    const affColor = finalAff>0?'text-[#4090f0]':(finalAff<0?'text-[#e84040]':'text-[#e8d5a3]');
    // Defesa e resistências também somam habilidades
    const bonusDef = (skills['Reforço de Defesa']||0)*10;
    const finalDef = defTotal + bonusDef;

    document.getElementById('offense-display').innerHTML=`
        <div class="stat-card cursor-pointer hover:border-[#e8d5a3] transition rounded shadow-md" onclick="toggleBreakdown('breakdown-atk')">
            <div class="flex justify-between items-center">
                <span class="stat-label">Ataque</span>
                <span class="text-[#e8d5a3] font-cinzel font-bold text-[20px] leading-none">${finalAtk}</span>
            </div>
            <div class="stat-breakdown hidden" id="breakdown-atk">
                <div class="flex justify-between"><span class="text-[#c9b07a]">Arma:</span><span class="text-[#e8d5a3]">${atkBase}</span></div>
                ${bonusAtk!==0?`<div class="flex justify-between"><span class="text-[#c9b07a]">Reforço de Ataque:</span><span class="${bonusAtk>0?'text-[#60d060]':'text-[#e84040]'}">${bonusAtk>0?'+'+bonusAtk:bonusAtk}</span></div>`:''}
            </div>
        </div>
        ${weaponSharpnessHtml}
        <div class="stat-card cursor-pointer hover:border-[#e8d5a3] transition rounded shadow-md" onclick="toggleBreakdown('breakdown-aff')">
            <div class="flex justify-between items-center">
                <span class="stat-label">Afinidade</span>
                <span class="${affColor} font-cinzel font-bold text-[20px] leading-none">${finalAff}%</span>
            </div>
            <div class="stat-breakdown hidden" id="breakdown-aff">
                <div class="flex justify-between"><span class="text-[#c9b07a]">Arma:</span><span class="text-[#e8d5a3]">${affBase}%</span></div>
                ${bonusAff!==0?`<div class="flex justify-between"><span class="text-[#c9b07a]">Olho Crítico:</span><span class="${bonusAff>0?'text-[#60d060]':'text-[#e84040]'}">${bonusAff>0?'+'+bonusAff:bonusAff}%</span></div>`:''}
            </div>
        </div>
        ${weaponElementHtml}`;

    document.getElementById('defense-display').innerHTML=`
        <div class="stat-card cursor-pointer hover:border-[#e8d5a3] transition rounded shadow-md" onclick="toggleBreakdown('breakdown-def')">
            <div class="flex justify-between items-center">
                <span class="stat-label">Defesa</span>
                <span class="text-[#e8d5a3] font-cinzel font-bold text-[20px] leading-none">${finalDef}</span>
            </div>
            <div class="stat-breakdown hidden" id="breakdown-def">
                ${defBreakdown.map(d=>`<div class="flex justify-between"><span class="text-[#c9b07a]">${d.label}:</span><span class="text-[#e8d5a3]">${d.val}</span></div>`).join('')}
                ${bonusDef!==0?`<div class="flex justify-between"><span class="text-[#c9b07a]">Reforço de Defesa:</span><span class="text-[#60d060]">+${bonusDef}</span></div>`:''}
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

    // Skills
    let skillsHtml=Object.keys(skills).sort().map(s=>{
        let lvl=skills[s];
        const max=maxSkills[s]||7;
        const isMaxed=lvl>=max;
        return `
        <div class="p-3 bg-[#252016] border ${isMaxed?'border-[#e8d5a3]/50':'border-[#6b5e43]'} flex items-center justify-between rounded shadow-sm group hover:border-[#e8d5a3] transition cursor-pointer" onclick="openSkillInfo(event, this)" data-skill="${encodeURIComponent(s)}">
            <div class="flex flex-col">
                <span class="text-[15px] font-bold font-crimson ${isMaxed?'text-[#e8d5a3]':'text-[#c9b07a]'} group-hover:text-white">${s}</span>
                ${renderSkillPips(s,lvl)}
            </div>
            <span class="font-cinzel text-[14px] font-bold ${isMaxed?'text-[#e8d5a3]':'text-[#8a6e3a]'}">${lvl}/${max}</span>
        </div>`;
    }).join('');

    // Sets ativos
    let activeSetsHeader='';
    let setsDisplayHtml='';
    Object.keys(sets).sort().forEach(setName=>{
        if(setName==='Nenhum'||!setName) return;
        const count=sets[setName];
        const desc=typeof setBonuses!=='undefined'&&setBonuses[setName]?setBonuses[setName]:`Bônus de ${setName}`;
        // FIX: regex mais flexível, fallback padrão = 2
        const match=desc.match(/(\d+)\s*(pe[çc]|pea)/i);
        const req=match?parseInt(match[1]):2;
        const isActive=count>=req;
        const skillName=desc.includes(':')?desc.split(':')[1].trim():setName;
        if(isActive) activeSetsHeader+=`<span class="bg-[#383124] border border-[#c9a84c] text-[#c9a84c] px-3 py-1 font-cinzel text-[11px] tracking-[1px] uppercase rounded shadow-md">${skillName}</span>`;
        setsDisplayHtml+=`
        <div class="p-3 bg-[#252016] border border-[#d9b85c]/40 mt-2 rounded shadow-sm group hover:border-[#d9b85c] transition">
            <div class="flex justify-between items-center">
                <span class="text-[12px] font-cinzel font-bold tracking-[1px] ${isActive?'text-[#e8d5a3]':'text-[#8a6e3a]'} group-hover:text-white uppercase">✦ ${skillName}</span>
                <span class="font-cinzel text-[12px] font-bold ${isActive?'text-[#e8d5a3]':'text-[#8a6e3a]'}">${count}/${req}</span>
            </div>
            <div class="text-[11px] ${isActive?'text-[#c9b07a]':'text-[#8a6e3a]'} mt-1.5 italic leading-tight group-hover:text-[#c9b07a]">${desc}</div>
        </div>`;
    });

    document.getElementById('active-set-bonuses').innerHTML=activeSetsHeader;
    document.getElementById('skill-display').innerHTML=skillsHtml+setsDisplayHtml;
}

// ── Admin — CRUD ──────────────────────────────────────────
function adminSaveWeapon(){
    const name=document.getElementById('adm-w-name').value.trim();
    if(!name){ toast('Dê um nome à arma!','err'); return; }
    const slots=[]; [1,2,3].forEach(i=>{ const v=parseInt(document.getElementById(`adm-w-slot-${i}`).value); if(v>0) slots.push(v); });
    const weapon={
        id: editingWeaponId||'w_'+Date.now(), name,
        rarity: parseInt(document.getElementById('adm-w-rar').value),
        atk: parseInt(document.getElementById('adm-w-atk').value)||0,
        aff: parseInt(document.getElementById('adm-w-aff').value)||0,
        element: document.getElementById('adm-w-el-type').value,
        elementVal: parseInt(document.getElementById('adm-w-el-val').value)||0,
        elderseal: document.getElementById('adm-w-elder').value,
        sharpness: document.getElementById('adm-w-sharp').value,
        def: parseInt(document.getElementById('adm-w-def').value)||0,
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
    const rarSel=document.getElementById('adm-w-rar'); rarSel.value=it.rarity||1; updateRarityColor(rarSel);
    document.getElementById('adm-w-atk').value=it.atk||'';
    document.getElementById('adm-w-aff').value=it.aff||'';
    document.getElementById('adm-w-el-type').value=it.element||'Nenhum';
    document.getElementById('adm-w-el-val').value=it.elementVal||'';
    document.getElementById('adm-w-elder').value=it.elderseal||'Nenhum';
    document.getElementById('adm-w-def').value=it.def||'';
    setSharp(it.sharpness||'Nenhuma');
    [1,2,3].forEach(i=>document.getElementById(`adm-w-slot-${i}`).value=it.slots[i-1]||0);
    document.getElementById('adm-w-special-sk').value=it.specialSkill||'';
    document.getElementById('btn-save-weapon').innerText='Atualizar Arma';
    document.getElementById('btn-cancel-weapon').classList.remove('hidden');
    scrollToAdmin('form-weapon');
}

function cancelEditWeapon(){
    editingWeaponId=null;
    ['adm-w-name','adm-w-atk','adm-w-aff','adm-w-el-val','adm-w-def'].forEach(id=>document.getElementById(id).value='');
    const r=document.getElementById('adm-w-rar'); r.value=1; updateRarityColor(r);
    document.getElementById('adm-w-el-type').value='Nenhum';
    document.getElementById('adm-w-elder').value='Nenhum';
    setSharp('Nenhuma');
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
        def: parseInt(document.getElementById('adm-a-def').value)||0,
        res: [0,1,2,3,4].map(i=>parseInt(document.getElementById('adm-a-res-'+i).value)||0),
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
    [1,2].forEach(i=>{ document.getElementById(`adm-j-sk${i}`).value=''; document.getElementById(`adm-j-v${i}`).value='1'; });
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
    if(type==='decorations'){
        aFields.classList.remove('hidden'); cFields.classList.add('hidden');
        document.getElementById('title-acc').innerHTML=`${getIcon('decorations',32)}<span>Cadastrar Adorno</span>`;
    } else {
        aFields.classList.add('hidden'); cFields.classList.remove('hidden');
        document.getElementById('title-acc').innerHTML=`${getIcon('charm',32)}<span>Cadastrar Amuleto</span>`;
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
        const extra =col.type==='decorations'||col.type==='charms'
            ?Object.keys(it.skills||{}).map(k=>`${k} +${it.skills[k]}`).join(', '):'';
        const editFnBase = col.type==='weapon' ? `loadEditWeapon('${it.id}')` : (col.type==='decorations'||col.type==='charms') ? `loadEditJewel('${it.id}')` : `loadEditArmor('${col.id}','${it.id}')`;
        const editFn = `editFromBau(function(){${editFnBase}})`;
        const isDeco = col.type==='decorations';
        const rarBadge = `<span class="${getRarityClass(it.rarity)} font-cinzel font-bold text-[11px]">♦ R${it.rarity||1}</span>`;
        const skillLines = extra ? extra.split(', ').map(s=>`<span class="text-[#8a7a56] font-crimson text-[13px] truncate block">${s}</span>`).join('') : '';
        // slot para abrir modal de detalhes (não-deco usa slot do col)
        const modalSlot = col.type==='weapon'?'weapon':col.type==='charms'?'charm':col.id;
        // Simular um objeto temporário no modal via função inline
        const openModalFn = `showItemModal('${it.id}','${col.type}','${col.id||col.type}')`;
        return `<div class="flex gap-3 p-3.5 bg-[#252016] border border-[#4a412f] rounded-lg shadow-md hover:border-[#e8d5a3]/40 transition group cursor-pointer" onclick="${openModalFn}">
            <div class="flex-shrink-0 flex flex-col items-center justify-between gap-2">
                ${getIcon(col.iconSlot||col.id||col.type,36,it.rarity)}
                <div class="flex gap-1" onclick="event.stopPropagation()">
                    <button onclick="${editFn}" class="nav-btn h-[28px] !text-[11px] !px-2 !text-[#c9a84c] !border-[#c9a84c]/50 hover:bg-[#c9a84c] hover:!text-[#1a160f]">✎ Editar</button>
                    <button onclick="deleteItem('${col.type}','${it.id}')" class="nav-btn h-[28px] !text-[11px] !px-2 !text-[#e84040] !border-[#e84040]/40 hover:bg-[#e84040] hover:!text-white">✖</button>
                </div>
            </div>
            <div class="flex flex-col flex-1 min-w-0 overflow-hidden gap-0.5">
                <span class="${rClass} text-[15px] font-bold font-crimson leading-tight line-clamp-2">${it.name||it.n}</span>
                <div class="flex items-center gap-2 mt-0.5">${rarBadge}</div>
                <div class="mt-1">${skillLines}</div>
            </div>
        </div>`;
    };
    // withHeader=true mostra sub-header de categoria (usado quando há múltiplas: armaduras)
    // withHeader=false suprime o sub-header (armas e amuletos já têm título no painel do Baú)
    const generateHtml=(cols,withHeader=true)=>cols.map(col=>{
        const filtered=col.items.filter(it=>it.id&&!it.id.toString().includes('_0'));
        if(!filtered.length) return '';
        const itemsHtml=filtered.map(it=>makeItemHtml(col,it)).join('');
        if(!withHeader) return `<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">${itemsHtml}</div>`;
        return `<div class="w-full bg-[#2a251b]/40 p-5 border border-[#4a412f] flex flex-col rounded-lg">
            <p class="panel-title mb-4 !text-[13px]">${getIcon(col.iconSlot||col.id||col.type,30)}<span>${col.title}</span></p>
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">${itemsHtml}</div>
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
}

// ── Init ──────────────────────────────────────────────────
injectSlotOptions();
setSharp('Nenhuma');
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
    if(wi) wi.innerHTML=getIcon('weapon',26);
    if(ai) ai.innerHTML=getIcon('head',26);
})();
