// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: ['/node_modules/(?!axios)'],
  modulePathIgnorePatterns: ['<rootDir>/src/pages/SalesReport.js']

};
