import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import http from 'http';
dotenv.config();

import authRoutes         from './routes/auth.routes.js';
import shopsRoutes        from './routes/shops.routes.js';
import productsRoutes     from './routes/products.routes.js';
import gamificationRoutes from './routes/gamification.routes.js';
import chatRoutes         from './routes/chat.routes.js';
import reviewsRoutes      from './routes/reviews.routes.js';
import { initWebSocket }  from './services/chat.ws.js';

const app    = express();
const server = http.createServer(app);

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth',         authRoutes);
app.use('/api/shops',        shopsRoutes);
app.use('/api/products',     productsRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/chat',         chatRoutes);
app.use('/api/reviews',      reviewsRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

initWebSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
