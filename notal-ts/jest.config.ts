const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  moduleDirectories: ["node_modules", "src"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  preset: "ts-jest",
  moduleNameMapper: {
    "#(.*)": "<rootDir>/node_modules/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@components": "<rootDir>/src/components",
    "^@icons/(.*)$": "<rootDir>/src/icons/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@public/(.*)$": "<rootDir>/pages/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@hooks": "<rootDir>/src/hooks",
    "^@api/(.*)$": "<rootDir>/src/api/$1",
    "^@lib/(.*)$": "<rootDir>/src/lib/$1",
    "^@constants/(.*)$": "<rootDir>/src/constants/$1",
    "^@types/(.*)$": "<rootDir>/src/types/$1",
  },
  resolver: "jest-node-exports-resolver",
};

module.exports = createJestConfig(customJestConfig);

export {};
