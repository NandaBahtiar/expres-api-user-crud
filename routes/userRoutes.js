import express from 'express';
import bcrypt from 'bcrypt'

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const pool = req.db;
        const queryText = 'SELECT * FROM users';
        const result = await pool.query(queryText);
        const users = result.rows;
        if (users.length === 0) {
            return res.status(404).json({ error: 'No users found!' });
        }
        res.json(users);
    }catch (err){
        res.send(err.message);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const pool = req.db;
        const id = req.params.id;
        const queryText = 'SELECT * FROM users where id = $1';
        const result = await pool.query(queryText,[id]);
        if (!result) {
            return res.status(404).json({ error: 'No users found!' });
        }
        res.json(result.rows);
    }catch (err){
        res.send(err.message);
    }
})

router.post('/', async (req, res) => {
    try {
        const pool = req.db;
        const salt = 14;
        const { username, email, password } = req.body;
        const queryText = 'insert into users (username,password,email) VALUES ($1,$3,$2  )'
        const passwordHash = bcrypt.hashSync(password, salt);
        const result = await pool.query(queryText, [username, email, passwordHash]);
        if (!result) {
            return res.status(404).json({ error: 'failed to insert user!' });
        }
        res.send("user created successfully");


    }catch (err){
        res.send(err.message);
    }
})

router.post('/login', async (req, res) => {
    try {
        const pool = req.db;
        const { username, password } = req.body;
        const query_username = 'SELECT * FROM users WHERE username = $1 ';
        const res1 = await pool.query(query_username, [username]);
        if (!res1) {
            return res.status(404).json({ error: 'no users found!' });
        }
        const userPasswprd = res1.rows[0].password;
        const passwordChack = await bcrypt.compare(password,userPasswprd );
        if (!passwordChack) {
            return res.status(404).json({ error: 'username or password not match!' });
        }
        return res.status(200).json(res1.rows[0]);
    }catch (err){
        res.send(err.message);
    }
})
router.delete('/:id', async (req, res) => {
    try {
        const pool = req.db;
        const id = req.params.id;
        const queryText = 'DELETE FROM users WHERE id = $1 ';
        const result = await pool.query(queryText, [id]);
        if (!result) {
            return res.status(404).json({ error: 'no users found!' });
 }
        res.status(200).send("user deleted successfully");
    }catch (err){
        res.send(err.message);
    }
})

router.put('/:id', async (req, res) => {
    try {
        const pool = req.db;
        const id = req.params.id;
        let {email, password} = req.body;
        if (password) {
            password = bcrypt.hashSync(password, 14);
            console.log("password", password);
        }
        const querySelect = 'SELECT * FROM users WHERE id = $1 ';
        const result = await pool.query(querySelect, [id]);
        if (!result) {
            return res.status(404).json({ error: 'no users found!' });
        }

        email = email || result.rows[0].email;
        password = password || result.rows[0].password;
        const date = new Date();

        const queryUpadte = 'update users set email=$1, password = $2, updated_at = $4 where id = $3'
        const result2 = await pool.query(queryUpadte, [email, password,id ,date.toISOString()]);
        if (!result2) {
            return res.status(404).json({ error: 'update user failed!' });
        }
        const options = {
            // Locale Indonesia untuk nama bulan/hari
            locale: 'id-ID',
            // Zona waktu yang diinginkan (misalnya, WIB)
            timeZone: 'Asia/Jakarta',
            // Detail format
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // Menggunakan format 24 jam
        };
        return res.status(200).json(`berhasil di upate pada:${date.toLocaleString(options.locale, options)}`);
    }catch (err){
        res.send(err.message);
    }
})
export default router;



