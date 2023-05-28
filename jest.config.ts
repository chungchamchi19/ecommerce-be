import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  // verbose: true,
  // automock: true,
  testPathIgnorePatterns: ["/__tests__/fake/"],
};
export default config;
