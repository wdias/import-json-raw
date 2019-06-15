import { Request, Response } from "express";

import crypto from 'crypto';
import express from "express";
import compression from "compression";  // compresses requests
import expressValidator from "express-validator";
import bodyParser from "body-parser";
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { MetadataIds, metadataIdsDecoder, ValueType, Status, DataPoint, dataPointsDecoder } from './types';
import { REQUEST_STATUS } from './config';

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
const adapterVector = 'http://adapter-vector.default.svc.cluster.local';
const clientVector: AxiosInstance = axios.create({
  baseURL: adapterVector,
  timeout: 3000,
  headers: { 'Content-Type': 'application/json' },
});
const adapterStatus = 'http://adapter-status.default.svc.cluster.local';
const clientStatus: AxiosInstance = axios.create({
  baseURL: adapterStatus,
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
    const dataPoints: DataPoint[] = dataPointsDecoder.runWithException(data);
    const resp: AxiosResponse = await clientMetadata.get(`/timeseries/${timeseriesId}`);
    const metadataIds: MetadataIds = metadataIdsDecoder.runWithException(resp.data);
    const requestId: string = crypto.randomBytes(16).toString('hex');
    if (metadataIds.valueType === ValueType.Scalar || metadataIds.valueType === ValueType.Vector) {
      // TODO: select least date as start & highers as end times
      if(dataPoints.length < 1) {
        return res.status(400).send('Data not found');
      }
      const startTime: string | number = dataPoints[0].time;
      const endTime: string | number = dataPoints[dataPoints.length - 1].time;
      const q: string = `?requestId=${requestId}&start=${startTime}&end=${endTime}`;
      const result: AxiosResponse = (metadataIds.valueType === ValueType.Scalar) ?
        await clientScalar.post(`timeseries/${timeseriesId}${q}`, dataPoints) :
        await clientVector.post(`timeseries/${timeseriesId}${q}`, dataPoints);
      if (REQUEST_STATUS) {
        const statusData: Status = {
          requestId: requestId,
          service: 'Import',
          type: metadataIds.valueType,
        };
        try {
          const reqStatus: AxiosResponse = await clientStatus.post(`${timeseriesId}`, statusData);
          // if (reqStatus.status < 400) {}
        } catch (e) {
          console.error('Unable to set Status: ', e.toString());
        }
        result.data['requestId'] = requestId;
      }
      res.status(result.status).send(result.data);
    } else {
      res.status(400).send(`Unknown Value Type: ${metadataIds.valueType}`);
    }
  } catch (e) {
    console.error(e);
    res.status(500).send(e.toString());
  }
});

app.get('/import/json/raw/public/hc', (req: Request, res: Response) => {
  console.log('Import Health Check 1');
  res.send('OK');
});

export default app;
