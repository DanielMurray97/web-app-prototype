import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import nunjucks from 'nunjucks';
import livereload from 'livereload';
import connectLiveReload from 'connect-livereload';
import bodyParser from 'body-parser';
import { Pool } from 'pg';
import methodOverride from 'method-override';
import JournalDatapoint from './types/JournalDataPoint';
import transformData from './utils/transformData';

dotenv.config();

// Check if running server + postgres in production or development

const environment = process.env.NODE_ENV;
console.log(`Running the server and database in ${environment} environment`);

if (process.env.NODE_ENV === 'development') {
  process.env.POSTGRES_HOST = 'localhost';
}

// Create connection Pool to Postgres

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT as number | undefined, // use assertation to override string | undefinded error. Could set process.env types globally to avoid this
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
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(connectLiveReload());

// Configure nunjucks templating engine

nunjucks.configure(['node_modules/govuk-frontend/', 'views'], {
  autoescape: true,
  express: app,
});

// Routes/Endpoints

// Get routes

app.get('/', async (req: Request, res: Response) => {
  res.render('layout.njk');
});

app.get('/data', async (req: Request, res: Response) => {
  try {
    const allJournal = await pool.query('SELECT * FROM journal_entry'); // https://youtu.be/ldYcgPKEZC8?t=1159
    console.log(allJournal.rows);

    const database_rows: JournalDatapoint[] = allJournal.rows;
    const transformed_data = transformData(database_rows);

    res.render('data.njk', {
      layout: 'layout.njk',
      transformedData: transformed_data,
      rawData: database_rows
    });
  } catch (err: unknown) {
    console.error(err);
  }
});

app.get('/form', async (req: Request, res: Response) => {
  res.render('form.njk', { layout: 'layout.njk' });
});

app.get('/data/:id', async (req: Request, res: Response) => {
  console.log('edit mode');
  try {
    const allJournal = await pool.query('SELECT * FROM journal_entry'); // https://youtu.be/ldYcgPKEZC8?t=1159
    console.log(allJournal.rows);

    const data = transformData(allJournal.rows);

    res.render('edit.njk', {
      layout: 'layout.njk',
      transformedData: data,
      rawData: allJournal.rows,
      id: req.params.id,
    });
  } catch (err: unknown) {
    console.error(err);
  }
});

// Post route

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
  } catch (err: unknown) {
    console.error(err);
    res.redirect('/');
  }
});

// Put route

app.put('/data/edit/:id', async (req: Request, res: Response) => {
  try {
    console.log('Edit request received');
    const id = req.params.id;
    const { full_name } = req.body; // de-structure body param as new variable name using { } syntax in one line
    const { title } = req.body;
    const { journal_entry } = req.body;

    const newJournal = await pool.query(
      `UPDATE journal_entry SET full_name = $1, title=$2, journal_entry=$3 WHERE journal_entry_id=$4;`,
      [full_name, title, journal_entry, id]
    );
    res.redirect('/data');
  } catch (err: unknown) {
    console.error(err);
    res.redirect('/');
  }
});

// Delete route

app.delete('/data/:id', async (req: Request, res: Response) => {
  try {
    console.log('Delete request received');
    const journal_entry_id = req.params.id;
    const newJournal = await pool.query(
      `DELETE FROM journal_entry WHERE journal_entry_id = $1`,
      [journal_entry_id]
    );
    res.redirect('/data');
  } catch (err: unknown) {
    console.error(err);
    res.redirect('/');
  }
});

// Have server listen for requests on specified port

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});




