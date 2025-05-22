import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config/config';
import imageRoutes from './routes/imageRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', imageRoutes);

app.listen(config.port, () => {
    console.log(`서버가 http://localhost:${config.port} 에서 실행 중입니다.`);
});