import React from 'react';
import { csvCheckSigOutput, getHDClild } from '../utils';
import * as bitcoin from 'bitcoinjs-lib';
import bip68 from 'bip68';
import config from '../config';

class UTXO extends React.Component {
  constructor(props) {
    super(props);
    this.signTx = this.signTx.bind(this);
  }

  signTx(){
    const { network } = config;

    const childOwner = getHDClild(config.owner.mnemonic, config.owner.derivationPath, network);
    const childHeir = getHDClild(config.heir.mnemonic, config.heir.derivationPath, network);

    const owner = bitcoin.payments.p2pkh({pubkey: childOwner.publicKey, network });
    const heir = bitcoin.payments.p2pkh({pubkey: childHeir.publicKey, network });

    const sequence = bip68.encode({ blocks: 5 });
    const p2sh = bitcoin.payments.p2sh({
      redeem: {
        output: csvCheckSigOutput(owner, heir, sequence),
      },
      network: config.network,
    });

    console.log('p2sh: ', p2sh);
  }

  render(){
    return (<div>
      <p><strong>utxo {this.props.index + 1}</strong></p>
      <span>Transaction hash: {this.props.utxo.transaction_hash}</span><br/>
      <span>Index: {this.props.utxo.index}</span><br/>
      <span>Value: {this.props.utxo.value / (10**8) + ' BTC'}</span><br/><br/>
      <button onClick={this.signTx}>Sign</button>
    </div>)
  }
}

export default UTXO;