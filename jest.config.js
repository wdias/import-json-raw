module.exports = {
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.json',
      skipBabel: true
    }
  },
  moduleFileExtensions: [
    'ts',
    'js',
    'json'
  ],
  transform: {
    '\\.ts$': 'ts-jest'
  },
  testMatch: [
    '**/test/**/*.test.(ts|js)'
  ],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist']
};
