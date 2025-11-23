import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'My API',
        description: 'Deskripsi API saya. Ini sudah dilengkapi dengan otentikasi JWT.'
    },
    host: 'localhost:3000',
    // Protokol yang didukung
    schemes: ['http'],

    // Menggunakan format OpenAPI 3.0 untuk definisi keamanan
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT', // Menandakan format token
                description: 'Masukkan token JWT dari endpoint login untuk otentikasi.'
            }
        }
    },

    // Menerapkan skema keamanan 'bearerAuth' secara global ke semua endpoint
    security: [{
        bearerAuth: []
    }]
};

const outputFile = './swagger-output.json';
const routes = ['./index.js']; // Pastikan ini menunjuk ke file root Express Anda

// Menjalankan generator dengan spesifikasi OpenAPI 3.0
swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc).then(() => {
    console.log("Dokumentasi Swagger (swagger-output.json) berhasil dibuat ulang.");
    // Anda bisa menjalankan server setelah file ini dibuat
    // import('./index.js');
});
