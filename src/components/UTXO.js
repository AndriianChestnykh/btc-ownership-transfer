import React from 'react';
import { getRedeemScript, getHDClild, signInheritanceTx } from '../utils';
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
    const sequenceFeed = { blocks: 5 };
    const txid = this.props.utxo.transaction_hash;
    const output = this.props.utxo.index;
    const amount = this.props.utxo.value;
    const fee = 1000;
    const tx = signInheritanceTx({ childOwner, childHeir, txid, output, amount, fee, sequenceFeed, network });
    // const redeemScript = getRedeemScript(owner, heir, sequenceFeed);

    this.props.addInheritanceTx(tx);
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