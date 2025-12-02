import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import imageRoutes from './routes/imageRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/images', imageRoutes);

app.get('/', (req, res) => {
    res.send('Image Cleaner API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
