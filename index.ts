import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import nunjucks from "nunjucks";
import livereload from "livereload";
import connectLiveReload from "connect-livereload";
import bodyParser from "body-parser";
import { Pool } from "pg";
import methodOverride from "method-override";

dotenv.config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: 5432, // TS won't allow environment variable to be put here
});

// Check Postgres connection by running empty query

pool.query("", (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Postgres connected to server...");
  }
});

// Add liveReloadServer for hot module replacement (better dev experience)

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// Initialise server

const app: Express = express();
const port = process.env.PORT;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(connectLiveReload());

// Configure nunjucks templating engine

nunjucks.configure(["node_modules/govuk-frontend/", "views"], {
  autoescape: true,
  express: app,
});

// Routes/Endpoints

app.get("/", async (req: Request, res: Response) => {
  res.render("layout.njk");
});

app.get("/data", async (req: Request, res: Response) => {
  try {
    const allJournal = await pool.query("SELECT * FROM journal_entry"); // https://youtu.be/ldYcgPKEZC8?t=1159
    console.log(allJournal.rows);

    res.render("data.njk", {
      layout: "layout.njk",
      data: allJournal.rows,
    });
  } catch (err: any) {
    console.error(err.message);
  }
});

app.get("/form", async (req: Request, res: Response) => {
  res.render("form.njk", { layout: "layout.njk" });
});

app.post("/form", async (req: Request, res: Response) => {
  try {
    const { full_name } = req.body;
    const { title } = req.body;
    const { journal_entry } = req.body;
    const newJournal = await pool.query(
      `INSERT INTO journal_entry (full_name, title, journal_entry) VALUES($1,$2,$3)`,
      [full_name, title, journal_entry]
    );
    res.render("form.njk", { layout: "layout.njk" });
  } catch (err: any) {
    console.error(err.message);
    res.redirect("/");
  }
});

app.delete("/data/:id", async (req: Request, res: Response) => {
  try {
    console.log("Delete request received");
    const journal_entry_id = req.params.id;
    const newJournal = await pool.query(
      `DELETE FROM journal_entry WHERE journal_entry_id = $1`,
      [journal_entry_id]
    );
    res.redirect("/data");
  } catch (err: any) {
    console.error(err.message);
    res.redirect("/");
  }
});

app.get("/data/:id", async (req: Request, res: Response) => {
  console.log("edit mode");
  try {
    const allJournal = await pool.query("SELECT * FROM journal_entry"); // https://youtu.be/ldYcgPKEZC8?t=1159
    console.log(allJournal.rows);
    res.render("edit.njk", {
      layout: "layout.njk",
      data: allJournal.rows,
      id: req.params.id,
    });
  } catch (err: any) {
    console.error(err.message);
  }
});

app.put("/data/edit/:id", async (req: Request, res: Response) => {
  try {
    console.log("Edit request received");
    const id = req.params.id;
    const { full_name } = req.body;
    const { title } = req.body;
    const { journal_entry } = req.body;

    const newJournal = await pool.query(
      `UPDATE journal_entry SET full_name = $1, title=$2, journal_entry=$3 WHERE journal_entry_id=$4;`,
      [full_name, title, journal_entry, id]
    );
    res.redirect("/data");
  } catch (err: any) {
    console.error(err.message);
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
