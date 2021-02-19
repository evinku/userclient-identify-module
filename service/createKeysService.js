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
    derivePrivateKeyInWif: function (req, res, next) {
        if (!fs.existsSync('privateMaster.key')) {
            res.send({ message: 'No Root Extended Private Key exists.' })
            return
        }

        const accountNumber = req.params.accountNumber
        let path = `m/${accountNumber}/0`

        const wifs = getWifs() || {}

        if (!wifs[accountNumber]) {
            wifs[accountNumber] = []
        }

        if (wifs[accountNumber].length > 0) {
            const wifsForAccount = wifs[accountNumber]
            const len = wifsForAccount.length
            path = `m/${accountNumber}/${len + 1}`
        }
        const xPrvRoot = fs.readFileSync('privateMaster.key', 'utf8')
        const childNode = deriveKeyPairFromRoot(bip32.fromBase58(xPrvRoot), path)

        wifs[accountNumber].push(childNode.toWIF())
        writeDerivedWifs(wifs)

        res.json({ message: "Child node created", path, WIF: childNode.toWIF() })
    }
};

function writeDerivedWifs(wifs) {
    json = JSON.stringify(wifs)
    fs.writeFile(`derivedWifs.json`, json, 'utf8', function (err) {
        if (err) return console.log(err);
    });
}

function getWifs() {
    if (!fs.existsSync(`derivedWifs.json`)) {
        return null
    }
    return JSON.parse(fs.readFileSync(`derivedWifs.json`, 'utf8'))
}

function getXPrv(node) {
    return node.toBase58()
}

function deriveKeyPairFromRoot(root, path) {
    return root.derivePath(path)
}

module.exports = createKeysService;