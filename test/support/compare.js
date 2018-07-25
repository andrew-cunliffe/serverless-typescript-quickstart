const { expect } = require('chai');

const checkValues = (expected, actual) => {
    const expectedKeys = Object.keys(expected);
    const actualKeys = Object.keys(actual);

    expect(actualKeys, 'Response keys do not match expectation').to.have.members(expectedKeys);

    expectedKeys.map((key) => {
        let check;
        if (typeof expected[key] === 'string') {
            check = expected[key].match(/\[(\d+)\]/) || expected[key];
            if (check instanceof Array) {
                expected[key] = expected[key].replace(check[0], '');
            }
        }

        switch (expected[key]) {
            case 'OBJECT_ID':
                expect(actual[key]).to.match(/^[0-9A-F]{24}$/i);
                break;
            case 'DATE_TIME':
                expect(actual[key]).to.match(/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/);
                break;
            case 'STRING':
                expect(actual[key]).to.be.a('string');
                break;
            case 'ARRAY':
                expect(actual[key]).to.be.an.instanceof(Array);
                expect(actual[key]).to.have.length(check[1]);
                break;
            case 'OBJECT':
                expect(actual[key]).to.be.an('object');
                break;
            default:
                expect(actual[key]).to.deep.equal(expected[key]);
        }
    });
};

module.exports = checkValues;
