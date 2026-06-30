import { GoogleGenAI, Type, Modality } from "@google/genai";
import { DictionaryEntry, QuizQuestion } from '../types';
import { DailyWord } from '../types/dailyWord';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const dictionarySchema = {
  type: Type.OBJECT,
  properties: {
    word: {
      type: Type.STRING,
      description: "The word that was searched for, in its original script.",
    },
    language: {
      type: Type.STRING,
      description: "The language of the word, e.g., 'English', 'Tamil', 'Hindi'.",
    },
    partOfSpeech: {
      type: Type.STRING,
      description: "The part of speech of the word (e.g., Noun, Verb, Adjective).",
    },
    pronunciation: {
        type: Type.STRING,
        description: "The phonetic pronunciation of the word, preferably using the International Phonetic Alphabet (IPA).",
    },
    meaning: {
      type: Type.STRING,
      description: "A concise definition or meaning of the word.",
    },
    explanation: {
      type: Type.STRING,
      description: "A detailed explanation of the word's meaning, usage, and context, possibly with an example sentence.",
    },
  },
  required: ["word", "language", "partOfSpeech", "pronunciation", "meaning", "explanation"],
};

export const fetchWordDefinition = async (word: string, language: string): Promise<DictionaryEntry> => {
  try {
    const prompt = `You are an expert multilingual linguist. Analyze the following word: "${word}" in the ${language} language. Provide a detailed dictionary entry in JSON format, including a phonetic pronunciation guide (e.g., using IPA). The explanation should be comprehensive and easy to understand.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: dictionarySchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);

    return parsedJson as DictionaryEntry;

  } catch (error) {
    console.error("Error fetching word definition from Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get definition. Gemini API error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching the definition.");
  }
};

const quizQuestionSchema = {
    type: Type.OBJECT,
    properties: {
        word: { type: Type.STRING, description: 'The vocabulary word.' },
        definition: { type: Type.STRING, description: 'The definition of the word, to be used as the question.' },
        options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'An array of 4 multiple-choice options. One is the correct word, and the other three are plausible distractors.'
        },
        correctAnswer: { type: Type.STRING, description: 'The correct word from the options array.' }
    },
    required: ['word', 'definition', 'options', 'correctAnswer']
};

const quizSchema = {
    type: Type.OBJECT,
    properties: {
        questions: {
            type: Type.ARRAY,
            items: quizQuestionSchema
        }
    },
    required: ["questions"],
};


export const generateQuiz = async (language: string, count: number): Promise<QuizQuestion[]> => {
    try {
        const prompt = `You are an expert language teacher. Generate a vocabulary quiz with ${count} questions for the ${language} language. Provide common but non-trivial words. For each question, provide a definition to be used as the question, four multiple-choice options (the word itself and three plausible distractors), and identify the correct word. The distractors should be from the same language. Format the output as JSON.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        if (!parsedJson.questions || !Array.isArray(parsedJson.questions)) {
            throw new Error("Invalid quiz data format received from API.");
        }
        
        return parsedJson.questions as QuizQuestion[];

    } catch (error) {
        console.error("Error generating quiz from Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate quiz. Gemini API error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the quiz.");
    }
};

export const generateDailyWord = async (language: string): Promise<DailyWord> => {
    try {
        // Define the expected shape of our word data
        const dailyWordSchema = {
            type: Type.OBJECT,
            properties: {
                word: { 
                    type: Type.STRING, 
                    description: "The word in the target language (no translations)" 
                },
                partOfSpeech: { 
                    type: Type.STRING, 
                    description: "The grammatical category (noun, verb, adjective, adverb, etc.)" 
                },
                definition: { 
                    type: Type.STRING, 
                    description: "A clear, concise definition in English, one line only" 
                },
                example: { 
                    type: Type.STRING, 
                    description: "A complete sentence using the word naturally in the target language" 
                }
            },
            required: ["word", "partOfSpeech", "definition", "example"]
        };

        const prompt = `Act as a language teaching expert. Generate ONE word in ${language} following these strict requirements:

1. Choose a word that is:
   - Commonly used in ${language}
   - Suitable for intermediate learners
   - Practical for everyday conversations

2. Provide the information in this exact JSON format:
{
    "word": "(the word in ${language})",
    "partOfSpeech": "(grammatical category)",
    "definition": "(clear, concise English definition)",
    "example": "(natural example sentence in ${language})"
}

3. Important rules:
   - The word must be in ${language} script/characters
   - Definition must be in English, one line only
   - Example must be in ${language}
   - Example must be a complete, natural sentence
   - NO additional text or explanations outside the JSON

Return ONLY the JSON object, nothing else.`;

        const result = await ai.models.generateContent({
            model: "gemini-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: dailyWordSchema,
                temperature: 0.2, // Lower temperature for more consistent output
                maxOutputTokens: 200
            }
        });

        const text = result.text.trim();
        let parsedWord;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: dailyWordSchema,
            },
        });

        try {
            parsedWord = JSON.parse(text);
        } catch (parseError) {
            console.error('Failed to parse Gemini response:', text);
            throw new Error('Invalid response format from Gemini API');
        }

        // Validate the required fields
        const requiredFields = ['word', 'partOfSpeech', 'definition', 'example'];
        for (const field of requiredFields) {
            if (!parsedWord[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        return {
            ...parsedWord,
            language,
            date: new Date().toISOString(),
            dayCount: Math.floor(Date.now() / (1000 * 60 * 60 * 24)),
        };

    } catch (error) {
        console.error("Error generating daily word from Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate daily word: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the daily word.");
    }
};

export const generateSpeech = async (text: string): Promise<string> => {
    try {
        if (!text || text.trim() === '') {
            // Avoid calling API for empty strings
            return '';
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: { parts: [{ text: text }] },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        
        const audioPart = response.candidates?.[0]?.content?.parts.find(
          (part) => !!part.inlineData && part.inlineData.mimeType.startsWith('audio/')
        );
        const base64Audio = audioPart?.inlineData?.data;

        if (!base64Audio) {
            console.error("No audio data found in API response. Response:", JSON.stringify(response, null, 2));
            throw new Error("No audio data received from API.");
        }
        return base64Audio;
    } catch (error) {
        console.error("Error generating speech from Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate speech. Gemini API error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating speech.");
    }
};