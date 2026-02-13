const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});


pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error crítico conectando a Postgres:', err.stack);
  } else {
    console.log('✅ Conexión a Postgres exitosa en:', res.rows[0].now);
  }
});


app.get('/api/precios', async (req, res) => {
  try {
    const queryText = 'SELECT * FROM precios_colegios ORDER BY id DESC'; 
    const result = await pool.query(queryText);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).json({ 
      error: 'Error al obtener datos de la base de datos',
      details: err.message 
    });
  }
});


app.get('/', (req, res) => {
  res.send('🚀 API de Precios Achahui funcionando correctamente');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en el puerto ${PORT}`);
});