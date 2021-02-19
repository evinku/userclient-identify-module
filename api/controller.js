'use strict';

var createKeysService = require('../service/createKeysService');
var computeService = require('../service/computeService');
var signatureService = require('../service/signatureService');

var controllers = {
    createRootPrivateKey: function (req, res) {
        createKeysService.createRootPrivateKey(req, res, function (err, dist) {
            if (err)
                res.send(err);
            res.json(dist);
        });
    },
    derivePrivateKey: function (req, res) {
        createKeysService.derivePrivateKey(req, res, function (err, dist) {
            if (err)
                res.send(err);
            res.json(dist);
        })
    },
    computeOnionAddress: function (req, res) {
        computeService.computeOnionAddress(req, res, function (err, dist) {
            if (err)
                res.send(err);
            res.json(dist);
        })
    },
    computePublicKey: function (req, res) {
        computeService.computePublicKey(req, res, function (err, dist) {
            if (err)
                res.send(err);
            res.json(dist);
        })
    },
    sendSignature: function (req, res) {
        signatureService.sendSignature(req, res, function (err, dist) {
            if (err)
                res.send(err);
            res.json(dist);
        })
    },
    checkSignature: function (req, res) {
        signatureService.checkSignature(req, res, function (err, dist) {
            if (err)
                res.send(err);
            res.json(dist);
        })
    },
};

module.exports = controllers;