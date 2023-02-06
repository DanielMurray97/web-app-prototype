"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const nunjucks_1 = __importDefault(require("nunjucks"));
const livereload_1 = __importDefault(require("livereload"));
const connect_livereload_1 = __importDefault(require("connect-livereload"));
const body_parser_1 = __importDefault(require("body-parser"));
const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});
dotenv_1.default.config();
const liveReloadServer = livereload_1.default.createServer();
liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
        liveReloadServer.refresh('/');
    }, 100);
});
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('public'));
app.use((0, connect_livereload_1.default)());
nunjucks_1.default.configure(['node_modules/govuk-frontend/', 'views'], {
    autoescape: true,
    express: app,
});
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allJournal = yield pool.query("SELECT * FROM journal_entry");
        console.log(allJournal);
        res.render('data.njk', {
            layout: 'layout.njk',
            rows: allJournal.rows[0].full_name,
        });
    }
    catch (err) {
        console.error(err.message);
    }
}));
app.get('/data', (req, res) => {
    res.render('data.njk', {
        layout: 'layout.njk',
        message: 'I am Data, sent from server to /data endpoint',
    });
});
app.get('/form', (req, res) => {
    res.render('form.njk', {
        layout: 'layout.njk',
        message: 'I am Form, sent from server to /form endpoint',
    });
});
app.post('/', (req, res) => {
    console.log(req.body);
    res.send(req.body);
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
