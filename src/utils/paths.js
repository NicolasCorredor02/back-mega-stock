import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Se suben dos niveles: /src/utils → /src 
const rootPath = resolve(__dirname, '..');

export { rootPath };