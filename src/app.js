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
const config_1 = require("./config");
const GasCalculator_1 = require("./services/GasCalculator");
const app = (0, express_1.default)();
const port = config_1.appConfig.core.port;
const gasCalculator = new GasCalculator_1.GasCalculator();
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
app.get('/computeAirdrop', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gasEstimation = yield gasCalculator.compute();
    console.log(gasEstimation);
    res.status(200).send(gasEstimation);
}));
