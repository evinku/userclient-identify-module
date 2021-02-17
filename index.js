let bip32 = require('bip32');
let bitcoin = require('bitcoinjs-lib');
let crypto = require('crypto')

const keyPair = bitcoin.ECPair.makeRandom;

const seed = '0000000000000000000000000000000000000000000000000000000000000001';

let node = bip32.fromBase58(
  'xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi'
);


let child = node.derivePath('m/0/0');

bitcoin.ECPair.makeRandom();
//console.log(keyPair.privateKey.toString('hex'))

const path = "m/0/0/0";
const root = bip32.fromSeed(crypto.randomBytes(64));

const child1 = root.derivePath(path);

console.log(child)

const adress = bitcoin.payments.p2pkh({ pubkey: root.publicKey }).address

console.log(adress)

child1.privateKey

console.log(root.privateKey.toString('hex'));


const xprv = root.toBase58()
const xpub = root.neutered().toBase58()

console.log(root.publicKey.toString('hex'))
console.log(bip32.fromBase58(xpub).publicKey.toString('hex'))


console.log(root.toBase58());

console.log(crypto.randomBytes(16)) ///128-bits === 16-bytes |  512-bits === 64-bytes





// function getAddress(node: any, network?: any): string {
//   return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address!;
// }
