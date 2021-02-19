fs = require('fs');
var base32 = require('base32')
var bitcoinMessage = require('bitcoinjs-message')
var bitcoin = require('bitcoinjs-lib')

var signatureService = {
    sendSignature: (req, res, next) => {
        const onionAddress = req.params.onionAddress
        const publicKey = decodeOnionAddressToPublicKey(onionAddress)
        const message = req.params.message

        const derivedWifs = JSON.parse(fs.readFileSync(`derivedWifs.json`, 'utf8'))

        let allWifs = []
        Object.keys(derivedWifs).forEach(account => {
            allWifs = [...allWifs, ...derivedWifs[account]]
        })

        const publicKeys = allWifs.map(wif => bitcoin.ECPair.fromWIF(wif).publicKey.toString('hex'))

        if (!publicKeys.includes(publicKey)) {
            res.send({ message: "No private key for this onion address available" })
            return
        }

        const index = publicKeys.findIndex(key => key === publicKey)
        const keyPair = bitcoin.ECPair.fromWIF(allWifs[index]);
        var signature = bitcoinMessage.sign(message, keyPair.privateKey, keyPair.compressed).toString('base64')

        res.send({ onionAddress, message, signature })

    },
    checkSignature: (req, res, next) => {
        const onionAddress = req.params.onionAddress
        const publicKey = decodeOnionAddressToPublicKey(onionAddress)
        const message = req.params.message
        const signature = req.params.signature

        const derivedWifs = JSON.parse(fs.readFileSync(`derivedWifs.json`, 'utf8'))

        let allWifs = []
        Object.keys(derivedWifs).forEach(account => {
            allWifs = [...allWifs, ...derivedWifs[account]]
        })

        const publicKeys = allWifs.map(wif => bitcoin.ECPair.fromWIF(wif).publicKey.toString('hex'))

        const index = publicKeys.findIndex(key => key === publicKey)
        const keyPair = bitcoin.ECPair.fromWIF(allWifs[index]);
        const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });

        res.send({ signature_valid: bitcoinMessage.verify(message, address, signature) })
    }

};

function decodeOnionAddressToPublicKey(onionAddress) {
    const adress = onionAddress.toString().split('.')[0].trim()
    const decodeAddress = base32.decode(adress)
    const publicKey = decodeAddress.slice(0, -3)

    return publicKey
}

module.exports = signatureService;

