let bip32 = require('bip32');
let bitcoin = require('bitcoinjs-lib');
let crypto = require('crypto')


function createRootMasterPair() {
    // const randomSeed = crypto.randomBytes(16) //128-bits === 16-bytes |  512-bits === 64-bytes
    const seed = Buffer.from('000102030405060708090a0b0c0d0e0f', 'hex')
    const root = bip32.fromSeed(seed);

    root.toWIF()

    return root
}

function getXPub(root) {
    return root.neutered().toBase58()
}

function getXPrv(root) {
    return root.toBase58()
}

function getRootPrivateKey(root) {
    return root.privateKey.toString('hex')
}

function getRootPublicKey(root) {
    return root.publicKey.toString('hex')
}



function deriveChildKeyPair(root, path) {

    const child = root.derivePath(path)

    return child
}



const root = createRootMasterPair()

const child = deriveChildKeyPair(root, "m/0'/1")


const xPub = getXPub(child)
console.log(xPub)

