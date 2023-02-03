import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import nunjucks from 'nunjucks';
import livereload from 'livereload';
import connectLiveReload from 'connect-livereload';

dotenv.config();

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});

const app: Express = express();
const port = process.env.PORT;
app.use(express.static('public'));
app.use(connectLiveReload());

nunjucks.configure(['node_modules/govuk-frontend/', 'views'], {
  autoescape: true,
  express: app,
});

app.get('/', (req: Request, res: Response) => {
  res.render('layout.njk', { message: 'instant'});
});

app.get('/home', (req: Request, res: Response) => {
  res.render('index.njk', { layout: 'layout.njk', message: 'Home' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
