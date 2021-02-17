let bip32 = require('bip32');
let crypto = require('crypto')
fs = require('fs');

var createKeys = {
    createRootMasterPair: function (req, res, next) {

        if (fs.existsSync('privateMaster.key') || fs.existsSync('publicMaster.key')) {
            res.send({ message: 'Private Key/Public Key already exists' })
            return
        }

        const randomSeed = crypto.randomBytes(16) //128-bits === 16-bytes |  512-bits === 64-bytes
        // const seed = Buffer.from('000102030405060708090a0b0c0d0eff', 'hex')
        const root = bip32.fromSeed(randomSeed);

        const xPub = getXPub(root)
        const xPrv = getXPrv(root)

        fs.writeFile('privateMaster.key', xPrv, function (err) {
            if (err) return console.log(err);
        });

        fs.writeFile('publicMaster.key', xPub, function (err) {
            if (err) return console.log(err);
        });

        res.send({ xPub, xPrv })
    },
    derivePrivateKey: function (req, res, next) {

        const accountNumber = req.params.accountNumber

        const derivedPrivateKeys = getDerivedPrivateKeys(accountNumber) || []

        let path = `m/${accountNumber}/0`

        if (derivedPrivateKeys.length > 0) {
            const lastDerivedPrivateKey = derivedPrivateKeys[derivedPrivateKeys.length - 1]
            const node = bip32.fromBase58(lastDerivedPrivateKey)
            path = `m/${accountNumber}/${node.index + 1}`
        }
        const xPrvRoot = fs.readFileSync('privateMaster.key', 'utf8')
        const childNode = deriveKeyPairFromRoot(bip32.fromBase58(xPrvRoot), path)

        derivedPrivateKeys.push(getXPrv(childNode))
        writeDerivedPrivateKeys(derivedPrivateKeys, accountNumber)
        res.json(`Child node created (path: ${path}) ${getXPrv(childNode)}`)
    }
};

function writeDerivedPrivateKeys(privateKeys, accountId) {
    json = JSON.stringify(privateKeys)
    fs.writeFile(`derivedPrivateKeysAccount${accountId}.json`, json, 'utf8', function (err) {
        if (err) return console.log(err);
    });
}

function getDerivedPrivateKeys(accountId) {
    if (!fs.existsSync(`derivedPrivateKeysAccount${accountId}.json`)) {
        return null
    }
    return JSON.parse(fs.readFileSync(`derivedPrivateKeysAccount${accountId}.json`, 'utf8'))
}

function getXPub(node) {
    return node.neutered().toBase58()
}

function getXPrv(node) {
    return node.toBase58()
}

function deriveKeyPairFromRoot(root, path) {
    return root.derivePath(path)
}

module.exports = createKeys;