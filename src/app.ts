import express from "express";
import compression from "compression";  // compresses requests
import expressValidator from "express-validator";
import bodyParser from "body-parser";
import { Request, Response } from "express";

// Create Express server
const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

app.post('/import/json/raw/:timeseriesId', (req: Request, res: Response) => {
  console.log('timeseriesId: ', req.params.timeseriesId);
  const data = req.body;
  console.log('data: ', data);
  res.send(req.params.timeseriesId);
});

app.get('/import/public/hc', (req: Request, res: Response) => {
  console.log('Import Health Check 1');
  res.send('OK');
});

export default app;
