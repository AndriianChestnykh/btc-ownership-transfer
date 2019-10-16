import React from 'react';
import * as utils from "../utils";

class Transaction extends React.Component {
  render() {
    return (<div className="content" style={{ wordWrap: "break-word" }}>
      <h4>Txid: {this.props.tx.id}</h4>
      <p>{this.props.tx.raw}</p>
      <p><button onClick={() => utils.broadcastTx(this.props.tx.raw)}>Broadcast</button></p>
    </div>);
  }
}

export default Transaction;