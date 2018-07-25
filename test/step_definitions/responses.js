const { Given, When, Then } = require('cucumber');
const { expect } = require('chai');

const checkValues = require('../support/compare');

Then(/^the status returned from the "([^"]*)" request should be (201|202)$/, function (historyName, statusCode) {
    return Promise.resolve(this.getHistory(historyName))
        .then((history) => expect(history.status).to.equal(parseInt(statusCode)));
});

Then(/^(?:there should be a (200|400|500|503) (?:response|error) from )?the "([^"]*)" request that(?: has (?:a|an) "([^"]*)" field and row (\d+))? contains:$/, function (statusCode, historyName, expectedField, expectedRecord, expectedData) {
    expectedData = this.getHashes(expectedData);

    return Promise.resolve(this.getHistory(historyName))
        .then((history) => Promise.all([
                statusCode ? expect(history.status).to.equal(parseInt(statusCode)) : true,
                checkValues(expectedData[0], expectedField && expectedRecord ? history.response[expectedField][expectedRecord - 1] : history.response)
            ])
        );
});
