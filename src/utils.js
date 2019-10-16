import * as bitcoin from 'bitcoinjs-lib';
import * as bip32 from 'bip32';
import * as bip39 from 'bip39';
import bip68 from "bip68";
import config from "./config";
import bs58check from 'bs58check';
import axios from "axios";

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

function getHDChild(mnemonic, derivationPath, network){
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const child = bip32.fromSeed(seed).derivePath(derivationPath);
  const address = bitcoin.payments.p2pkh({pubkey: child.publicKey, network}).address;
  return { child, address, publicKey: child.publicKey };
}

function signTx(data) {
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
    raw: tx.toHex(),
    id: tx.getId(),
    redeem: redeemScript.toString('hex'),
    lockFeed: sequenceFeed,
    address: p2sh.address
  };
}

function signToOwner(data){
  return signCsvOutput(true, data);
}

function signToHeir(data){
  return signCsvOutput(false, data);
}

function signCsvOutput(isOwner, data){
  const { childPerson, redeemScript, txid, output, amount, fee, network, sequenceFeed } = data;
  const p2sh = bitcoin.payments.p2sh({
    redeem: {
      output: redeemScript,
    },
    network,
  });
  const person = bitcoin.payments.p2pkh({pubkey: childPerson.publicKey, network });

  const tx = new bitcoin.Transaction();
  tx.version = 2;
  isOwner
    ? tx.addInput(Buffer.from(txid, 'hex').reverse(), output)
    : tx.addInput(Buffer.from(txid, 'hex').reverse(), output, bip68.encode(sequenceFeed));
  tx.addOutput(bitcoin.address.toOutputScript(person.address, network), amount - fee);

  const signatureHash = tx.hashForSignature(
      0,
      p2sh.redeem.output,
      bitcoin.Transaction.SIGHASH_ALL
  );
  const personECPair = bitcoin.ECPair.fromPrivateKey(childPerson.privateKey, {
    compressed: true,
    network
  });
  const preRedeemOpcode = isOwner ? bitcoin.opcodes.OP_TRUE: bitcoin.opcodes.OP_0;

  const redeemScriptSig = bitcoin.payments.p2sh({
    network,
    redeem: {
      network,
      output: p2sh.redeem.output,
      input: bitcoin.script.compile([
      bitcoin.script.signature.encode(
        personECPair.sign(signatureHash),
        bitcoin.Transaction.SIGHASH_ALL,
      ),
      preRedeemOpcode,
    ]),
  },
  }).input;
  tx.setInputScript(0, redeemScriptSig);
  return tx;
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

async function broadcastTx(tx){
  const uri = config.apiURIs.pushTx;
  const response = await axios.post(uri, { data: tx }, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    }
  })
    .catch(error => alert('Blockchain API request error: ' + error));
  if (response) alert('Broadcasted with message: ' + JSON.stringify(response));
}

export { csvCheckSigOutput, getHDChild, signTx, signToOwner, signToHeir, validateAddress, broadcastTx };