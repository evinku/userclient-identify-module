fs = require('fs');
var base32 = require('base32')
var sha3_256 = require('js-sha3').sha3_256;
var truncate = require("truncate-utf8-bytes")
var bitcoin = require('bitcoinjs-lib')

var computeService = {
    computeOnionAddress: (req, res, next) => {
        const publicKey = getRandomPublicKey()

        if (!publicKey) {
            res.send({ message: "No Public Keys available. Please derive some" })
            return
        }

        const onionAddress = encodePublicKeyToOnionAddress(publicKey)

        res.send({ publicKey, onionAddress })
    },
    computePublicKey: (req, res, next) => {
        const onionAddress = req.params.onionAddress
        const publicKey = decodeOnionAddressToPublicKey(onionAddress)

        res.send({ onionAddress, publicKey })
    }
};

function getRandomPublicKey() {
    const derivedWifs = JSON.parse(fs.readFileSync(`derivedWifs.json`, 'utf8'))

    let allWifs = []
    Object.keys(derivedWifs).forEach(account => {
        allWifs = [...allWifs, ...derivedWifs[account]]
    })

    const publicKeys = allWifs.map(wif => bitcoin.ECPair.fromWIF(wif).publicKey.toString('hex'))
    const randomPublicKey = publicKeys[Math.floor(Math.random() * publicKeys.length)]

    return randomPublicKey
}

function decodeOnionAddressToPublicKey(onionAddress) {
    const address = onionAddress.toString().split('.')[0].trim()
    const decodeAddress = base32.decode(address)
    const publicKey = decodeAddress.slice(0, -3)

    return publicKey
}

function encodePublicKeyToOnionAddress(publicKey) {
    const checksum = truncate(sha3_256(".onion checksum" + publicKey + '\x03'), 2)
    const onionAddress = base32.encode(publicKey + checksum + '\x03') + ".onion"

    return onionAddress
}

module.exports = computeService;

