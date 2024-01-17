import express from 'express';
import multer from 'multer';
import path from 'path';
import cors from 'cors';

const app = express();
const port = 5000;

app.use(cors());

const contentUploadDirs = {
    series: '/var/www/html/mimexico/videos/series',
    movies: '/var/www/html/mimexico/videos/movies',
    documentaries: '/var/www/html/mimexico/videos/documentaries',
    episodes: '/var/www/html/mimexico/videos/episodes',
    specialSeries: '/var/www/html/mimexico/videos/specialSeries',
    specials: '/var/www/html/mimexico/videos/specials',
    // Agrega más rutas según tus necesidades
};

const storage = (destination) => multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, destination);
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    },
});

const uploadMiddleware = (destination) => multer({ storage: storage(destination) }).single('video');

app.post('/upload/:contentType', (req, res) => {
    const contentType = req.params.contentType;

    if (!contentUploadDirs[contentType]) {
        return res.status(400).json({ success: false, error: 'Tipo de contenido no válido' });
    }

    const upload = uploadMiddleware(contentUploadDirs[contentType]);

    upload(req, res, (err) => {
        if (err) {
            console.error('Error al procesar la carga del archivo:', err.message);
            return res.status(500).json({ success: false, error: 'Error interno al procesar la carga del archivo' });
        }

        const videoPath  = req.file.originalname;

        // Devolver la ruta del archivo en la respuesta JSON
        res.json({ success: true, videoPath  });
        console.log(videoPath );
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
