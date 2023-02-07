import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import nunjucks from 'nunjucks';
import livereload from 'livereload';
import connectLiveReload from 'connect-livereload';
import bodyParser from 'body-parser';
import { Pool } from 'pg';
import methodOverride from 'method-override';

dotenv.config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: 5432, // TS won't allow environment variable to be put here
});

// Check Postgres connection by running empty query

pool.query('', (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Postgres connected to server...');
  }
});

// Add liveReloadServer for hot module replacement (better dev experience)

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});

// Initialise server

const app: Express = express();
const port = process.env.PORT;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static('public'));
app.use(connectLiveReload());

// Configure nunjucks templating engine

nunjucks.configure(['node_modules/govuk-frontend/', 'views'], {
  autoescape: true,
  express: app,
});

// Routes/Endpoints

app.get('/', async (req: Request, res: Response) => {
  res.render('layout.njk');
});

app.get('/data', async (req: Request, res: Response) => {
  try {
    const allJournal = await pool.query('SELECT * FROM journal_entry'); // https://youtu.be/ldYcgPKEZC8?t=1159
    console.log(allJournal.rows);

    res.render('data.njk', {
      layout: 'layout.njk',
      data: allJournal.rows,
    });
  } catch (err: any) {
    console.error(err.message);
  }
});

app.get('/form', async (req: Request, res: Response) => {
  res.render('form.njk', { layout: 'layout.njk' });
});

app.post('/form', async (req: Request, res: Response) => {
  try {
    const { full_name } = req.body;
    const { title } = req.body;
    const { journal_entry } = req.body;
    const newJournal = await pool.query(
      `INSERT INTO journal_entry (full_name, title, journal_entry) VALUES($1,$2,$3)`,
      [full_name, title, journal_entry]
    );
    res.render('form.njk', { layout: 'layout.njk' });
  } catch (err: any) {
    console.error(err.message);
  }
});

app.delete('/form', (req: Request, res: Response) => {
  console.log('Delete request received');
  res.json({"sent": "back"});
});

// Start server and listen for requests

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
