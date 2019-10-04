import * as bitcoin from 'bitcoinjs-lib';
import * as bip32 from 'bip32';
import * as bip39 from 'bip39';

function csvCheckSigOutput(_alice, _bob, sequence){
  const sequenceHex = bitcoin.script.number.encode(sequence).toString('hex');
  const alicePubHex = _alice.pubkey.toString('hex');
  const bobPubHex = _bob.pubkey.toString('hex');
  return bitcoin.script.fromASM(
    `
      OP_IF
        ${alicePubHex}
        OP_CHECKSIG
      OP_ELSE
        ${sequenceHex}
        OP_CHECKSEQUENCEVERIFY
        OP_DROP
        ${bobPubHex}
        OP_CHECKSIG
      OP_ENDIF
    `
    .trim()
    .replace(/\s+/g, ' ')
  )
}

function getHDClild(mnemonic, derivationPath, network){
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed);
  return root.derivePath(derivationPath);
}

export { csvCheckSigOutput, getHDClild };