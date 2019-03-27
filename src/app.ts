import { Request, Response } from "express";

import express from "express";
import compression from "compression";  // compresses requests
import expressValidator from "express-validator";
import bodyParser from "body-parser";
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { MetadataIds, metadataIdsDecoder, ValueType } from './types';

const adapterMetadata = 'http://adapter-metadata.default.svc.cluster.local';
const clientMetadata: AxiosInstance = axios.create({
  baseURL: adapterMetadata,
  timeout: 3000,
  headers: { 'Content-Type': 'application/json' },
});
const adapterScalar = 'http://adapter-scalar.default.svc.cluster.local';
const clientScalar: AxiosInstance = axios.create({
  baseURL: adapterScalar,
  timeout: 3000,
  headers: { 'Content-Type': 'application/json' },
});

// Create Express server
const app = express();

app.use(compression());
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }));
app.use(expressValidator());

app.post('/import/json/raw/:timeseriesId', async (req: Request, res: Response) => {
  try {
    const timeseriesId: string = req.params.timeseriesId;
    console.log('timeseriesId: ', req.params.timeseriesId);
    const data: JSON = req.body;
    console.log('data: ', Array.isArray(data) && [...data.slice(0, 3), '...', data.slice(-3)]);
    const resp: AxiosResponse = await clientMetadata.get(`/timeseries/${timeseriesId}`);
    const metadataIds: MetadataIds = metadataIdsDecoder.runWithException(resp.data);
    if (metadataIds.valueType === ValueType.Scalar) {
      const result: AxiosResponse = await clientScalar.post(`timeseries/${timeseriesId}`, data);
      res.status(result.status).send(result.data);
    } else {
      res.status(400).send(`Unknown Value Type: ${metadataIds.valueType}`);
    }
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

app.get('/import/json/raw/public/hc', (req: Request, res: Response) => {
  console.log('Import Health Check 1');
  res.send('OK');
});

export default app;
