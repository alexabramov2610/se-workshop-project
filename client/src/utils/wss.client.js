export const init = async (username) => {
    client = new WebSocket(`wss://localhost:8000/?name=${username}`);
    client.onmessage = onMessage;
}

export const setOnRoutineMessages = (onMessageCallback) => {
    onRoutineMessageBackup = onMessageCallback;
    onMessage = (res) => {
        onRoutineMessageBackup(res);
        onStatsUpdateBackup && onStatsUpdateBackup(res);
    }
}

export const setOnStatsUpdate = (onUpdateCallback) => {
    onStatsUpdateBackup = onUpdateCallback;
}

let client;
let onRoutineMessageBackup;

let onStatsUpdateBackup;

let onMessage;



