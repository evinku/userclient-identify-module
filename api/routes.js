'use strict';

const controller = require('./controller');

module.exports = function (app) {
    app.route('/create-root-private-key')
        .get(controller.createRootPrivateKey);
    app.route('/derive-private-key/:accountNumber')
        .get(controller.derivePrivateKeyInWif);
    app.route('/compute-onion-address')
        .get(controller.computeOnionAddress)
    app.route('/compute-public-key/:onionAddress')
        .get(controller.computePublicKey)
    app.route('/send-signature/:onionAddress/:message')
        .get(controller.sendSignature)
    app.route('/check-signature/:onionAddress/:message/:signature')
        .get(controller.checkSignature)
};