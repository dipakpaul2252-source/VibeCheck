import type { BrainrotLevel, TranslationDirection, SubcultureType, TranslationResult, SlangTerm } from '../types';
import { translateText as dictionaryTranslate, extractDetectedTerms } from './translatorEngine';
import { SLANG_DICTIONARY } from '../data/slangDictionary';

interface AITranslationPayload {
  text: string;
  intensity: BrainrotLevel;
  subculture: SubcultureType;
  direction: TranslationDirection;
  communitySlang?: SlangTerm[];
}

function mapDetectedTerms(terms: unknown[], translatedText: string, subculture: SubcultureType): SlangTerm[] {
  if (Array.isArray(terms) && terms.length > 0) {
    return terms.map((t, idx) => {
      const termStr = typeof t === 'string' ? t : (t as any)?.term || String(t);
      const matched = SLANG_DICTIONARY.find(s => s.term.toLowerCase() === termStr.toLowerCase());
      if (matched) return matched;
      return {
        id: `detected-${idx}-${Date.now()}`,
        term: termStr,
        subculture,
        meaning: `Internet vernacular term detected in AI translation.`,
        origin: `Contemporary online discourse`,
        cringeScore: 25,
        lifecycle: 'Peak Viral',
        exampleSentence: translatedText,
        velocityChange: '+85%'
      };
    });
  }
  return extractDetectedTerms(translatedText);
}

export async function requestAITranslation({
  text,
  intensity,
  subculture,
  direction,
  communitySlang = []
}: AITranslationPayload): Promise<TranslationResult> {
  if (!text.trim()) {
    return dictionaryTranslate('', intensity, direction, subculture);
  }

  // 1. Try Vercel Serverless Function / Backend API endpoint
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        intensity,
        subculture,
        direction,
        communitySlang: communitySlang.map(s => ({ term: s.term, meaning: s.meaning, subculture: s.subculture }))
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (!data.fallback && data.translated_text) {
        const detected = mapDetectedTerms(data.detected_terms, data.translated_text, subculture);
        return {
          originalText: text,
          translatedText: data.translated_text,
          intensity,
          direction,
          cringeScore: typeof data.cringe_score === 'number' ? data.cringe_score : 25,
          detectedTerms: detected,
          timestamp: Date.now(),
          whyItsFunny: {
            breakdown: data.why_funny_breakdown || 'AI dynamic cultural synthesis.',
            ironyLayer: data.irony_layer || `Level ${intensity} contextual irony`,
            safetyRating: (data.workplace_safety as any) || 'Casual Only'
          }
        };
      }
    }
  } catch {
    // API endpoint not present or network unavailable; fallback to direct API key or dictionary
  }

  // 2. Try Client-side VITE_OPENAI_API_KEY if configured in .env
  const clientApiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  if (clientApiKey && clientApiKey !== 'mock-openai-key' && clientApiKey.startsWith('sk-')) {
    try {
      const slangContext = communitySlang.map(s => `- "${s.term}": ${s.meaning}`).join('\n');
      const systemPrompt = `You are an elite, cynical, hyper-fluent Gen Z & Brainrot cultural linguist.
Translate the user's text into high-velocity internet vernacular at Brainrot Level ${intensity}/5 using the ${subculture} lens.
${slangContext ? `ACTIVE COMMUNITY SLANG:\n${slangContext}\n` : ''}
TRANSLATION RULES:
1. Level 1 (Casual): Mild slang (lowkey, bet, valid).
2. Level 2 (Social): Mainstream discourse (delulu, side-eye, rent-free).
3. Level 3 (Hyper-Online): Extreme viral slang (lock in, cooked, crashout, aura points).
4. Level 4 (High Irony): Meta-irony (mewing, mogging, copium).
5. Level 5 (Terminal Brainrot): Surreal absurdism (skibidi, fanum tax, ohio rizz, level 10 gyatt).

OUTPUT FORMAT: Strictly return valid JSON:
{
  "translated_text": string,
  "cringe_score": number (0-100),
  "detected_terms": string[],
  "why_funny_breakdown": string,
  "irony_layer": string,
  "workplace_safety": "Safe for Work" | "Casual Only" | "Instant HR Meeting"
}`;

      const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${clientApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Direction: ${direction}. Input: "${text}"` }
          ],
          temperature: 0.7 + (intensity * 0.05)
        })
      });

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        const parsed = JSON.parse(aiData.choices[0].message.content);
        const detected = mapDetectedTerms(parsed.detected_terms, parsed.translated_text, subculture);
        return {
          originalText: text,
          translatedText: parsed.translated_text,
          intensity,
          direction,
          cringeScore: typeof parsed.cringe_score === 'number' ? parsed.cringe_score : 25,
          detectedTerms: detected,
          timestamp: Date.now(),
          whyItsFunny: {
            breakdown: parsed.why_funny_breakdown || 'AI dynamic cultural synthesis.',
            ironyLayer: parsed.irony_layer || `Level ${intensity} contextual irony`,
            safetyRating: (parsed.workplace_safety as any) || 'Casual Only'
          }
        };
      }
    } catch {
      // Fallback on error
    }
  }

  // 3. High-Speed Semantic Dictionary Fallback
  return dictionaryTranslate(text, intensity, direction, subculture);
}

