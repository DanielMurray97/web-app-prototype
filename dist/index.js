"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const nunjucks_1 = __importDefault(require("nunjucks"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
nunjucks_1.default.configure('views', {
    autoescape: true,
    express: app,
});
app.get('/', (req, res) => {
    res.render('index.njk', { layout: 'layout.njk', message: 'I am update' });
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
