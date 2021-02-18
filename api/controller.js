'use strict';

var createKeys = require('../service/createKeys');
var createUrl = require('../service/createUrl');

var controllers = {
    createRootMasterPair: function (req, res) {
        createKeys.createRootMasterPair(req, res, function (err, dist) {
            if (err)
                res.send(err);
            res.json(dist);
        });
    },
    derivePrivateKey: function (req, res) {
        createKeys.derivePrivateKey(req, res, function (err, dist) {
            if (err)
                res.send(err);
            res.json(dist);
        })
    },
    createTorUrl: function (req, res) {
        createUrl.createTorUrl(req, res, function (err, dist) {
            if (err)
                res.send(err);
            res.json(dist);
        })
    },
};

module.exports = controllers;