import React from 'react';
import * as utils from '../utils';
import config from '../config';

class UTXO extends React.Component {
  constructor(props) {
    super(props);
    this.getActionButtons = this.getActionButtons.bind(this);
    this.signTx = this.signTx.bind(this);
    this.sendToOwner = this.sendToOwner.bind(this);
    this.sendToHeir = this.sendToHeir.bind(this);
  }

  getActionButtons(actions){
    const signers = {
      signTx: <button onClick={this.signTx}>Sign intermediate tx</button>,
      sendToOwner: <button onClick={this.sendToOwner}>Widthraw to owner</button>,
      sendToHeir: <button onClick={this.sendToHeir}>Widthraw to heir</button>
    };

    return actions.map((dest, index) => {
      return signers[dest] ? <div key={index}>{ signers[dest] }</div>: '';
    })
  }

  signTx(){
    const { network } = config;
    const txData = utils.signTx({
      childOwner: utils.getHDClild(config.owner.mnemonic, config.owner.derivationPath, network),
      childHeir: utils.getHDClild(config.heir.mnemonic, config.heir.derivationPath, network),
      txid: this.props.utxo.transaction_hash,
      output: this.props.utxo.index,
      amount: this.props.utxo.value,
      fee: 1000,
      sequenceFeed: { blocks: 5 },
      network
    });

    this.props.signTx(txData);
  }

  sendToOwner(){
    const { network } = config;
    console.log(utils.signToOwner({
      childOwner: utils.getHDClild(config.owner.mnemonic, config.owner.derivationPath, network),
      childHeir: utils.getHDClild(config.heir.mnemonic, config.heir.derivationPath, network),
      redeemScript: this.props.utxo.redeemScript,
      txid: this.props.utxo.transaction_hash,
      output: this.props.utxo.index,
      amount: this.props.utxo.value,
      fee: 1000,
      network
    }));
  }

  sendToHeir(){
    alert('sendToHeir')
  }

  render(){
    return (<div style={{ wordWrap: "break-word" }}>
      <p><strong>UTXO {this.props.index + 1}</strong></p>
      <span>Transaction hash: {this.props.utxo.transaction_hash}</span><br/>
      <span>Index: {this.props.utxo.index}</span><br/>
      <span>Value: {this.props.utxo.value / (10**8) + ' BTC'}</span><br/><br/>
      { this.getActionButtons(this.props.actions) }<br/><br/>
    </div>)
  }
}

export default UTXO;