const fs = require('fs');
const path = require('path');

const { setWorldConstructor } = require('cucumber');

let history = {};

class World {

    constructor() {
        this.loadConfig((process.env['NODE_ENV'] || 'TEST').toLowerCase());
        this.headers = new Set();
        this.mocks = [];
        this.history = history;
    }

    loadConfig(mode) {
        const config = require('../../config');
        Object.assign(process.env, config[mode]);
    }

    setHeader(name, value) {
        this.headers.add({ name, value });
    }

    addMock(mock) {
        this.mocks.push(mock);
    }

    parseTemplateString(string) {
        let template = string.match(/{{\s?(\S*)\s?}}/);
        if (template !== null) {
            let target = template[1].split('.');
            let request = target.shift();
            let parts = request.match(/\[(\d+)\]/);
            if (parts) {
                let history = this.getHistory(request.replace(parts[0], ''), parts[1] - 1);
                target.forEach((field) => history = history[field]);
                string = string.replace(template[0], history);
            }
            string = this.parseTemplateString(string);
        }
        return string;
    }

    getHashes(data) {
        let cleaned = [];
        let rows = data.hashes();

        for (let row of rows) {
            for (let hash in row) {
                if (!row[hash] || row[hash] === '') {
                    delete row[hash];
                    break;
                }

                row[hash] = this.parseTemplateString(row[hash]);

                const keywords = row[hash].match(/^(\S*)\((\S*)\)$/);
                const keyword = keywords ? keywords[1] : row[hash];

                switch (keyword) {
                    case 'DATETIME':
                        row[hash] = Date.now();
                        break;
                }

                try {
                    let parsed = JSON.parse(row[hash]);
                    row[hash] = parsed;
                } catch (ex) {
                }
            }
            cleaned.push(row);
        }
        return cleaned;
    }

    getHistory(name, row) {
        if (row !== undefined) {
            return this.history[name][row];
        }
        return this.history[name];
    }

    processResponse(res, storage) {
        if (this.mocks.length > 0) {
            this.mocks.forEach((mock) => {
                mock.done();
            });
        }

        let data = {
            status: res.statusCode,
            headers: res.headers
        };

        try {
            data.response = JSON.parse(res.text);
        } catch (ex) {
            data.response = res.text || res.body;
        }

        if (storage) {
            this.history[storage] = data;
        }
    }

    performPost(endpoint, data, storage) {
        return new Promise((resolve, reject) => {
            const uri = this.parseTemplateString(endpoint);
            const request = this.agent.post(uri);

            this.headers.forEach((header) => request.set(header.name, header.value));
            request.send(data);
            request.expect((res) => this.processResponse(res, storage));
            request.end((err, res) => err ? reject(err) : resolve(res));
        });
    }

}

setWorldConstructor(World);
