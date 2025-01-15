import express, { Express, Request, Response } from 'express';
import { appConfig } from './config';
import { AssetPrice } from './services/AssetPrice';
import { EVMNetwork } from './model/models';
import { GasEstimation } from './services/GasEstimation';
import { GasCalculator } from './services/GasCalculator';

const app: Express = express();
const port = appConfig.core.port;

const gasCalculator = new GasCalculator()

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.get('/computeAirdrop', async (req: Request, res: Response) => {
  const gasEstimation = await gasCalculator.compute()
  console.log(gasEstimation);
  res.status(200).send(gasEstimation);
});