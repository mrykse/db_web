const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3001;

// Configuration de la connexion à la base de données PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'essai1',
    password: 'root',
    port: 5432,
});

// Middleware pour résoudre le problème de CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Endpoint pour récupérer les informations des tables
app.get('/api/tables', (req, res) => {
    pool.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'', (error, result) => {
        if (error) {
            console.error('Erreur lors de la récupération des tables :', error);
            res.status(500).json({ error: 'Erreur lors de la récupération des tables' });
        } else {
            const tables = result.rows.map(async (row) => {
                const table = row.table_name;
                const attributesResult = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${table}'`);
                const attributes = attributesResult.rows.map(attributeRow => ({
                    name: attributeRow.column_name,
                    type: attributeRow.data_type,
                }));
                return { name: table, attributes };
            });

            Promise.all(tables).then((completedTables) => {
                res.json({ tables: completedTables });
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Serveur API en cours d'exécution sur le port ${port}`);
});
