module.exports = {
    "roots": [
        "test/__tests__/",
        "src"
    ],
    "testMatch": [
        "**/__tests__/**/*.testSocket.ts",
        "**/__tests__/*.testSocket.ts",
        "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    "testEnvironment": "node"

}