/*
* For a detailed explanation regarding each configuration property, visit:
* https://jestjs.io/docs/en/configuration.html
*/
module.exports = {
  // All imported modules in your tests should be mocked automatically
  // automock: false,

  rootDir: './',

  // Stop running tests after `n` failures
  bail: true,

  // Automatically clear mock calls and instances between every test
  // clearMocks: false,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // coveragePathIgnorePatterns: ["/node_modules/", "tests/"],

  // The test environment that will be used for testing
  testEnvironment: "node",

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/__tests__/**/?(*.)+(spec|test).[tj]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],
};
