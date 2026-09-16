import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './src/db/migrations',
    schema: './src/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgresql://postgres.grepgkzgahzzzriaoqwe:Min@st1rith@aws-1-eu-west-1.pooler.supabase.com:5432/postgres',
        ssl: {
            rejectUnauthorized: false, // Ensures SSL connection is established smoothly with Supabase
        },
    },
    schemaFilter: ["public"],
});
