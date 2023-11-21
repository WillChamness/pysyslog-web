import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" }); // do this first

import http from "http";
import app from "./backend/app";

const address: string = process.env.LISTEN_ADDRESS || "0.0.0.0";
let port: number;
if (process.env.LISTEN_PORT) port = Number.parseInt(process.env.LISTEN_PORT);
else port = 3000;

console.log(`Running server on ${address}:${port}`);
const server: http.Server = http.createServer(app);
server.listen(port, address);
