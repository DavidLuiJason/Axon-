// AXON Offline Scripture Database & Local Semantic Search Index
// Operates 100% locally with ZERO network calls

export interface BibleBook {
  id: string;
  name: string;
  testament: 'OT' | 'NT';
  category: string;
  chaptersCount: number;
}

export interface ScriptureVerse {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  keywords: string[];
}

export const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament
  { id: 'gen', name: 'Genesis', testament: 'OT', category: 'Law / Pentateuch', chaptersCount: 50 },
  { id: 'exo', name: 'Exodus', testament: 'OT', category: 'Law / Pentateuch', chaptersCount: 40 },
  { id: 'lev', name: 'Leviticus', testament: 'OT', category: 'Law / Pentateuch', chaptersCount: 27 },
  { id: 'num', name: 'Numbers', testament: 'OT', category: 'Law / Pentateuch', chaptersCount: 36 },
  { id: 'deu', name: 'Deuteronomy', testament: 'OT', category: 'Law / Pentateuch', chaptersCount: 34 },
  { id: 'jos', name: 'Joshua', testament: 'OT', category: 'History', chaptersCount: 24 },
  { id: 'jdg', name: 'Judges', testament: 'OT', category: 'History', chaptersCount: 21 },
  { id: 'rut', name: 'Ruth', testament: 'OT', category: 'History', chaptersCount: 4 },
  { id: '1sa', name: '1 Samuel', testament: 'OT', category: 'History', chaptersCount: 31 },
  { id: '2sa', name: '2 Samuel', testament: 'OT', category: 'History', chaptersCount: 24 },
  { id: '1ki', name: '1 Kings', testament: 'OT', category: 'History', chaptersCount: 22 },
  { id: '2ki', name: '2 Kings', testament: 'OT', category: 'History', chaptersCount: 25 },
  { id: 'psa', name: 'Psalms', testament: 'OT', category: 'Poetry & Wisdom', chaptersCount: 150 },
  { id: 'pro', name: 'Proverbs', testament: 'OT', category: 'Poetry & Wisdom', chaptersCount: 31 },
  { id: 'ecc', name: 'Ecclesiastes', testament: 'OT', category: 'Poetry & Wisdom', chaptersCount: 12 },
  { id: 'isa', name: 'Isaiah', testament: 'OT', category: 'Major Prophets', chaptersCount: 66 },
  { id: 'jer', name: 'Jeremiah', testament: 'OT', category: 'Major Prophets', chaptersCount: 52 },
  { id: 'dan', name: 'Daniel', testament: 'OT', category: 'Major Prophets', chaptersCount: 12 },
  { id: 'mic', name: 'Micah', testament: 'OT', category: 'Minor Prophets', chaptersCount: 7 },
  // New Testament
  { id: 'mat', name: 'Matthew', testament: 'NT', category: 'Gospels', chaptersCount: 28 },
  { id: 'mar', name: 'Mark', testament: 'NT', category: 'Gospels', chaptersCount: 16 },
  { id: 'luk', name: 'Luke', testament: 'NT', category: 'Gospels', chaptersCount: 24 },
  { id: 'joh', name: 'John', testament: 'NT', category: 'Gospels', chaptersCount: 21 },
  { id: 'act', name: 'Acts', testament: 'NT', category: 'History', chaptersCount: 28 },
  { id: 'rom', name: 'Romans', testament: 'NT', category: 'Pauline Epistles', chaptersCount: 16 },
  { id: '1co', name: '1 Corinthians', testament: 'NT', category: 'Pauline Epistles', chaptersCount: 16 },
  { id: '2co', name: '2 Corinthians', testament: 'NT', category: 'Pauline Epistles', chaptersCount: 13 },
  { id: 'gal', name: 'Galatians', testament: 'NT', category: 'Pauline Epistles', chaptersCount: 6 },
  { id: 'eph', name: 'Ephesians', testament: 'NT', category: 'Pauline Epistles', chaptersCount: 6 },
  { id: 'php', name: 'Philippians', testament: 'NT', category: 'Pauline Epistles', chaptersCount: 4 },
  { id: 'col', name: 'Colossians', testament: 'NT', category: 'Pauline Epistles', chaptersCount: 4 },
  { id: '1th', name: '1 Thessalonians', testament: 'NT', category: 'Pauline Epistles', chaptersCount: 5 },
  { id: '1ti', name: '1 Timothy', testament: 'NT', category: 'Pauline Epistles', chaptersCount: 6 },
  { id: '2ti', name: '2 Timothy', testament: 'NT', category: 'Pauline Epistles', chaptersCount: 4 },
  { id: 'heb', name: 'Hebrews', testament: 'NT', category: 'General Epistles', chaptersCount: 13 },
  { id: 'jam', name: 'James', testament: 'NT', category: 'General Epistles', chaptersCount: 5 },
  { id: '1pe', name: '1 Peter', testament: 'NT', category: 'General Epistles', chaptersCount: 5 },
  { id: '1jo', name: '1 John', testament: 'NT', category: 'General Epistles', chaptersCount: 5 },
  { id: 'rev', name: 'Revelation', testament: 'NT', category: 'Apocalyptic', chaptersCount: 22 },
];

export const CORE_OFFLINE_VERSES: ScriptureVerse[] = [
  // Creation & Foundations
  {
    bookId: 'gen',
    bookName: 'Genesis',
    chapter: 1,
    verse: 1,
    text: 'In the beginning God created the heaven and the earth.',
    keywords: ['beginning', 'creation', 'god', 'heaven', 'earth', 'origin'],
  },
  {
    bookId: 'gen',
    bookName: 'Genesis',
    chapter: 1,
    verse: 3,
    text: 'And God said, Let there be light: and there was light.',
    keywords: ['light', 'command', 'creation', 'dawn'],
  },
  {
    bookId: 'gen',
    bookName: 'Genesis',
    chapter: 1,
    verse: 27,
    text: 'So God created man in his own image, in the image of God created he him; male and female created he them.',
    keywords: ['image', 'man', 'creation', 'humanity', 'dignity'],
  },
  // Psalms of Comfort & Protection
  {
    bookId: 'psa',
    bookName: 'Psalms',
    chapter: 23,
    verse: 1,
    text: 'The LORD is my shepherd; I shall not want.',
    keywords: ['shepherd', 'provision', 'comfort', 'peace', 'need'],
  },
  {
    bookId: 'psa',
    bookName: 'Psalms',
    chapter: 23,
    verse: 4,
    text: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.',
    keywords: ['fear', 'death', 'comfort', 'courage', 'protection', 'valley'],
  },
  {
    bookId: 'psa',
    bookName: 'Psalms',
    chapter: 46,
    verse: 1,
    text: 'God is our refuge and strength, a very present help in trouble.',
    keywords: ['refuge', 'strength', 'trouble', 'help', 'shelter', 'hardship'],
  },
  {
    bookId: 'psa',
    bookName: 'Psalms',
    chapter: 46,
    verse: 10,
    text: 'Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.',
    keywords: ['peace', 'stillness', 'meditation', 'rest', 'sovereignty'],
  },
  {
    bookId: 'psa',
    bookName: 'Psalms',
    chapter: 119,
    verse: 105,
    text: 'Thy word is a lamp unto my feet, and a light unto my path.',
    keywords: ['word', 'guidance', 'lamp', 'path', 'direction', 'truth'],
  },
  {
    bookId: 'psa',
    bookName: 'Psalms',
    chapter: 139,
    verse: 14,
    text: 'I will praise thee; for I am fearfully and wonderfully made: marvellous are thy works; and that my soul knoweth right well.',
    keywords: ['praise', 'creation', 'wonder', 'identity', 'soul'],
  },
  // Proverbs & Wisdom
  {
    bookId: 'pro',
    bookName: 'Proverbs',
    chapter: 3,
    verse: 5,
    text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.',
    keywords: ['trust', 'heart', 'understanding', 'faith', 'guidance', 'decision'],
  },
  {
    bookId: 'pro',
    bookName: 'Proverbs',
    chapter: 3,
    verse: 6,
    text: 'In all thy ways acknowledge him, and he shall direct thy paths.',
    keywords: ['guidance', 'path', 'direction', 'wisdom'],
  },
  {
    bookId: 'pro',
    bookName: 'Proverbs',
    chapter: 4,
    verse: 23,
    text: 'Keep thy heart with all diligence; for out of it are the issues of life.',
    keywords: ['heart', 'diligence', 'guard', 'thoughts', 'purity'],
  },
  {
    bookId: 'pro',
    bookName: 'Proverbs',
    chapter: 16,
    verse: 3,
    text: 'Commit thy works unto the LORD, and thy thoughts shall be established.',
    keywords: ['work', 'plans', 'thoughts', 'purpose', 'future'],
  },
  // Prophets
  {
    bookId: 'isa',
    bookName: 'Isaiah',
    chapter: 40,
    verse: 31,
    text: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.',
    keywords: ['strength', 'wait', 'patience', 'endurance', 'weariness', 'hope', 'eagles'],
  },
  {
    bookId: 'isa',
    bookName: 'Isaiah',
    chapter: 41,
    verse: 10,
    text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.',
    keywords: ['fear', 'anxiety', 'strength', 'presence', 'comfort', 'help'],
  },
  {
    bookId: 'jer',
    bookName: 'Jeremiah',
    chapter: 29,
    verse: 11,
    text: 'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.',
    keywords: ['future', 'hope', 'peace', 'plans', 'purpose', 'destiny'],
  },
  {
    bookId: 'mic',
    bookName: 'Micah',
    chapter: 6,
    verse: 8,
    text: 'He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?',
    keywords: ['justice', 'mercy', 'humility', 'conduct', 'righteousness'],
  },
  // Gospels & Beatitudes
  {
    bookId: 'mat',
    bookName: 'Matthew',
    chapter: 5,
    verse: 3,
    text: 'Blessed are the poor in spirit: for theirs is the kingdom of heaven.',
    keywords: ['blessed', 'beatitudes', 'humility', 'spirit', 'kingdom'],
  },
  {
    bookId: 'mat',
    bookName: 'Matthew',
    chapter: 5,
    verse: 9,
    text: 'Blessed are the peacemakers: for they shall be called the children of God.',
    keywords: ['peace', 'peacemakers', 'blessed', 'reconciliation'],
  },
  {
    bookId: 'mat',
    bookName: 'Matthew',
    chapter: 6,
    verse: 33,
    text: 'But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.',
    keywords: ['priorities', 'kingdom', 'provision', 'worry', 'needs'],
  },
  {
    bookId: 'mat',
    bookName: 'Matthew',
    chapter: 11,
    verse: 28,
    text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.',
    keywords: ['rest', 'weary', 'burden', 'peace', 'comfort', 'stress'],
  },
  {
    bookId: 'mat',
    bookName: 'Matthew',
    chapter: 28,
    verse: 19,
    text: 'Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost.',
    keywords: ['great commission', 'nations', 'teach', 'evangelism', 'mission'],
  },
  {
    bookId: 'joh',
    bookName: 'John',
    chapter: 1,
    verse: 1,
    text: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
    keywords: ['word', 'jesus', 'beginning', 'deity', 'christ'],
  },
  {
    bookId: 'joh',
    bookName: 'John',
    chapter: 3,
    verse: 16,
    text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
    keywords: ['love', 'salvation', 'eternal life', 'gospel', 'faith', 'son'],
  },
  {
    bookId: 'joh',
    bookName: 'John',
    chapter: 8,
    verse: 32,
    text: 'And ye shall know the truth, and the truth shall make you free.',
    keywords: ['truth', 'freedom', 'liberty', 'knowledge'],
  },
  {
    bookId: 'joh',
    bookName: 'John',
    chapter: 14,
    verse: 6,
    text: 'Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.',
    keywords: ['way', 'truth', 'life', 'jesus', 'salvation'],
  },
  {
    bookId: 'joh',
    bookName: 'John',
    chapter: 14,
    verse: 27,
    text: 'Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.',
    keywords: ['peace', 'comfort', 'anxiety', 'fear', 'heart'],
  },
  // Romans & Epistles
  {
    bookId: 'rom',
    bookName: 'Romans',
    chapter: 8,
    verse: 28,
    text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.',
    keywords: ['purpose', 'good', 'sovereignty', 'trials', 'providence', 'hope'],
  },
  {
    bookId: 'rom',
    bookName: 'Romans',
    chapter: 8,
    verse: 38,
    text: 'For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come,',
    keywords: ['assurance', 'security', 'protection', 'love of god'],
  },
  {
    bookId: 'rom',
    bookName: 'Romans',
    chapter: 8,
    verse: 39,
    text: 'Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.',
    keywords: ['love', 'inseparable', 'eternal security', 'grace'],
  },
  {
    bookId: 'rom',
    bookName: 'Romans',
    chapter: 12,
    verse: 2,
    text: 'And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God.',
    keywords: ['mind', 'transformation', 'renewal', 'world', 'will of god'],
  },
  // 1 Corinthians (Love Chapter)
  {
    bookId: '1co',
    bookName: '1 Corinthians',
    chapter: 13,
    verse: 4,
    text: 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up,',
    keywords: ['love', 'charity', 'patience', 'kindness', 'envy', 'humility'],
  },
  {
    bookId: '1co',
    bookName: '1 Corinthians',
    chapter: 13,
    verse: 7,
    text: 'Beareth all things, believeth all things, hopeth all things, endureth all things.',
    keywords: ['love', 'endurance', 'faith', 'hope', 'relationships'],
  },
  {
    bookId: '1co',
    bookName: '1 Corinthians',
    chapter: 13,
    verse: 13,
    text: 'And now abideth faith, hope, charity, these three; but the greatest of these is charity.',
    keywords: ['faith', 'hope', 'love', 'charity', 'virtues'],
  },
  // Galatians & Fruit of the Spirit
  {
    bookId: 'gal',
    bookName: 'Galatians',
    chapter: 5,
    verse: 22,
    text: 'But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith,',
    keywords: ['fruit of the spirit', 'joy', 'peace', 'gentleness', 'patience', 'goodness'],
  },
  {
    bookId: 'gal',
    bookName: 'Galatians',
    chapter: 5,
    verse: 23,
    text: 'Meekness, temperance: against such there is no law.',
    keywords: ['self-control', 'temperance', 'meekness', 'character'],
  },
  // Ephesians & Armor of God
  {
    bookId: 'eph',
    bookName: 'Ephesians',
    chapter: 2,
    verse: 8,
    text: 'For by grace are ye saved through faith; and that not of yourselves: it is the gift of God:',
    keywords: ['grace', 'faith', 'salvation', 'gift', 'works'],
  },
  {
    bookId: 'eph',
    bookName: 'Ephesians',
    chapter: 6,
    verse: 10,
    text: 'Finally, my brethren, be strong in the Lord, and in the power of his might.',
    keywords: ['spiritual warfare', 'strength', 'power', 'might'],
  },
  {
    bookId: 'eph',
    bookName: 'Ephesians',
    chapter: 6,
    verse: 11,
    text: 'Put on the whole armour of God, that ye may be able to stand against the wiles of the devil.',
    keywords: ['armor of god', 'armour', 'protection', 'stand', 'battle'],
  },
  // Philippians & Joy
  {
    bookId: 'php',
    bookName: 'Philippians',
    chapter: 4,
    verse: 6,
    text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.',
    keywords: ['anxiety', 'prayer', 'worry', 'thanksgiving', 'peace'],
  },
  {
    bookId: 'php',
    bookName: 'Philippians',
    chapter: 4,
    verse: 7,
    text: 'And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.',
    keywords: ['peace', 'heart', 'mind', 'guard', 'protection'],
  },
  {
    bookId: 'php',
    bookName: 'Philippians',
    chapter: 4,
    verse: 13,
    text: 'I can do all things through Christ which strengtheneth me.',
    keywords: ['strength', 'perseverance', 'ability', 'courage', 'victory'],
  },
  // James & Revelation
  {
    bookId: 'jam',
    bookName: 'James',
    chapter: 1,
    verse: 5,
    text: 'If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.',
    keywords: ['wisdom', 'ask', 'prayer', 'guidance', 'decision'],
  },
  {
    bookId: '1pe',
    bookName: '1 Peter',
    chapter: 5,
    verse: 7,
    text: 'Casting all your care upon him; for he careth for you.',
    keywords: ['care', 'anxiety', 'burden', 'concern', 'comfort'],
  },
  {
    bookId: 'rev',
    bookName: 'Revelation',
    chapter: 21,
    verse: 4,
    text: 'And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.',
    keywords: ['hope', 'eternity', 'tears', 'comfort', 'grief', 'restoration'],
  },
];

/**
 * Natural Language Offline Scripture Search & Synthesis
 * Strictly operates offline using local indexed text
 */
export function queryOfflineBible(query: string): {
  matchedVerses: ScriptureVerse[];
  synthesis: string;
  topicTitle: string;
} {
  const q = query.toLowerCase().trim();
  if (!q) {
    return {
      matchedVerses: CORE_OFFLINE_VERSES.slice(0, 5),
      synthesis: 'Select or search for any passage, keyword, or biblical topic to explore offline scripture.',
      topicTitle: 'Scripture Highlights',
    };
  }

  // Tokenize
  const terms = q
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2);

  // Score each verse
  const scored = CORE_OFFLINE_VERSES.map((v) => {
    let score = 0;
    const textLower = v.text.toLowerCase();
    const bookLower = v.bookName.toLowerCase();

    // Check full query inclusion
    if (textLower.includes(q)) score += 20;

    // Check terms
    terms.forEach((term) => {
      if (textLower.includes(term)) score += 5;
      if (bookLower.includes(term)) score += 8;
      if (v.keywords.some((k) => k.includes(term) || term.includes(k))) score += 7;
    });

    return { verse: v, score };
  });

  const matched = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.verse);

  const finalMatches = matched.length > 0 ? matched.slice(0, 6) : CORE_OFFLINE_VERSES.slice(0, 3);

  // Synthesize answer exclusively from the matched verses
  let synthesis = '';
  if (matched.length > 0) {
    const references = finalMatches.map((v) => `${v.bookName} ${v.chapter}:${v.verse}`).join(', ');
    const firstVerse = finalMatches[0];
    synthesis = `Based on offline scripture (${references}):\n\nThe text addresses this directly in ${firstVerse.bookName} ${firstVerse.chapter}:${firstVerse.verse}: "${firstVerse.text}"\n\nKey biblical themes highlighted here include ${firstVerse.keywords.slice(0, 4).join(', ')}, emphasizing guidance, faith, and trust in divine wisdom.`;
  } else {
    synthesis = `No direct keyword match found for "${query}" in the core offline index. Showing foundational passages on wisdom and trust (${finalMatches.map((m) => `${m.bookName} ${m.chapter}:${m.verse}`).join(', ')}).`;
  }

  return {
    matchedVerses: finalMatches,
    synthesis,
    topicTitle: `Topic: ${query}`,
  };
}
