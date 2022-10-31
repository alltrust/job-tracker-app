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
dotenv_1.default.config();
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const connect_1 = __importDefault(require("./db/connect"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const jobRoutes_1 = __importDefault(require("./routes/jobRoutes"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
const not_found_1 = __importDefault(require("./middleware/not-found"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
//@ts-ignore
const xss_clean_1 = __importDefault(require("xss-clean"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const MONGO_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.copgrn2.mongodb.net/${process.env.MONGO_DATABASE}`;
if (process.env.NODE_ENV !== "production") {
    app.use((0, morgan_1.default)('dev'));
}
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use((0, xss_clean_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
app.use(express_1.default.static(path_1.default.resolve(__dirname, '../../client/build')));
app.get("/", (req, res, next) => {
    res.json({ message: "welcome" });
});
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/jobs', jobRoutes_1.default);
app.get('*', function (request, response) {
    response.sendFile(path_1.default.resolve(__dirname, '../../client/build', 'index.html'));
});
//goes at end in case no other routes match
app.use(not_found_1.default);
app.use(error_handler_1.default);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connect_1.default)(MONGO_URL);
        app.listen(port, () => {
            console.log(`listening on ${port} okok!!`);
        });
    }
    catch (error) {
        console.log(error);
    }
});
startServer();
