import 'dotenv/config.js';
import express from 'express';
import pg from 'pg';
const app = express();

const PORT = process.env.PORT || 3000;
//---import route---
import userRoutes from "./routes/userRoutes.js";
//------
//---sweger---
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json' with { type: 'json' };
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//------
//---connect Database---
const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
})
pool.connect().then(() => {
    console.log('Connected to database...');
}).catch(err => console.log("err: "+err));

app.use(express.json())

// Middleware to attach pool to req
app.use((req, res, next) => {
    req.db = pool;
    next();
});
//------
//---route---

app.use('/users', userRoutes);


//------
const date = new Date();

console.log(date.toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour12: false, // Menggunakan format 24 jam
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
}));
console.log(date.toDateString())
console.log(date.toISOString())
app.use((err, req, res, next) => {
    res.status(500).send("err: " + err.message);

})

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}/api-docs/`);
})