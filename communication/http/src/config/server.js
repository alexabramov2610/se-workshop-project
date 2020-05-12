import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from 'cookie-parser';

const server = express();
server.use(cookieParser());

server.use(bodyParser.json());
server.use(cors());

export default server;
