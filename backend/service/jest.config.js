module.exports = {
    "roots": [
        "test/__tests__/",
        "src"
    ],
    "testMatch": [
        "**/__tests__/**/*.test.ts",
        "**/__tests__/*.test.ts",
        "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },

}