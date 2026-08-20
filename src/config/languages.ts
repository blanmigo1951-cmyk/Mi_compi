export interface LanguageConfig {
  image: string;
  buildCmd: string;
  sourceFile: string;
  outputBinary: string;
}

export const SUPPORTED_LANGUAGES: Record<string, LanguageConfig> = {
  rust: {
    image: 'rust:latest',
    buildCmd: 'rustc main.rs -o app',
    sourceFile: 'main.rs',
    outputBinary: 'app',
  },
  cpp: {
    image: 'gcc:latest',
    buildCmd: 'g++ main.cpp -o app',
    sourceFile: 'main.cpp',
    outputBinary: 'app',
  },
  go: {
    image: 'golang:latest',
    buildCmd: 'go build -o app main.go',
    sourceFile: 'main.go',
    outputBinary: 'app',
  },
};
