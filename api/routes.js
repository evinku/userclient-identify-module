'use strict';

const controller = require('./controller');

module.exports = function (app) {
    app.route('/derive-private-key/:accountNumber')
        .get(controller.derivePrivateKey);
    app.route('/create-root-master-pair')
        .get(controller.createRootMasterPair);
    app.route('/create-tor-url')
        .get(controller.createTorUrl)
};