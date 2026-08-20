import * as path from 'path';
import { buildWithAutoFix } from './services/builder';

async function main() {
  // Ruta absoluta a la carpeta con el código de prueba
  const targetProject = path.join(__dirname, '../workspace/test_cpp');
  const language = 'cpp';

  console.log('Iniciando proceso de compilación y despliegue...');
  const success = await buildWithAutoFix(language, targetProject);

  if (success) {
    console.log('\n🎉 ¡Proceso finalizado con éxito! El ejecutable nativo está listo.');
  } else {
    console.log('\n❌ El proceso falló tras agotar los reintentos.');
  }
}

main();
