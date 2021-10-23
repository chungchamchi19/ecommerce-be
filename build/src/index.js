"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const auth_1 = __importDefault(require("./middlewares/auth"));
const async_1 = __importDefault(require("./middlewares/async"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = express_1.default();
const PORT = process.env.PORT || 3000;
app.use(cors_1.default());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(async_1.default(auth_1.default));
/* routes */
routes_1.default(app).then(() => {
    app.use(errorHandler_1.default);
    app.listen(PORT, () => {
        console.log(`⚡️[]: Server is running at http://localhost:${PORT}`);
    });
});
