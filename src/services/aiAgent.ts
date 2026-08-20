import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

// Inicializamos el cliente apuntando a la infraestructura de Groq
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

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

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile', // Modelo ultra rápido de Groq
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
  });

  return response.choices[0].message.content?.trim() || sourceCode;
}
