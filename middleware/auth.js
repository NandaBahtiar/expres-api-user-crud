import jwt from 'jsonwebtoken';
const authenticateToken = (req, res, next) => {
    // 1. Ekstrak token dari header Authorization
    // Format: Authorization: Bearer <TOKEN>
    const authHeader = req.headers['authorization'];

    // Periksa apakah header ada dan berformat Bearer
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        // Token tidak disediakan
        return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

    // 2. Verifikasi token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            // Token tidak valid atau kedaluwarsa
            return res.status(403).json({ message: 'Token tidak valid atau kedaluwarsa.' });
        }

        // 3. Token valid, tambahkan data pengguna ke objek req
        req.user = decoded; // 'decoded' berisi payload (user id, email, dll.)

        // Lanjutkan ke route handler berikutnya
        next();
    });
};

export default authenticateToken;