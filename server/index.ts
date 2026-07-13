import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import authRouter from './routes/auth';
import analyticsRouter from './routes/analytics';
import categoriesRouter from './routes/categories';

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/categories', categoriesRouter);

app.listen(PORT, () => console.log(`🚀 Seoul Spice API → http://localhost:${PORT}`));

export default app;
