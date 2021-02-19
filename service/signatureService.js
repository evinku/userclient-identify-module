let bip32 = require('bip32')
fs = require('fs');
var base32 = require('base32')
var sha3_256 = require('js-sha3').sha3_256;
var truncate = require("truncate-utf8-bytes")
const crypto = require('crypto');
var bitcoinMessage = require('bitcoinjs-message')
var bitcoin = require('bitcoinjs-lib')

var signatureService = {
    sendSignature: (req, res, next) => {
        // const onionAddress = req.params.onionAddress
        // const publicKey = decodeOnionAddressToPublicKey(onionAddress)
        const message = req.params.message

        const xPrvRoot = fs.readFileSync('privateMaster.key', 'utf8')
        const wif = bip32.fromBase58(xPrvRoot).toWIF()

        const keyPair = bitcoin.ECPair.fromWIF(wif);

        var signature = bitcoinMessage.sign(message, keyPair.privateKey, keyPair.compressed).toString('base64')

        res.send({ signature })

    },
    checkSignature: (req, res, next) => {


        findPrivateKeyOfPublicKey("dasd")


        // const onionAddress = req.params.onionAddress
        // const publicKey = decodeOnionAddressToPublicKey(onionAddress)

        // const message = req.params.message
        // const signature = req.params.signature

        // const xPrvRoot = fs.readFileSync('privateMaster.key', 'utf8')
        // const wif = bip32.fromBase58(xPrvRoot).toWIF()

        // const keyPair = bitcoin.ECPair.fromWIF(wif);
        // const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });

        // res.send({ signature_valid: bitcoinMessage.verify(message, address, signature) })
    }

};


function findPrivateKeyOfPublicKey(publicKey) {

    const derivedKeys = JSON.parse(fs.readFileSync(`derivedPrivateKeys.json`, 'utf8'))

    let allKeys = []
    Object.keys(derivedKeys).forEach(account => {
        allKeys = [...allKeys, ...derivedKeys[account]]
    })

    const wif = allKeys.map(key => bip32.fromBase58(key).toWIF())

    const publicKeys = wif.map(wif => bitcoin.ECPair.fromWIF(wif).publicKey.toString('hex'))




    const index = publicKeys.findIndex(key => key === '03b63e604b0f22447b6a8bebfc1930a4aaa9dae71f10354e74edc64f5bc1811c5c')

    console.log(index)



}



function decodeOnionAddressToPublicKey(onionAddress) {
    const adress = onionAddress.toString().split('.')[0].trim()
    const decodeAddress = base32.decode(adress)
    const publicKey = decodeAddress.slice(0, -3)

    return publicKey
}

module.exports = signatureService;

