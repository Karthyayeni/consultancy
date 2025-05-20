module.exports = {
  reporters: [
    "default",
    [ "jest-junit", {
      outputDirectory: "test-results/frontends",
      outputName: "jest-results.xml"
    }]
  ],
  testEnvironment: "jsdom"
};
