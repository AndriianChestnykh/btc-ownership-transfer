import * as bitcoin from 'bitcoinjs-lib';
import * as bip32 from 'bip32';
import * as bip39 from 'bip39';
import bip68 from "bip68";
import config from "./config";
import bs58check from 'bs58check';

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

function signToOwner(data){
  const { childOwner, /*childHeir,*/ redeemScript, txid, output, amount, fee, network } = data;
  const p2sh = bitcoin.payments.p2sh({
    redeem: {
      output: redeemScript,
    },
    network,
  });
  const owner = bitcoin.payments.p2pkh({pubkey: childOwner.publicKey, network });

  const tx = new bitcoin.Transaction();
  tx.version = 2;
  tx.addInput(Buffer.from(txid, 'hex').reverse(), output);  // no sequence is here
  tx.addOutput(bitcoin.address.toOutputScript(owner.address, network), amount - fee);

  const signatureHash = tx.hashForSignature(
      0,
      p2sh.redeem.output,
      bitcoin.Transaction.SIGHASH_ALL
  );
  const ownerECPair = bitcoin.ECPair.fromPrivateKey(childOwner.privateKey, {
    compressed: true,
    network
  });
  const redeemScriptSig = bitcoin.payments.p2sh({
    network,
    redeem: {
      network,
      output: p2sh.redeem.output,
      input: bitcoin.script.compile([
      bitcoin.script.signature.encode(
        ownerECPair.sign(signatureHash),
        bitcoin.Transaction.SIGHASH_ALL,
      ),
      bitcoin.opcodes.OP_TRUE,
    ]),
  },
  }).input;
  tx.setInputScript(0, redeemScriptSig);

  alert(JSON.stringify(tx));
}

function validateAddress(address) {
  let message;
  let isValid = false;
  try{
    isValid = bs58check.decode(address).length === 21;
    message = isValid ? '': 'Wrong address length';
  } catch (e){
    message = 'Error decoding base58check: ' + e.message;
  }
  return {
    isValid,
    message
  }
}

export { csvCheckSigOutput, getHDClild, signInheritanceTx, signToOwner, validateAddress };