import postgres from 'postgres';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
config();
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
    console.error('DATABASE_URL is not set.');
    process.exit(1);
}
const sql = postgres(dbUrl, { ssl: 'require' });
async function run() {
    try {
        console.log('Running migration...');
        const migrationFile = path.resolve(process.cwd(), 'src/migrations/001_create_active_messages.sql');
        const migrationSql = fs.readFileSync(migrationFile, 'utf8');
        await sql.unsafe(migrationSql);
        console.log('Migration completed successfully.');
    }
    catch (err) {
        console.error('Migration failed:', err);
    }
    finally {
        await sql.end();
    }
}
run();
