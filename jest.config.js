// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Prevent tests from printing messages through the console
  silent: true,

  // Indicates whether each individual test should be reported during the run
  verbose: true,

  // Jest will run tests in all of the specified projects at the same time
  projects: ['<rootDir>/packages/*/jest.config.js'],

  //  which coverage information should be collected
  collectCoverageFrom: ['src/**/*.{js,ts}'],
};
