export interface SpellingPatternRule {
  id: string;
  patternName: string;
  britishEnding: string;
  americanEnding: string;
  explanation: string;
  examples: Array<{ british: string; american: string; meaning: string }>;
}

export interface EverydayWordPair {
  id: string;
  concept: string;
  british: string;
  american: string;
  category: string;
  funFact: string;
}

export const SPELLING_PATTERNS: SpellingPatternRule[] = [
  {
    id: 'our-vs-or',
    patternName: '-our versus -or',
    britishEnding: '-our',
    americanEnding: '-or',
    explanation: 'British English retained the "u" from Norman French loanwords. In 1828, lexicographer Noah Webster eliminated the silent "u" in his American dictionary to make spelling more phonetic.',
    examples: [
      { british: 'colour', american: 'color', meaning: 'The visual property of reflected light' },
      { british: 'favourite', american: 'favorite', meaning: 'Most liked or preferred' },
      { british: 'honour', american: 'honor', meaning: 'High respect or moral integrity' },
      { british: 'flavour', american: 'flavor', meaning: 'Distinctive taste of food or drink' },
      { british: 'neighbour', american: 'neighbor', meaning: 'A person living nearby' },
      { british: 'humour', american: 'humor', meaning: 'The quality of being amusing' },
    ],
  },
  {
    id: 're-vs-er',
    patternName: '-re versus -er',
    britishEnding: '-re',
    americanEnding: '-er',
    explanation: 'British English preserved the French word-ending "-re". American English flipped the final two letters to "-er" to align directly with how the word is pronounced.',
    examples: [
      { british: 'centre', american: 'center', meaning: 'The middle point or core' },
      { british: 'theatre', american: 'theater', meaning: 'A building for dramatic performances' },
      { british: 'metre', american: 'meter', meaning: 'Metric unit of measurement (100 cm)' },
      { british: 'fibre', american: 'fiber', meaning: 'A thread or filament' },
      { british: 'litre', american: 'liter', meaning: 'Metric unit of liquid volume' },
    ],
  },
  {
    id: 'ise-vs-ize',
    patternName: '-ise versus -ize',
    britishEnding: '-ise',
    americanEnding: '-ize',
    explanation: 'British English commonly uses the French-influenced "-ise" suffix (though Oxford English also recognises -ize). American English exclusively standardises on the Greek "-ize".',
    examples: [
      { british: 'organise', american: 'organize', meaning: 'To arrange systematically' },
      { british: 'recognise', american: 'recognize', meaning: 'To identify from previous knowledge' },
      { british: 'apologise', american: 'apologize', meaning: 'To express regret for something done' },
      { british: 'realise', american: 'realize', meaning: 'To become fully aware of a fact' },
      { british: 'summarise', american: 'summarize', meaning: 'To give a brief statement of main points' },
    ],
  },
  {
    id: 'll-vs-l',
    patternName: 'Double "ll" versus single "l"',
    britishEnding: '-lling / -lled',
    americanEnding: '-ling / -led',
    explanation: 'When adding suffixes like -ing or -ed to words ending in "l" preceded by a single vowel, British English doubles the "l" (travelling, cancelled), whereas American English keeps a single "l" (traveling, canceled).',
    examples: [
      { british: 'travelling', american: 'traveling', meaning: 'Going from one place to another' },
      { british: 'cancelled', american: 'canceled', meaning: 'Called off or annulled' },
      { british: 'fuelled', american: 'fueled', meaning: 'Supplied with power or fuel' },
      { british: 'modelled', american: 'modeled', meaning: 'Fashioned or shaped' },
    ],
  },
  {
    id: 'ce-vs-se',
    patternName: '-ce versus -se',
    britishEnding: '-ce (nouns)',
    americanEnding: '-se (nouns)',
    explanation: 'In British English, certain nouns take "c" while related verbs take "s" (e.g. practise/practice, licence/license). American English simplifies nouns to "-se".',
    examples: [
      { british: 'defence', american: 'defense', meaning: 'The act of shielding or protecting' },
      { british: 'offence', american: 'offense', meaning: 'An illegal act or breach of a rule' },
      { british: 'licence', american: 'license', meaning: 'A formal permit or authorization' },
    ],
  },
];

export const EVERYDAY_VOCAB_PAIRS: EverydayWordPair[] = [
  {
    id: 'ev-1',
    concept: 'Portable electric hand lamp',
    british: 'torch',
    american: 'flashlight',
    category: 'Objects & Tools',
    funFact: 'In the UK, "torch" evolved from medieval flaming torches carried through dark streets.',
  },
  {
    id: 'ev-2',
    concept: 'Rear storage compartment of an automobile',
    british: 'boot',
    american: 'trunk',
    category: 'Vehicles & Transport',
    funFact: 'Old horse carriages literally strapped wooden trunks to the back for luggage.',
  },
  {
    id: 'ev-3',
    concept: 'Front hinged engine cover of a car',
    british: 'bonnet',
    american: 'hood',
    category: 'Vehicles & Transport',
    funFact: '"Bonnet" comes from the traditional tied headwear resembling the engine cover shape.',
  },
  {
    id: 'ev-4',
    concept: 'Crisp baked snack made of flour and butter',
    british: 'biscuit',
    american: 'cookie',
    category: 'Food & Cooking',
    funFact: 'In the US, a "biscuit" is a warm, fluffy quick-bread roll often served with gravy.',
  },
  {
    id: 'ev-5',
    concept: 'Pedestrian walkway beside a street',
    british: 'pavement',
    american: 'sidewalk',
    category: 'Streets & Towns',
    funFact: 'In the US, "pavement" refers to the paved road surface itself where cars drive!',
  },
  {
    id: 'ev-6',
    concept: 'Large heavy motor vehicle for transporting goods',
    british: 'lorry',
    american: 'truck',
    category: 'Vehicles & Transport',
    funFact: '"Lorry" comes from the northern English dialect verb "lurry" meaning to pull or lug.',
  },
  {
    id: 'ev-7',
    concept: 'Season between summer and winter',
    british: 'autumn',
    american: 'fall',
    category: 'Nature & Seasons',
    funFact: '"Fall" was originally used in 16th-century England as a poetic shorthand for "fall of the leaf".',
  },
  {
    id: 'ev-8',
    concept: 'Time off from school or work',
    british: 'holiday',
    american: 'vacation',
    category: 'Life & Leisure',
    funFact: '"Holiday" stems from Old English "holy day" (religious festivals with no school or work).',
  },
];
