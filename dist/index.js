"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const nunjucks_1 = __importDefault(require("nunjucks"));
const livereload_1 = __importDefault(require("livereload"));
const connect_livereload_1 = __importDefault(require("connect-livereload"));
dotenv_1.default.config();
const liveReloadServer = livereload_1.default.createServer();
liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
        liveReloadServer.refresh('/');
    }, 100);
});
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.static('public'));
app.use((0, connect_livereload_1.default)());
nunjucks_1.default.configure(['node_modules/govuk-frontend/', 'views'], {
    autoescape: true,
    express: app,
});
app.get('/', (req, res) => {
    res.render('layout.njk', { message: 'I am Home, sent from server to / endpoint' });
});
app.get('/data', (req, res) => {
    res.render('data.njk', { layout: 'layout.njk', message: 'I am Data, sent from server to /data endpoint' });
});
app.get('/form', (req, res) => {
    res.render('form.njk', { layout: 'layout.njk', message: 'I am Form, sent from server to /form endpoint' });
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
