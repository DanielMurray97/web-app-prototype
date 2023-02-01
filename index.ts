import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import nunjucks from 'nunjucks';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

nunjucks.configure(['node_modules/govuk-frontend','views'], {
  autoescape: true,
  express: app,
});

app.get('/', (req: Request, res: Response) => {
  res.render('index.njk', { layout: 'layout.njk', message: 'Hello' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
