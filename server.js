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
    console.log("HTTPS Server running on port 3001");
});

httpServer.listen(3000, () => {
    console.log("HTTP Server running on port 3000");
});

// Websocket game events
app.ws("/", (socket, req) => {
    sockets.push(socket);

    const query = req.url.split("?")[1]; // récupère la query string
    const params = new URLSearchParams(query); // crée un objet URLSearchParams à partir de la query string
    const id = params.get("id"); // récupère la valeur de la query id

    let player;

    // Si la connection vient d'un remote controller
    if (id !== null) {
        player = parseInt(id);
    } else {
        player = game.join();
    }

    socket.on("message", (string) => {
        const message = codec.decode(string);
        console.log(message);
        game.onMessage(player, message);
    });

    socket.on("close", () => {
        // Si ce n'est pas un remote controller
        if (id === null) {
            game.quit(player);
            sockets = sockets.filter((s) => s !== socket);
        }
    });
});
