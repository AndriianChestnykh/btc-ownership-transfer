import React from 'react';

class Transaction extends React.Component {
  constructor(props){
    super(props);
    this.broadcast = this.broadcast.bind(this);
  }

  formatTx(tx) {
    return tx.raw;
  }

  broadcast(){
    alert('Will broadcast ' + this.props.tx.txid);
  }

  render() {
    return (<div className="content" style={{ wordWrap: "break-word" }}>
      <h4>Txid: {this.props.tx.id}</h4>
      <p>{this.formatTx(this.props.tx)}</p>
      <p><button onClick={this.broadcast}>Broadcast</button></p>
    </div>);
  }
}

export default Transaction;