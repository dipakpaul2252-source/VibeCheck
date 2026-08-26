import type { BrainrotLevel, TranslationDirection, SubcultureType, TranslationResult, SlangTerm } from '../types';
import { SLANG_DICTIONARY } from '../data/slangDictionary';
import { SUBCULTURES } from '../data/subcultures';

// Semantic replacement mappings: Corporate/Formal -> Gen Z Intensity Lexicon
const CORPORATE_TO_SLANG_MAP: Record<string, Record<BrainrotLevel, string>> = {
  'good': { 
    1: 'valid', 
    2: 'fire', 
    3: 'hits different', 
    4: 'peak fiction', 
    5: 'skibidi sigma tier'
  },
  'great': { 
    1: 'clean', 
    2: 'insane', 
    3: 'pure aura', 
    4: 'absolute cinema', 
    5: 'level 10 gyatt tier' 
  },
  'bad': { 
    1: 'mid', 
    2: 'an L', 
    3: 'cooked', 
    4: 'crimson flag', 
    5: 'in Ohio without rizz' 
  },
  'fail': { 
    1: 'take an L', 
    2: 'flop', 
    3: 'get cooked', 
    4: 'suffer fatal copium overdose', 
    5: 'get fanum taxed in Ohio' 
  },
  'failed': { 
    1: 'took an L', 
    2: 'flopped', 
    3: 'got cooked', 
    4: 'crumbled under the mog', 
    5: 'got banished to Ohio' 
  },
  'focus': { 
    1: 'concentrate', 
    2: 'lock in', 
    3: 'lock in and farm aura', 
    4: 'engage the mewing grindset', 
    5: 'hit the skibidi hyperfocus' 
  },
  'tired': { 
    1: 'drained', 
    2: 'exhausted', 
    3: 'cooked fr', 
    4: 'living on negative aura', 
    5: 'subatomic energy levels in Ohio' 
  },
  'angry': { 
    1: 'annoyed', 
    2: 'mad', 
    3: 'crashing out', 
    4: 'unleashing fatal crashout energy', 
    5: 'hyper-skibidi rage mode' 
  },
  'talk': { 
    1: 'chat', 
    2: 'speak', 
    3: 'yap', 
    4: 'spit yapology', 
    5: 'deliver infinite yap session' 
  },
  'talking': { 
    1: 'chatting', 
    2: 'speaking', 
    3: 'yapping', 
    4: 'dropping PhD level yap', 
    5: 'yapping in the skibidi toilet' 
  },
  'embarrassed': { 
    1: 'awkward', 
    2: 'cringe', 
    3: 'lost -1000 aura', 
    4: 'caught in 4K', 
    5: 'lost all rizz and got fanum taxed' 
  },
  'impressive': { 
    1: 'neat', 
    2: 'tough', 
    3: 'main character behavior', 
    4: 'mogged the room', 
    5: 'skibidi rizzler level 100' 
  },
  'strategy': { 
    1: 'plan', 
    2: 'game plan', 
    3: 'aura blueprint', 
    4: 'looksmaxxing playbook', 
    5: 'sigma Ohio domination strategy' 
  },
  'deliverables': { 
    1: 'tasks', 
    2: 'drops', 
    3: 'work to ship', 
    4: 'sigma deliverables', 
    5: 'fanum-proof deliverables' 
  },
  'meeting': { 
    1: 'sync', 
    2: 'huddle', 
    3: 'yap session', 
    4: 'mewing contest', 
    5: 'Ohio boardroom summit' 
  },
  'understand': { 
    1: 'get it', 
    2: 'copy that', 
    3: 'hear you loud and clear', 
    4: 'locked into your frequency', 
    5: 'vibing with the skibidi vision' 
  },
  'truth': { 
    1: 'facts', 
    2: 'no cap', 
    3: 'straight no cap fr', 
    4: 'pure unfiltered reality', 
    5: 'gospel from the sigma realm' 
  }
};

// Reverse Dictionary: Slang -> Corporate/Professional English
const SLANG_TO_CORPORATE_MAP: Record<string, string> = {
  'crashout': 'exhibited acute behavioral agitation',
  'crashed out': 'experienced an acute breakdown of professional composure',
  'aura': 'professional social capital and peer respect',
  'aura points': 'reputational standing',
  'cooked': 'experiencing insurmountable systemic challenges',
  'lock in': 'apply dedicated cognitive focus toward key deliverables',
  'locked in': 'achieved optimal workflow concentration',
  'let him cook': 'grant the stakeholder latitude to execute their initiative',
  'yap': 'deliver an unnecessarily verbose exposition',
  'yapping': 'providing protracted qualitative feedback',
  'delulu': 'harboring unrealistically optimistic forecasts',
  'rent-free': 'occupying ongoing cognitive bandwidth without tangible return',
  'main character': 'demonstrating excessive unilateral agency in collaborative spaces',
  'side-eye': 'manifesting silent professional skepticism',
  'caught in 4k': 'documented with indisputable empirical evidence',
  'no cap': 'with complete transparency and veracity',
  'bet': 'affirmative, we shall execute accordingly',
  'hits different': 'delivers exceptional qualitative impact',
  'mogging': 'demonstrating overwhelming competitive superiority',
  'mewing': 'maintaining strategic silence during discussions',
  'looksmaxxing': 'optimizing aesthetic presentation for external stakeholders',
  'copium': 'rationalizing sub-optimal outcomes through optimistic bias',
  'skibidi': 'atypical operational variable',
  'fanum tax': 'informal internal resource reallocation',
  'sigma': 'self-directed individual contributor',
  'rizz': 'exceptional stakeholder persuasive aptitude',
  'doggo': 'canine companion (informal)',
  'adulting': 'managing basic operational and domestic responsibilities',
  'on fleek': 'aligned with optimal quality standards',
  'epic fail': 'critical operational failure'
};

/**
 * Calculates real-time Cringe Radar score (0 to 100)
 */
export function calculateCringeScore(text: string): number {
  const lower = text.toLowerCase();
  let totalScore = 15; // baseline
  let matches = 0;
  for (const term of SLANG_DICTIONARY) {
    const regex = new RegExp(`\\b${term.term}\\b`, 'i');
    if (regex.test(lower)) {
      totalScore += term.cringeScore;
      matches++;
    }
  }
  if (matches === 0) return 20;
  return Math.min(100, Math.round(totalScore / (matches + 1)));
}

/**
 * Extracts recognized slang terms from input text
 */
export function extractDetectedTerms(text: string): SlangTerm[] {
  const lower = text.toLowerCase();
  return SLANG_DICTIONARY.filter(item => {
    const regex = new RegExp(`\\b${item.term}\\b`, 'i');
    return regex.test(lower);
  });
}

/**
 * Generates etymology and irony breakdown
 */
export function generateWhyItsFunny(detectedTerms: SlangTerm[], intensity: BrainrotLevel) {
  if (detectedTerms.length === 0) {
    return {
      breakdown: 'This sentence utilizes straightforward colloquial phrasing with minimal layered cultural irony.',
      ironyLayer: 'Literal / Low irony.',
      safetyRating: 'Safe for Work' as const
    };
  }
  const primary = detectedTerms[0];
  let safety: 'Safe for Work' | 'Casual Only' | 'Instant HR Meeting' = 'Casual Only';
  if (primary.cringeScore > 80 || intensity === 5) {
    safety = 'Instant HR Meeting';
  } else if (primary.cringeScore < 25 && intensity <= 2) {
    safety = 'Safe for Work';
  }
  return {
    breakdown: `Key anchor term "${primary.term}" originated from ${primary.origin}. Meaning: "${primary.meaning}".`,
    ironyLayer: `Level ${intensity} Hyperbolic irony applied through ${primary.subculture} subculture framing.`,
    safetyRating: safety
  };
}

/**
 * Forward translation: Corporate -> Gen Z (Levels 1 to 5)
 */
function translateToGenZ(text: string, level: BrainrotLevel, subculture: SubcultureType): string {
  let result = text;
  const config = SUBCULTURES[subculture] || SUBCULTURES.universal;
  
  // 1. Semantic word substitution
  for (const [key, levelMap] of Object.entries(CORPORATE_TO_SLANG_MAP)) {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    if (regex.test(result)) {
      result = result.replace(regex, levelMap[level]);
    }
  }
  
  // 2. Structural subculture affixes depending on intensity
  if (level === 1) {
    result = `Lowkey, ${result.charAt(0).toLowerCase() + result.slice(1)} fr.`;
  } else if (level === 2) {
    const prefix = config.affixes.prefixes[0];
    result = `${prefix.charAt(0).toUpperCase() + prefix.slice(1)} ${result.toLowerCase()}, bet.`;
  } else if (level === 3) {
    result = `Bro, we need to lock in: ${result.toLowerCase()} no cap fr.`;
  } else if (level === 4) {
    const suffix = config.affixes.suffixes[0];
    result = `Real talk, ${result.toLowerCase()} while maintaining peak mewing streak, ${suffix}.`;
  } else if (level === 5) {
    result = `WHAT IN THE SKIBIDI OHIO: ${result.toLowerCase()} got hit by the fanum tax in Ohio with negative infinity aura on god! 💀😭`;
  }
  return result;
}

/**
 * Reverse translation: Gen Z Slang -> Corporate / Plain English
 */
function translateToCorporate(text: string): string {
  let result = text;
  for (const [slang, corporate] of Object.entries(SLANG_TO_CORPORATE_MAP)) {
    const regex = new RegExp(`\\b${slang}\\b`, 'giu');
    result = result.replace(regex, corporate);
  }
  // Clean trailing punctuation or meme artifacts
  result = result.replace(/[💀😭✨⚡]/gu, '').trim();
  return result.charAt(0).toUpperCase() + result.slice(1) + '.';
}

/**
 * Master Translation Dispatcher
 */
export function translateText(
  text: string,
  intensity: BrainrotLevel = 3,
  direction: TranslationDirection = 'to_genz',
  subculture: SubcultureType = 'universal'
): TranslationResult {
  const translated = direction === 'to_genz'
    ? translateToGenZ(text, intensity, subculture)
    : translateToCorporate(text);
  const detected = extractDetectedTerms(direction === 'to_genz' ? translated : text);
  const cringe = calculateCringeScore(direction === 'to_genz' ? translated : text);
  const whyItsFunny = generateWhyItsFunny(detected, intensity);
  return {
    originalText: text,
    translatedText: translated,
    intensity,
    direction,
    cringeScore: cringe,
    detectedTerms: detected,
    timestamp: Date.now(),
    whyItsFunny
  };
}
