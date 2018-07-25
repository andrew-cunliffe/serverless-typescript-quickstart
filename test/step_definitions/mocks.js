const fs = require('fs');
const path = require('path');

const nock = require('nock');
const querystring = require('querystring');

const { Given, When, Then } = require('cucumber');
const { expect } = require('chai');

const prepareMock = (uri, target, type, status, file, body) => {
    let mock = nock(uri).log((message, actual, separator, expected) => {
        message = message.trim();
        switch (message) {
            case 'bodies don\'t match:':
                expect(expected).to.equal(actual);
                break;
            default:
                if (!message.startsWith('matching')) {
                    throw new Error(`Unknown network mocking error occurred: ${message}`);
                }
        }
    });

    if (type === 'POST' || type === 'PUT') {
        mock.filteringPath(/.*/, '*');
        mock = mock[type.toLowerCase()]('*');
    } else {
        mock = mock.intercept(target ? target : '*', type);
    }

    if (file) {
        if (type === 'HEAD') {
            mock = mock.reply(status, null, JSON.parse(fs.readFileSync(path.join(__dirname, '../mocks', file), 'utf8')));
        } else {
            mock = mock.replyWithFile(status, path.join(__dirname, '../mocks', file));
        }
    } else {
        mock = mock.reply(status);
    }

    return mock;
};

Given(/^there is a (HEAD|POST|PUT|GET) consumer at "([^"]*)"(?: for "([^"]*)")? that will return(?: "([^"]*)" with)? status (\d+)$/, function (type, uri, target, file, status) {
    target = target ? this.parseTemplateString(target) : target;
    return this.addMock(prepareMock(uri, target, type, status, file));
});

Given(/^I show the available history$/, function () {
    console.log(this.history);
});
