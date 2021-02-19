let bip32 = require('bip32')
fs = require('fs');
var base32 = require('base32')
var sha3_256 = require('js-sha3').sha3_256;
var truncate = require("truncate-utf8-bytes")

var computeService = {
    computeOnionAddress: (req, res, next) => {
        const publicKey = getPublicKey()
        const onionAddress = encodePublicKeyToOnionAddress(publicKey)

        res.send({ publicKey, onionAddress })
    },
    computePublicKey: (req, res, next) => {
        const onionAddress = req.params.onionAddress
        const publicKey = decodeOnionAddressToPublicKey(onionAddress)

        res.send({ onionAddress, publicKey })
    }
};

function getPublicKey() {
    if (!fs.existsSync(`privateMaster.key`)) {
        return null
    }
    const xPrvRoot = fs.readFileSync('privateMaster.key', 'utf8')
    const root = bip32.fromBase58(xPrvRoot)

    return root.publicKey.toString('hex')
}

function decodeOnionAddressToPublicKey(onionAddress) {
    const adress = onionAddress.toString().split('.')[0].trim()
    const decodeAddress = base32.decode(adress)
    const publicKey = decodeAddress.slice(0, -3)

    return publicKey
}

function encodePublicKeyToOnionAddress(publicKey) {
    const checksum = truncate(sha3_256(".onion checksum" + publicKey + '\x03'), 2)
    const onionAddress = base32.encode(publicKey + checksum + '\x03') + ".onion"

    return onionAddress
}

module.exports = computeService;

