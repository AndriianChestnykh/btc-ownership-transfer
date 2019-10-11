import React from 'react';

class Transaction extends React.Component {
  constructor(props){
    super(props);
    this.broadcast = this.broadcast.bind(this);
  }

  formatInhTx(tx) {
    return JSON.stringify(tx);
  }

  broadcast(){
    alert('Will broadcast ' + this.props.tx.txid);
  }

  render() {
    return (<div>
      <p>Transaction:</p>
      <p>{this.formatInhTx(this.props.tx)}</p>
      <button onClick={this.broadcast}>Broadcast</button>
    </div>);
  }
}

export default Transaction;