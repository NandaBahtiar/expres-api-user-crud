import express from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();

const SALT_ROUNDS = 14;

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    if (page <= 0 || limit <= 0) {
        return res.status(400).json({ error: 'Page and limit must be positive integers.' });
    }
    const offset = (page - 1) * limit;
    try {
        const pool = req.db;
        const queryText = 'SELECT id, username, email, created_at, updated_at FROM users ORDER BY id LIMIT $1 OFFSET $2';
        const result = await pool.query(queryText, [limit, offset]);
        const users = result.rows;

        if (users.length === 0) {
            return res.status(404).json({ error: 'No users found!' });
        }
        const countQuery = 'SELECT COUNT(*) FROM users';
        const countResult = await pool.query(countQuery);
        const totalItems = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalItems / limit);

        res.json({
            data: users,
            pagination: {
                totalItems,
                totalPages,
                currentPage: page,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (err) {
        console.error("Error fetching all users:", err.message);
        res.status(500).send("Internal Server Error: " + err.message);
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const pool = req.db;
        const queryText = 'SELECT id, username, email, created_at, updated_at FROM users where id = $1';
        const result = await pool.query(queryText, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: `User with ID ${id} not found!` });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Error fetching user ${id}:`, err.message);
        res.status(500).send("Internal Server Error: " + err.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const pool = req.db;
        const { username, email, password } = req.body;

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const queryText = 'INSERT INTO users (username, password, email) VALUES ($1, $2, $3)';

        const result = await pool.query(queryText, [username, passwordHash, email]);

        if (result.rowCount !== 1) {
            return res.status(500).json({ error: 'Failed to insert user!' });
        }

        res.status(201).send("User created successfully");

    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Username or Email already exists.' });
        }
        console.error("Error creating user:", err.message);
        res.status(500).send("Internal Server Error: " + err.message);
    }
});

router.post('/login', async (req, res) => {
    try {
        const pool = req.db;
        const { username, password } = req.body;

        const query_username = 'SELECT id, username, email, password FROM users WHERE username = $1 ';
        const result = await pool.query(query_username, [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        const user = result.rows[0];
        const userPasswordHash = user.password;

        const passwordCheck = await bcrypt.compare(password, userPasswordHash);

        if (!passwordCheck) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        delete user.password;

        return res.status(200).json(user);
    } catch (err) {
        console.error("Error during login:", err.message);
        res.status(500).send("Internal Server Error: " + err.message);
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const pool = req.db;
        const queryText = 'DELETE FROM users WHERE id = $1 ';
        const result = await pool.query(queryText, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: `User with ID ${id} not found!` });
        }
        res.status(200).send(`User with ID ${id} deleted successfully`);
    } catch (err) {
        console.error(`Error deleting user ${id}:`, err.message);
        res.status(500).send("Internal Server Error: " + err.message);
    }
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const pool = req.db;
        let { email, password } = req.body;
        let passwordHash = password;

        const querySelect = 'SELECT id, email, password FROM users WHERE id = $1 ';
        const result = await pool.query(querySelect, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: `User with ID ${id} not found!` });
        }

        const existingUser = result.rows[0];

        if (password) {
            passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        }

        const finalEmail = email || existingUser.email;
        const finalPasswordHash = passwordHash || existingUser.password;

        const date = new Date();
        const updatedAt = date.toISOString();

        const queryUpdate = 'UPDATE users SET email=$1, password = $2, updated_at = $4 WHERE id = $3';
        const result2 = await pool.query(queryUpdate, [finalEmail, finalPasswordHash, id, updatedAt]);

        if (result2.rowCount === 0) {
            return res.status(500).json({ error: 'Update user failed!' });
        }

        const options = {
            locale: 'en-US',
            timeZone: 'Asia/Jakarta',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };

        return res.status(200).json({
            message: `User successfully updated on: ${date.toLocaleString(options.locale, options)}`
        });

    } catch (err) {
        console.error(`Error updating user ${id}:`, err.message);
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Email already exists for another user.' });
        }
        res.status(500).send("Internal Server Error: " + err.message);
    }
});

export default router;