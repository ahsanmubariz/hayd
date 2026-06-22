import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const migrationsDir = join(__dirname, '..', 'src', 'lib', 'db', 'migrations');

async function main() {
  const files = (await readdir(migrationsDir)).filter((f) => f.endsWith('.sql')).sort();
  console.log(`Found ${files.length} migration files`);
  for (const file of files) {
    const sql = await readFile(join(migrationsDir, file), 'utf8');
    console.log(`-- ${file}`);
    console.log(sql);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
