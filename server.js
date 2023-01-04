import express from "express";
import expressWs from "express-ws";
import { Game } from "./src/game.js";
import { Codec } from "./src/message.js";
import https from "https";
import fs from "fs";
import http from "http";

const app = express();

// The sockets of the connected players
let sockets = [];
const codec = new Codec();

// Initialize the game
const game = new Game((message) => {
    // TODO: Broadcast the message to the connected browsers
    for (const socket of sockets) {
        if (socket.readyState === socket.OPEN) {
            socket.send(codec.encode(message));
        }
    }
});

setInterval(() => {
    game.move();
}, 10);

// Serve the public directory
app.use(express.static("public"));

// Serve the src directory
app.use("/src", express.static("src"));

// Serve the src directory
app.use("/test", express.static("test"));

// Serve the jsdoc directory
app.use("/doc", express.static("out"));

// Serve the dist directory
app.use("/dist", express.static("dist"));

const httpServer = http.createServer(app);
const httpsServer = https.createServer(
    {
        key: fs.readFileSync("./luca-Aspire-A515-54G-key.pem"),
        cert: fs.readFileSync("./luca-Aspire-A515-54G.pem"),
    },
    app
);
expressWs(app, httpsServer);

httpsServer.listen(3001, () => {
    console.log("HTTPS Server running on port 443");
});

httpServer.listen(3000, () => {
    console.log("HTTP Server running on port 3000");
});

// Websocket game events
app.ws("/", (socket) => {
    sockets.push(socket);

    // Let a new player join the game
    const player = game.join();

    socket.on("message", (string) => {
        const message = codec.decode(string);
        console.log(message);
        game.onMessage(player, message);
    });

    socket.on("close", () => {
        game.quit(player);
        sockets = sockets.filter((s) => s !== socket);
    });
});
