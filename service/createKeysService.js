let bip32 = require('bip32');
let crypto = require('crypto')
fs = require('fs');

var createKeysService = {
    createRootPrivateKey: function (req, res, next) {
        if (fs.existsSync('privateMaster.key')) {
            res.send({ message: 'Root Extended Private Key already exists' })
            return
        }

        const randomSeed = crypto.randomBytes(16)
        const root = bip32.fromSeed(randomSeed);
        const xPrv = getXPrv(root)

        fs.writeFile('privateMaster.key', xPrv, function (err) {
            if (err) return console.log(err);
        });

        res.send({ xPrv })
    },
    derivePrivateKey: function (req, res, next) {

        const accountNumber = req.params.accountNumber
        let path = `m/${accountNumber}/0`

        const derivedPrivateKeys = getDerivedPrivateKeys() || {}

        if (!derivedPrivateKeys[accountNumber]) {
            derivedPrivateKeys[accountNumber] = []
        }

        if (derivedPrivateKeys[accountNumber].length > 0) {
            const lastDerivedPrivateKey = derivedPrivateKeys[accountNumber][derivedPrivateKeys[accountNumber].length - 1]
            const node = bip32.fromBase58(lastDerivedPrivateKey)
            path = `m/${accountNumber}/${node.index + 1}`
        }
        const xPrvRoot = fs.readFileSync('privateMaster.key', 'utf8')
        const childNode = deriveKeyPairFromRoot(bip32.fromBase58(xPrvRoot), path)

        derivedPrivateKeys[accountNumber].push(getXPrv(childNode))
        writeDerivedPrivateKeys(derivedPrivateKeys, accountNumber)

        res.json(`Child node created (path: ${path}) ${getXPrv(childNode)}`)
    }
};

function writeDerivedPrivateKeys(privateKeys) {
    json = JSON.stringify(privateKeys)
    fs.writeFile(`derivedPrivateKeys.json`, json, 'utf8', function (err) {
        if (err) return console.log(err);
    });
}

function getDerivedPrivateKeys() {
    if (!fs.existsSync(`derivedPrivateKeys.json`)) {
        return null
    }
    return JSON.parse(fs.readFileSync(`derivedPrivateKeys.json`, 'utf8'))
}

function getXPrv(node) {
    return node.toBase58()
}

function deriveKeyPairFromRoot(root, path) {
    return root.derivePath(path)
}

module.exports = createKeysService;