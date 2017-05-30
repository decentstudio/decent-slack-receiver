//This will start the server before all tests are ran
import * as app from '../../src/server.js';

beforeAll(() => {
    global.baseUrl = 'http://localhost:8080/';
});