import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './drizzle/schema/inventory/index.ts',
    out: './drizzle/migration/inventoryDb',
    dialect: 'sqlite',
    driver: 'expo', // <--- very important
    migrations: {
        table: '__drizzle_migrations',
        schema: 'drizzle',
    },
});
