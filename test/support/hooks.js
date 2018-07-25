const nock = require('nock');
const supertest = require('supertest');

const { BeforeAll, Before } = require('cucumber');

BeforeAll(function (next) {
    nock.disableNetConnect();
    nock.enableNetConnect(/localhost|127.0.0.1/);
    next();
});

Before(function (scenario, next) {
    nock.cleanAll();
    next();
});

Before('@Example', function (scenario, next) {
    this.agent = supertest.agent(require('../../src/example'));
    next();
});
