import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function fixCodeWithAI(
  language: string,
  sourceCode: string,
  compilerError: string
): Promise<string> {
  const prompt = `
  Eres un compilador automático e ingeniero experto en ${language}.
  El código falló al compilar. Devuelve ÚNICAMENTE el código fuente completamente corregido.
  NO agregues bloques de markdown (\`\`\`), ni saludos, ni explicaciones.

  LOG DE ERROR DEL COMPILADOR:
  ${compilerError}

  CÓDIGO CON ERROR:
  ${sourceCode}
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
  });

  return response.choices[0].message.content?.trim() || sourceCode;
}
