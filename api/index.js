import Express from 'express';
import http from 'http';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import fs from 'fs';

// API routes
import routes from './routes.js';

const webpack = require('webpack');
const webpackConfig = require('../webpack/webpack.config.js');
const compiler = webpack(webpackConfig);

const app = new Express();
const server = new http.Server(app);
const logPath = __dirname + '/../logs/api.log';
const accessLogStream = fs.createWriteStream(logPath, { flags: 'a' });

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true, publicPath: webpackConfig.output.publicPath,
}));

app.use(require('webpack-hot-middleware')(compiler, {
  log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000,
}));

app.set('trust proxy', 1);
app.use(cookieParser());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use('/api', function(){
  next();
}, routes);

// Static directory for express
app.use('/static', Express.static(__dirname + '/../static/'));
app.use('/dist', Express.static(__dirname + '/../dist/'));


server.listen(3000, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Api is listening on http://%s:%s', host, port);
});
