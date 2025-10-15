import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import initRoutes from './src/routes/routes.mjs';
import { initWebSocket } from './src/routes/websocket.mjs';

// init express
const app = express();
const port = 3001;

// if we need to use images from the public folder
// app.use(express.static('public'));

// middleware
app.use(express.json()); // it converts json body to req.body
app.use(morgan('dev')); // it shows log for http requests

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true  // to make cors working with credentials
};

app.use(cors(corsOptions)); // to handle cross origin requests
initRoutes(app);            // init all routes inside the routes module

if (process.env.NODE_ENV !== 'test') {
  initWebSocket(app, port);
}

export { app };