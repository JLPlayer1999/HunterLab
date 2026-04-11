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
    // ── Lote 2 (imagens 13–15, 38–41) ──────────────────────
    'Reforço de Ataque':          7,
    'Reforço de Defesa':          7,
    'Reforço de Vida':            3,
    'Olho Crítico':               7,
    'Reforço Crítico':            3,
    'Exploração de Fraqueza':     3,
    'Foco':                       3,
    // ── Lote 3 (imagens 42–51) ─────────────────────────────
    'Prolongar Poder':            3,
    'Artesanato':                 5,
    'Saque Crítico':              3,
    'Quebra-parte':               3,
    'Atordoante':                 5,
    'Ladrão de Vigor':            5,
    'Mestre da Montaria':         1,
    'No Ar':                      1,
    'Poder Latente':              7,
    'Agitador':                   7,
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
    // ── Lote 2 ────────────────────────────────────────────
    'Reforço de Ataque': {
        desc: 'Aumenta o poder de ataque. Também aumenta a afinidade em níveis mais altos.',
        levels: [
            'Ataque +3.',
            'Ataque +6.',
            'Ataque +9.',
            'Ataque +12. Afinidade +5%.',
            'Ataque +15. Afinidade +5%.',
            'Ataque +18. Afinidade +5%.',
            'Ataque +21. Afinidade +5%.',
        ]
    },
    'Reforço de Defesa': {
        desc: 'Aumenta a defesa. Também eleva o nível de resistências.',
        levels: [
            'Defesa +5.',
            'Defesa +10.',
            'Defesa +5%. Bônus +10.',
            'Defesa +5%. Bônus +20. Resistência a Todos Elementos +3.',
            'Defesa +8%. Bônus +20. Resistência a Todos Elementos +3.',
            'Defesa +8%. Bônus +35. Resistência a Todos Elementos +5.',
            'Defesa +10%. Bônus +35. Resistência a Todos Elementos +5.',
        ]
    },
    'Reforço de Vida': {
        desc: 'Aumenta a vida.',
        levels: [
            'Vida +15.',
            'Vida +30.',
            'Vida +50.',
        ]
    },
    'Olho Crítico': {
        desc: 'Aumenta a afinidade.',
        levels: [
            'Afinidade +5%.',
            'Afinidade +10%.',
            'Afinidade +15%.',
            'Afinidade +20%.',
            'Afinidade +25%.',
            'Afinidade +30%.',
            'Afinidade +40%.',
        ]
    },
    'Reforço Crítico': {
        desc: 'Aumenta o dano de acertos críticos.',
        levels: [
            'Aumenta o dano causado por acertos críticos para 30%.',
            'Aumenta o dano causado por acertos críticos para 35%.',
            'Aumenta o dano causado por acertos críticos para 40%.',
        ]
    },
    'Exploração de Fraqueza': {
        desc: 'Aumenta a afinidade de ataques que exploram o ponto fraco do monstro.',
        levels: [
            'Ataques que atingem pontos fracos têm mais 10% de afinidade e 5% extras em partes feridas.',
            'Ataques que atingem pontos fracos têm mais 15% de afinidade e 15% extras em partes feridas.',
            'Ataques que atingem pontos fracos têm mais 30% de afinidade e 20% extras em partes feridas.',
        ]
    },
    'Foco': {
        desc: 'Aumenta a taxa de preenchimento de armas com barras e a taxa de carga de armas com ataques energizados.',
        levels: [
            'Aumenta a taxa de enchimento da barra em 5% e reduz o tempo de carga em 5%.',
            'Aumenta a taxa de enchimento da barra em 10% e reduz o tempo de carga em 10%.',
            'Aumenta a taxa de enchimento da barra em 20% e reduz o tempo de carga em 15%.',
        ]
    },
    // ── Lote 3 ────────────────────────────────────────────
    'Prolongar Poder': {
        desc: 'Permite que lâminas dínamo, transmachados duplas-lâminas, glaives inseto e espadas longas fiquem mais tempo energizadas.',
        levels: [
            'Aumenta um pouco a duração dos estados energizados das armas.',
            'Aumenta a duração dos estados energizados das armas.',
            'Aumenta bastante a duração dos estados energizados das armas.',
        ]
    },
    'Artesanato': {
        desc: 'Prolonga a barra de fio da arma. Mas, não ultrapassará o máximo da barra.',
        levels: [
            'Afiação da arma +10.',
            'Afiação da arma +20.',
            'Afiação da arma +30.',
            'Afiação da arma +40.',
            'Afiação da arma +50.',
        ]
    },
    'Saque Crítico': {
        desc: 'Aumenta a afinidade ao realizar ataques imediatos.',
        levels: [
            'Afinidade ataque imediato +30%.',
            'Afinidade ataque imediato +60%.',
            'Afinidade ataque imediato +100%.',
        ]
    },
    'Quebra-parte': {
        desc: 'Facilita a ação de quebrar ou cortar partes de monstros grandes.',
        levels: [
            'Dano em partes +10%.',
            'Dano em partes +20%.',
            'Dano em partes +30%.',
        ]
    },
    'Atordoante': {
        desc: 'Mais fácil para desnortear monstros.',
        levels: [
            'Poder de Atordoamento +20%.',
            'Poder de Atordoamento +30%.',
            'Poder de Atordoamento +40%.',
            'Poder de Atordoamento +50%.',
            'Poder de Atordoamento +60%.',
        ]
    },
    'Ladrão de Vigor': {
        desc: 'Aumenta a capacidade de certos ataques de esgotar os monstros.',
        levels: [
            'Poder de Exaustão +20%.',
            'Poder de Exaustão +30%.',
            'Poder de Exaustão +40%.',
            'Poder de Exaustão +50%.',
            'Poder de Exaustão +60%.',
        ]
    },
    'Mestre da Montaria': {
        desc: 'Facilita montar em monstros.',
        levels: [
            'Facilita montar em monstros e derrubar monstros montados.',
        ]
    },
    'No Ar': {
        desc: 'Aumenta o dano causado por ataques com salto.',
        levels: [
            'Poder de ataque com salto +30%.',
        ]
    },
    'Poder Latente': {
        desc: 'Aumenta temporariamente a afinidade e reduz o consumo de vigor sob certas condições.',
        levels: [
            'Ativado, aumenta a afinidade em 10% e reduz o consumo de vigor em 30%.',
            'Ativado, aumenta a afinidade em 20% e reduz o consumo de vigor em 30%.',
            'Ativado, aumenta a afinidade em 30% e reduz o consumo de vigor em 50%.',
            'Ativado, aumenta a afinidade em 40% e reduz o consumo de vigor em 50%.',
            'Ativado, aumenta a afinidade em 50% e reduz o consumo de vigor em 50%.',
            'Ativado, aumenta a afinidade em 50% e reduz o consumo de vigor em 50%. Ativa mais facilmente.',
            'Ativado, aumenta a afinidade em 60% e reduz o consumo de vigor em 50%. Ativa mais facilmente.',
        ]
    },
    'Agitador': {
        desc: 'Aumenta o poder de ataque e a afinidade quando monstros grandes se enfurecem.',
        levels: [
            'Ativado, concede ataque +4 e aumenta a afinidade em 5%.',
            'Ativado, concede ataque +8 e aumenta a afinidade em 5%.',
            'Ativado, concede ataque +12 e aumenta a afinidade em 7%.',
            'Ativado, concede ataque +16 e aumenta a afinidade em 7%.',
            'Ativado, concede ataque +20 e aumenta a afinidade em 10%.',
            'Ativado, concede ataque +24 e aumenta a afinidade em 15%.',
            'Ativado, concede ataque +28 e aumenta a afinidade em 20%.',
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