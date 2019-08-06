"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const cors_1 = __importDefault(require("cors"));
const pretty_error_1 = __importDefault(require("pretty-error"));
const pretty = new pretty_error_1.default();
function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({ error: 'Something failed!' });
    }
    else {
        next(err);
    }
}
function errorHandler(err, req, res, next) {
    res.status(500);
    res.render('error', { error: err });
}
function logErrors(err, req, res, next) {
    pretty.render(err);
    next(err);
}
class Server {
    constructor(service, logger) {
        this.service = service;
        this.logger = logger;
        this.app = express_1.default();
        this.config();
        this.svc();
    }
    svc() {
        this.app.use('/svc', (req, res) => {
            res.json(this.service);
        });
    }
    config() {
        this.app.use(cors_1.default());
    }
    RegisterSvc() {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
    initLogger() {
        if (this.logger) {
            let name = this.logger.name || this.service.name;
            let logFileName = path_1.default.join(this.logger.path || process.cwd(), `${name}.log`);
            fs_extra_1.default.ensureFileSync(logFileName);
        }
    }
    initStatics() {
        if (!this.service.statics) {
            const root = path_1.default.relative(process.cwd(), path_1.default.resolve(__dirname, '../../../'));
            this.app.use(express_1.default.static(path_1.default.join(root, 'static')));
        }
        else {
            for (let i = 0, len = this.service.statics.length; i < len; i++) {
                this.app.use(this.service.statics[i].route, express_1.default.static(this.service.statics[i].path));
            }
        }
    }
    errorHandling() {
        this.app.use(logErrors);
        this.app.use(clientErrorHandler);
        this.app.use(errorHandler);
    }
}
exports.Server = Server;
//# sourceMappingURL=api.js.map