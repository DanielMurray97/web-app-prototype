import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import nunjucks from 'nunjucks';
import livereload from 'livereload';
import connectLiveReload from 'connect-livereload';
import bodyParser from 'body-parser';
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

dotenv.config();

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});

const app: Express = express();
const port = process.env.PORT;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(connectLiveReload());

nunjucks.configure(['node_modules/govuk-frontend/', 'views'], {
  autoescape: true,
  express: app,
});

app.get('/', async (req: Request, res: Response) => {
  try {
    const allJournal = await pool.query("SELECT * FROM journal_entry");
    console.log(allJournal);

    res.render('data.njk', {
      layout: 'layout.njk',
      rows: allJournal.rows[0].full_name,
    });
  } catch (err: any) {
    console.error(err.message)
  }

});


app.get('/data', (req: Request, res: Response) => {
  res.render('data.njk', {
    layout: 'layout.njk',
    message: 'I am Data, sent from server to /data endpoint',
  });
});

app.get('/form', (req: Request, res: Response) => {
  res.render('form.njk', {
    layout: 'layout.njk',
    message: 'I am Form, sent from server to /form endpoint',
  });
});

app.post('/', (req: Request, res: Response) => {
  console.log(req.body);
  res.send(req.body);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
