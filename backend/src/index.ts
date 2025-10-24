import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { vaultRoutes } from './routes/vault';
import { aaveRoutes } from './routes/aave';
import { healthRoutes } from './routes/health';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/health', healthRoutes);
app.use('/vault', vaultRoutes);
app.use('/aave', aaveRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 TinyStable API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});