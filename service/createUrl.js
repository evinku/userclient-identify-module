let bip32 = require('bip32');
let crypto = require('crypto')
fs = require('fs');
var base32 = require('base32')
var CryptoJS = require("crypto-js");
var sha3_256 = require('js-sha3').sha3_256;
var truncate = require("truncate-utf8-bytes")

var createUrl = {
    createTorUrl: function (req, res, next) {

        console.log(truncate(getPublicKey(), 32))

        const publicKey = getPublicKey()
        const checksum = truncate(sha3_256(".onion checksum" + publicKey + '\x03'), 2)
        const onion_address = base32.encode(publicKey + checksum + '\x03') + ".onion"

        const decode = base32.decode(onion_address)
        console.log(decode)



        res.send(`Onion Adress Created: ${onion_address}`)
    },
};

function getPublicKey() {
    if (!fs.existsSync(`privateMaster.key`)) {
        return null
    }
    const xPrvRoot = fs.readFileSync('privateMaster.key', 'utf8')
    const root = bip32.fromBase58(xPrvRoot)

    return root.publicKey.toString('hex')
}


module.exports = createUrl;

