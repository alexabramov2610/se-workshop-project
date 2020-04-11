module.exports = {
    "roots": [
        "test/__tests__/store",
        "test/__tests__/trading_system",
        "test/__tests__/user",
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