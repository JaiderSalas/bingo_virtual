import express from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {saveGame} from "../controllers/bingo-controller.js";

const bingorouter = express.Router();

bingorouter.post("/save", authRequired);

export default bingorouter;