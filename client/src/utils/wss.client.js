export const init = (username) => {
    client = new WebSocket(`wss://localhost:8000/?name=${username}`);
    client.onmessage = onMessageBackup;
}

export const setOnMessage = (onMessageCallback) => {
    onMessageBackup = onMessageCallback;
}

let client;
let onMessageBackup;

