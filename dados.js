// ============================================================
//  HUNTER LAB BRASIL — dados.js
//  Edite este arquivo para personalizar os dados do seu app.
// ============================================================

// --- Localização dos slots ---
const locs = {
    'weapon': 'Arma', 'charm': 'Amuleto',
    'head': 'Cabeça', 'chest': 'Torso',
    'arms': 'Braços', 'waist': 'Cintura', 'legs': 'Pernas'
};

// ============================================================
//  SETS DE ARMADURA
//  Adicione o nome do set e a descrição do bônus.
//  Formato: 'Nome do Set': 'X peças: Descrição do bônus'
// ============================================================
const masterSets = [
    'Nenhum',
    // Exemplos:
    // 'Rathalos', 'Nergigante', 'Teostra', 'Velkhana', ...
];

const setBonuses = {
    // 'Rathalos': '2 peças: Maestria de Elemento de Fogo',
    // 'Nergigante': '2 peças: Regeneração de Vitalidade',
};

// ============================================================
//  HABILIDADES ESPECIAIS DE ARMA
//  Lista de habilidades que podem ser atribuídas a armas.
// ============================================================
const specialSkills = [
    'Nenhuma',
    // Exemplos: 'Elem. Livre/Aumeto de Municão', 'Disparo Rápido', ...
];

// ============================================================
//  HABILIDADES E NÍVEIS MÁXIMOS
//  Adicione todas as habilidades com seu nível máximo.
//  IMPORTANTE: Preencha este objeto quando tiver a lista completa.
//
//  Formato:
//  'Nome da Habilidade': nivelMaximo,
//
//  Exemplos:
//  'Reforço de Ataque': 7,
//  'Olho Crítico': 7,
//  'Impulso Crítico': 3,
//  'Proteção de Elemental': 6,
//  'Proteção a Elementos': 3,
//  'Resistência ao Fogo': 3,
//  'Resistência à Água': 3,
//  'Resistência ao Raio': 3,
//  'Resistência ao Gelo': 3,
//  'Resistência ao Dragão': 3,
//  'Proteção de Saúde': 3,
//  'Regeneração': 3,
//  'Maestria de Armadura': 3,
//  'Defesa Aumentada': 3,
// ============================================================
const maxSkills = {
    // ── Lote 1 (imagens 1–10) ─────────────────────────────
    'Resistência a Veneno':       3,
    'Resistência a Paralisia':    3,
    'Resistência a Sono':         3,
    'Resistência Atordoamento':   3,
    'Resistência a Explosão':     3,
    'Resistência Sangramento':    3,
    'Pele de Ferro':              3,
    'Tampões':                    5,
    'Antivento':                  5,
    'Resistência a Tremor':       3,
};


// ============================================================
//  DESCRIÇÕES DE HABILIDADES (skillData)
//  Formato:
//  'Nome': { desc: 'Descrição geral', levels: ['Nv1...','Nv2...',...] }
//
//  Usado nos modais ao clicar em habilidades e jóias.
//  Vá adicionando conforme envia os lotes.
// ============================================================
const skillData = {
    // ── Lote 1 ────────────────────────────────────────────
    'Resistência a Veneno': {
        desc: 'Reduz dano de veneno.',
        levels: [
            'Reduz o número de vezes que você sofre dano de veneno.',
            'Reduz bastante o número de vezes que você sofre dano de veneno.',
            'Evita veneno.'
        ]
    },
    'Resistência a Paralisia': {
        desc: 'Reduz a duração da paralisia.',
        levels: [
            'Reduz a duração de paralisia em 30%.',
            'Reduz a duração de paralisia em 60%.',
            'Evita paralisia.'
        ]
    },
    'Resistência a Sono': {
        desc: 'Reduz a duração do sono.',
        levels: [
            'Reduz a duração de sono em 30%.',
            'Reduz a duração de sono em 60%.',
            'Evita sono.'
        ]
    },
    'Resistência Atordoamento': {
        desc: 'Reduz a duração do atordoamento.',
        levels: [
            'Reduz a duração de atordoamento em 60%.',
            'Reduz a duração de atordoamento em 90%.',
            'Evita atordoamento.'
        ]
    },
    'Resistência a Explosão': {
        desc: 'Concede proteção contra flagelo de explosão.',
        levels: [
            'Retarda flagelo de explosão e reduz dano de explosão.',
            'Retarda bastante flagelo de explosão e reduz dano de explosão.',
            'Evita flagelo de explosão.'
        ]
    },
    'Resistência Sangramento': {
        desc: 'Concede proteção contra sangramento.',
        levels: [
            'Reduz dano durante sangramento.',
            'Reduz bastante dano durante sangramento.',
            'Evita sangramento.'
        ]
    },
    'Pele de Ferro': {
        desc: 'Concede proteção contra Defesa Reduzida.',
        levels: [
            'Reduz a duração de Defesa Reduzida em 50%.',
            'Reduz a duração de Defesa Reduzida em 75%.',
            'Evita Defesa Reduzida.'
        ]
    },
    'Tampões': {
        desc: 'Concede proteção contra o rugido de monstros grandes.',
        levels: [
            'Reduz um pouco os efeitos dos rugidos fracos de monstros.',
            'Reduz os efeitos dos rugidos fracos de monstros.',
            'Anula os rugidos fracos de monstros.',
            'Anula os rugidos fracos de monstros e reduz os efeitos dos rugidos fortes de monstros.',
            'Anula os rugidos fracos e fortes de monstros.'
        ]
    },
    'Antivento': {
        desc: 'Concede proteção contra pressão de vento.',
        levels: [
            'Reduz um pouco os efeitos de pressão menor do vento.',
            'Reduz os efeitos de pressão menor do vento.',
            'Nega pressão menor do vento.',
            'Nega pressão menor do vento e reduz os efeitos de pressão maior do vento.',
            'Nega pressão menor e maior do vento.'
        ]
    },
    'Resistência a Tremor': {
        desc: 'Concede proteção contra tremores de terra.',
        levels: [
            'Anula tremores de terra menores.',
            'Anula tremores de terra menores e reduz os efeitos de tremores de terra maiores.',
            'Anula tremores de terra menores e maiores.'
        ]
    },
    // ── Lotes futuros serão adicionados aqui ──────────────
};

// ============================================================
//  BANCO DE DADOS (DB)
//  Não edite manualmente — use o Laboratório no app.
// ============================================================
let DB = {
    weapons: [{ id: 'w_0', name: '---', rarity: 1, atk: 0, aff: 0, element: 'Nenhum', elementVal: 0, elderseal: 'Nenhum', sharpness: 'Nenhuma', def: 0, slots: [], specialSkill: '', type: 'Padrão' }],
    charms:  [{ id: 'c_0', n: '---', rarity: 1, skills: {} }],
    armors: {
        head:  [{ id: 'head_0',  name: '---', rarity: 1, def: 0, res: [0,0,0,0,0], slots: [], skills: {}, set: 'Nenhum' }],
        chest: [{ id: 'chest_0', name: '---', rarity: 1, def: 0, res: [0,0,0,0,0], slots: [], skills: {}, set: 'Nenhum' }],
        arms:  [{ id: 'arms_0',  name: '---', rarity: 1, def: 0, res: [0,0,0,0,0], slots: [], skills: {}, set: 'Nenhum' }],
        waist: [{ id: 'waist_0', name: '---', rarity: 1, def: 0, res: [0,0,0,0,0], slots: [], skills: {}, set: 'Nenhum' }],
        legs:  [{ id: 'legs_0',  name: '---', rarity: 1, def: 0, res: [0,0,0,0,0], slots: [], skills: {}, set: 'Nenhum' }]
    },
    decorations: [],
    presets: {}
};

// Build inicial vazia
let build = {
    weapon: { data: DB.weapons[0], joias: [] },
    charm:  { data: DB.charms[0],  joias: [] },
    head:   { data: DB.armors.head[0],  joias: [] },
    chest:  { data: DB.armors.chest[0], joias: [] },
    arms:   { data: DB.armors.arms[0],  joias: [] },
    waist:  { data: DB.armors.waist[0], joias: [] },
    legs:   { data: DB.armors.legs[0],  joias: [] }
};