import { wiimote } from "./keyboard.js";

let playerId = 0;

document.getElementById("player-id").addEventListener("change", onPlayerIdChange, true);
document.getElementById("start").addEventListener("click", start);

function onPlayerIdChange(event) {
    console.log(document.getElementById("player-id").value);
    playerId = document.getElementById("player-id").value;
}

function start() {
    // Initialize server connection
    const socket = new WebSocket(`wss://luca-aspire-a515-54G:3001/?id=${playerId}`);

    socket.onopen = () => {
        const listener = (event) => socket.send(JSON.stringify(event));
        console.log("coucou");
        wiimote(listener);
    };
}
