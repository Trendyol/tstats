module.exports = {
    moduleFileExtensions: [
      'js',
      'json',
      'ts',
    ],
    rootDir: './',
    testRegex: '.spec.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: [
      'src/**/*.ts',
      "!src/**/*-controller.ts",
      "!src/**/*-module.ts"
    ],
    coverageDirectory: 'coverage',
    testEnvironment: 'node'
  };
