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
    // ── Sets das imagens ──────────────────────────────────
    'Arte Absoluta de Presagélida',
    'Vontade de Brachydios',
    'Divindade de Shara Ishvalda',
    // Adicionar mais sets conforme for cadastrando armaduras
];

// setBonuses: cada set pode ter múltiplos níveis de bônus
// Formato: array de { req: N, name: 'Nome do Bônus', desc: 'Descrição' }
// O sistema ativa automaticamente quando o caçador tem >= req peças do set
const setBonuses = {
    'Arte Absoluta de Presagélida': [
        { req: 1, name: 'Punição Imediata',
          desc: 'Ataques imediatos ganham atordoamento. Aumenta um pouco o poder de ataque.' },
        { req: 3, name: 'Segredo Atordoante',
          desc: 'Aumenta o nível máximo da habilidade Atordoante.' },
    ],
    'Vontade de Brachydios': [
        { req: 2, name: 'Segredo Agitador',
          desc: 'Aumenta o nível máximo da habilidade Agitador.' },
        { req: 4, name: 'Segredo Artilharia',
          desc: 'Aumenta o nível máximo da habilidade Artilharia.' },
    ],
    'Divindade de Shara Ishvalda': [
        { req: 4, name: 'Véu de Gaia',
          desc: 'Ao usar um manto, ganhe Tampões Nv3, Antivento Nv3, Resistência a Tremor Nv3 e Sem Recuo.' },
        { req: 5, name: 'Véu de Gaia Real',
          desc: 'Ao usar um manto, ganhe Tampões Nv5, Resistência a Tremor Nv3, Antivento máx. e Sem Recuo.' },
    ],
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
    // ── Lote 4 (imagens 32,57,64,69,73,74,80,86) ───────────
    'Ataque de Explosão':         4,
    'Maestro de Sonoro':          2,
    'Surto de Vigor':             3,
    'Bainha Rápida':              3,
    'Comer Rapidamente':          3,
    'Afiação Rápida':             3,
    'Bênção Divina':              3,
    'Sem Recuo':                  3,
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
            'Aumenta o dano causado por acertos críticos para 30%. <g>Base do jogo: 25% → 30% (+5%); ex: golpe 300 → 390 ao crítico</g>',
            'Aumenta o dano causado por acertos críticos para 35%. <g>Base do jogo: 25% → 35% (+10%); ex: golpe 300 → 405 ao crítico</g>',
            'Aumenta o dano causado por acertos críticos para 40%. <g>Base do jogo: 25% → 40% (+15%); ex: golpe 300 → 420 ao crítico</g>',
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
            'Aumenta um pouco a duração dos estados energizados das armas. <g>Duração +10% (ex: Modo Demônio DL: 60s → 66s)</g>',
            'Aumenta a duração dos estados energizados das armas. <g>Duração +20% (ex: Modo Demônio DL: 60s → 72s)</g>',
            'Aumenta bastante a duração dos estados energizados das armas. <g>Duração +40% (ex: Modo Demônio DL: 60s → 84s)</g>',
        ]
    },
    'Artesanato': {
        desc: 'Prolonga a barra de fio da arma. Mas, não ultrapassará o máximo da barra.',
        levels: [
            'Afiação da arma +10. <g>≈7 golpes extras antes de perder o nível de afiação (varia por arma)</g>',
            'Afiação da arma +20. <g>≈14 golpes extras antes de perder o nível de afiação</g>',
            'Afiação da arma +30. <g>≈20 golpes extras; suficiente para manter Branca a hunt inteira em muitas armas</g>',
            'Afiação da arma +40. <g>≈27 golpes extras; praticamente elimina a necessidade de afiar durante a hunt</g>',
            'Afiação da arma +50. <g>≈34 golpes extras; máximo — ideal para armas com barra de afiação curta</g>',
        ]
    },
    'Saque Crítico': {
        desc: 'Aumenta a afinidade ao realizar ataques imediatos.',
        levels: [
            'Afinidade ataque imediato +30%. <g>Aplica-se apenas ao 1º golpe após sacar a arma (Draw Attack)</g>',
            'Afinidade ataque imediato +60%. <g>Combo de 2 críticos garantidos com 60%+ de afin. base</g>',
            'Afinidade ataque imediato +100%. <g>Draw Attack sempre critica, independente da afinidade base</g>',
        ]
    },
    'Quebra-parte': {
        desc: 'Facilita a ação de quebrar ou cortar partes de monstros grandes.',
        levels: [
            'Dano em partes +10%. <g>Aplica-se ao acúmulo de HP da parte; não aparece como dano separado na tela</g>',
            'Dano em partes +20%. <g>Reduz em ~1-2 golpes o número necessário para quebrar uma parte</g>',
            'Dano em partes +30%. <g>Máximo — equivale a ~2-3 golpes a menos por parte; útil para drops de partes raras</g>',
        ]
    },
    'Atordoante': {
        desc: 'Mais fácil para desnortear monstros.',
        levels: [
            'Poder de Atordoamento +20%. <g>Acúmulo de KO por golpe aumentado; 1º KO geralmente ~100 pts, 2º ~200 pts</g>',
            'Poder de Atordoamento +30%. <g>Reduz em ~1-2 golpes o número necessário para KO</g>',
            'Poder de Atordoamento +40%. <g>Reduz em ~2-3 golpes o número necessário para KO</g>',
            'Poder de Atordoamento +50%. <g>Reduz em ~3-4 golpes; segundo KO da hunt mais acessível</g>',
            'Poder de Atordoamento +60%. <g>Máximo — reduz em ~4-5 golpes o tempo até o KO</g>',
        ]
    },
    'Ladrão de Vigor': {
        desc: 'Aumenta a capacidade de certos ataques de esgotar os monstros.',
        levels: [
            'Poder de Exaustão +20%. <g>Monstros exaustos ficam mais lentos e salivam; estado dura ~60s</g>',
            'Poder de Exaustão +30%. <g>Reduz em ~1-2 hits o número necessário para esgotar o monstro</g>',
            'Poder de Exaustão +40%. <g>Ideal para loops de exaustão em hunts longas</g>',
            'Poder de Exaustão +50%. <g>2º ciclo de exaustão ativado mais rapidamente (threshold dobra)</g>',
            'Poder de Exaustão +60%. <g>Máximo — encurta significativamente o intervalo entre exaustões</g>',
        ]
    },
    'Mestre da Montaria': {
        desc: 'Facilita montar em monstros.',
        levels: [
            'Facilita montar em monstros e derrubar monstros montados. <g>Acúmulo de montaria +50%; minigame de derrubada mais favorável</g>',
        ]
    },
    'No Ar': {
        desc: 'Aumenta o dano causado por ataques com salto.',
        levels: [
            'Poder de ataque com salto +30%. <g>MV dos ataques aéreos ×1.30; também aumenta acúmulo de montaria</g>',
        ]
    },
    'Poder Latente': {
        desc: 'Aumenta temporariamente a afinidade e reduz o consumo de vigor sob certas condições.',
        levels: [
            'Ativado, aumenta a afinidade em 10% e reduz o consumo de vigor em 30%. <g>Ativa após receber 180 pts de dano acumulado</g>',
            'Ativado, aumenta a afinidade em 20% e reduz o consumo de vigor em 30%. <g>Ativa após receber 180 pts de dano acumulado</g>',
            'Ativado, aumenta a afinidade em 30% e reduz o consumo de vigor em 50%. <g>Ativa após receber 180 pts de dano acumulado</g>',
            'Ativado, aumenta a afinidade em 40% e reduz o consumo de vigor em 50%. <g>Ativa após receber 180 pts de dano acumulado</g>',
            'Ativado, aumenta a afinidade em 50% e reduz o consumo de vigor em 50%. <g>Ativa após receber 180 pts de dano acumulado; duração 60s</g>',
            'Ativado, aumenta a afinidade em 50% e reduz o consumo de vigor em 50%. Ativa mais facilmente. <g>Ativa após receber 150 pts de dano; duração 60s</g>',
            'Ativado, aumenta a afinidade em 60% e reduz o consumo de vigor em 50%. Ativa mais facilmente. <g>Ativa após receber 150 pts de dano; duração 60s</g>',
        ]
    },
    'Agitador': {
        desc: 'Aumenta o poder de ataque e a afinidade quando monstros grandes se enfurecem.',
        levels: [
            'Ativado, concede ataque +4 e aumenta a afinidade em 5%. <g>Ativa automaticamente quando o monstro entra em fúria (olhos vermelhos)</g>',
            'Ativado, concede ataque +8 e aumenta a afinidade em 5%. <g>Ativa automaticamente quando o monstro entra em fúria</g>',
            'Ativado, concede ataque +12 e aumenta a afinidade em 7%. <g>Ativa automaticamente quando o monstro entra em fúria</g>',
            'Ativado, concede ataque +16 e aumenta a afinidade em 7%. <g>Ativa automaticamente quando o monstro entra em fúria</g>',
            'Ativado, concede ataque +20 e aumenta a afinidade em 10%. <g>Ativa automaticamente quando o monstro entra em fúria</g>',
            'Ativado, concede ataque +24 e aumenta a afinidade em 15%. <g>Ativa automaticamente; duração da fúria varia por monstro (~60-90s)</g>',
            'Ativado, concede ataque +28 e aumenta a afinidade em 20%. <g>Máximo — bônus expressivo; ideal quando o monstro fica enraivecido frequentemente</g>',
        ]
    },
    // ── Lote 4 ────────────────────────────────────────────
    'Ataque de Explosão': {
        desc: 'Aumenta a taxa de acúmulo de explosão. (Acúmulo elemental tem limite máximo.)',
        levels: [
            'Acúmulo de Explosão +5%. Bônus: +10. <g>Explosão causa ~100-300 de dano fixo dependendo do monstro; 1º trigger: 300 pts de acúmulo</g>',
            'Acúmulo de Explosão +10%. Bônus: +10. <g>Trigger mais rápido; Nv2 suficiente para maioria das builds de Blast</g>',
            'Acúmulo de Explosão +20%. Bônus: +10. <g>~2-3 hits a menos por trigger em armas com Blast baixo</g>',
            'Acúmulo de Explosão +30%. Bônus: +10. <g>Máximo; ideal para armas com Blast base alto como Brachydios</g>',
        ]
    },
    'Maestro de Sonoro': {
        desc: 'Aumenta o tempo do efeito de melodias do berrante de caça.',
        levels: [
            'Prolonga a duração do efeito de melodia e aumenta a regeneração de vida. <g>Duração +33% (ex: buff de 90s → 120s); HP regen da melodia de Vida amplificada</g>',
            'Aumenta bastante o tempo do efeito de melodias do berrante de caça. <g>Duração +66% (ex: buff de 90s → 150s); todas as melodias de cura amplificadas</g>',
        ]
    },
    'Surto de Vigor': {
        desc: 'Acelera a regeneração de vigor.',
        levels: [
            'Velocidade de regeneração de vigor +10%. <g>Vigor base regenera em 18s → ~16s com Nv1</g>',
            'Velocidade de regeneração de vigor +20%. <g>Vigor base regenera em 18s → ~15s com Nv2</g>',
            'Velocidade de regeneração de vigor +30%. <g>Vigor base regenera em 18s → ~14s com Nv3</g>',
        ]
    },
    'Bainha Rápida': {
        desc: 'Acelera o embainhamento da arma.',
        levels: [
            'Aumenta um pouco a velocidade de embainhamento. <g>Frames de embainhamento: 44f → 37f</g>',
            'Aumenta razoavelmente a velocidade de embainhamento. <g>Frames de embainhamento: 44f → 30f</g>',
            'Aumenta bastante a velocidade de embainhamento. <g>Frames de embainhamento: 44f → 22f</g>',
        ]
    },
    'Comer Rapidamente': {
        desc: 'Aumenta a velocidade de ingestão de carne e consumo de itens.',
        levels: [
            'Aumenta um pouco a velocidade de uso de itens. <g>Animação de carne: ~3.5s → ~2.8s</g>',
            'Aumenta razoavelmente a velocidade de uso de itens. <g>Animação de carne: ~3.5s → ~2.2s</g>',
            'Aumenta bastante a velocidade de uso de itens. <g>Animação de carne: ~3.5s → ~1.7s</g>',
        ]
    },
    'Afiação Rápida': {
        desc: 'Acelera a afiação da arma ao usar uma pedra de amolar.',
        levels: [
            'Remove um ciclo do processo de afiação. <g>Afiação normal: 4 ciclos → 3 ciclos (~14f de afiação)</g>',
            'Remove dois ciclos do processo de afiação. <g>Afiação normal: 4 ciclos → 2 ciclos (~28f de afiação)</g>',
            'Remove três ciclos do processo de afiação. <g>Afiação normal: 4 ciclos → 1 ciclo (~42f de afiação)</g>',
        ]
    },
    'Bênção Divina': {
        desc: 'Há uma chance predeterminada de reduzir o dano recebido.',
        levels: [
            'Ativado, reduz o dano recebido em 15%. <g>Chance de ativação: 50%</g>',
            'Ativado, reduz o dano recebido em 30%. <g>Chance de ativação: 50%</g>',
            'Ativado, reduz o dano recebido em 50%. <g>Chance de ativação: 50%</g>',
        ]
    },
    'Sem Recuo': {
        desc: 'Evita empurrões e outras reações a danos pequenos.',
        levels: [
            'Evita empurrões. Aumenta alguns efeitos de extrato de Kinseto. <g>Cancela reações de Low Knockback</g>',
            'Evita empurrões. Queda reduzida a empurrão. Aumenta alguns efeitos de extrato de Kinseto. <g>Cancela Low e Mid Knockback</g>',
            'Evita empurrões e quedas. Aumenta alguns efeitos de extrato de Kinseto. <g>Cancela Low, Mid e High Knockback</g>',
        ]
    },
    // ── Bônus de Set (imagens 104, 135, 137) ──────────────
    // Nota: bônus de set são ativados automaticamente com X peças do set
    // e aparecem no campo 'specialSkills' dos itens de armadura no setBonuses
    // Divindade de Shara Ishvalda (4p: Véu de Gaia / 5p: Véu de Gaia Real)
    // Vontade de Brachydios (2p: Segredo Agitador / 4p: Segredo Artilharia)
    // Arte Absoluta de Presagélida (1p: Punição Imediata / 3p: Segredo Atordoante)
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