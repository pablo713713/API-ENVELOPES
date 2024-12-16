import { createPool } from 'mysql2/promise';

export const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: 'estudiante',
    database: 'budget_db',
    port: 3306
});