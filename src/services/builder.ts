import { exec } from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';
import { util } from 'util';
import { SUPPORTED_LANGUAGES } from '../config/languages';
import { fixCodeWithAI } from './aiAgent';

const execPromise = util.promisify(exec);

export async function buildWithAutoFix(
  langKey: string,
  projectPath: string,
  maxRetries = 3
): Promise<boolean> {
  const config = SUPPORTED_LANGUAGES[langKey];
  if (!config) throw new Error(`Lenguaje ${langKey} no soportado.`);

  const sourcePath = path.join(projectPath, config.sourceFile);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`\n[Intento ${attempt}/${maxRetries}] Compilando en lenguaje: ${langKey}...`);

    // Comando para ejecutar el contenedor montando la carpeta del proyecto
    const dockerCmd = `docker run --rm -v "${projectPath}:/usr/src/app" -w /usr/src/app ${config.image} ${config.buildCmd}`;

    try {
      await execPromise(dockerCmd);
      console.log(`✔ Compilación exitosa. Binario generado en workspace.`);
      return true;
    } catch (error: any) {
      const stderr = error.stderr || error.message;
      console.error(`✖ Error de compilación detectado:\n${stderr}`);

      if (attempt === maxRetries) {
        console.error('Se alcanzó el límite de reintentos sin éxito.');
        return false;
      }

      console.log('Enviando código y error a la IA para autocorrección...');
      const currentCode = await fs.readFile(sourcePath, 'utf-8');
      const fixedCode = await fixCodeWithAI(langKey, currentCode, stderr);

      await fs.writeFile(sourcePath, fixedCode, 'utf-8');
      console.log(`➔ Código corregido y actualizado en ${config.sourceFile}. Reintentando...`);
    }
  }

  return false;
}
