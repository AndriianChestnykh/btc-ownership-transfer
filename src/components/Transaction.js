import React from 'react';

class Transaction extends React.Component {
  formatInhTx(tx) {
    return JSON.stringify(tx);
  }

  render() {
    return (<div>
      <p>Transaction:</p>
      <p>{this.formatInhTx(this.props.tx)}</p>
    </div>);
  }
}

export default Transaction;