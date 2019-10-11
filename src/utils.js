import * as bitcoin from 'bitcoinjs-lib';
import * as bip32 from 'bip32';
import * as bip39 from 'bip39';
import bip68 from "bip68";
import config from "./config";

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

function signInheritanceTx(data) {
  const { childOwner, childHeir, txid, output, amount, fee, sequenceFeed, network } = data;
  const owner = bitcoin.payments.p2pkh({pubkey: childOwner.publicKey, network });
  const heir = bitcoin.payments.p2pkh({pubkey: childHeir.publicKey, network });

  const sequence = bip68.encode(sequenceFeed);
  const redeemScript = csvCheckSigOutput(owner, heir, sequence);
  const p2sh = bitcoin.payments.p2sh({
    redeem: {
      output: redeemScript,
    },
    network: config.network,
  });

  const txb = new bitcoin.TransactionBuilder(network);
  txb.addInput(txid, output);
  txb.addOutput(p2sh.address, amount - fee);
  const ownerECPair = bitcoin.ECPair.fromPrivateKey(childOwner.privateKey, {
    compressed: true,
    network
  });
  txb.sign(0, ownerECPair);
  const tx = txb.build();

  return {
    rawTx: tx.toHex(),
    txid: tx.getId(),
    redeemScript: redeemScript.toString('hex'),
    lockPeriod: sequenceFeed,
    address: p2sh.address
  };
}

export { csvCheckSigOutput, getHDClild, signInheritanceTx };