import React from 'react';
import AddressUTXOList from "./AddressUTXOList";

class Intermediate extends React.Component{
  getIntermediateAddresses(txs){
    return txs.map(tx => tx.address)
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  render(){
    const addresses = this.getIntermediateAddresses(this.props.txs);
    console.log(this.props.txs);
    console.log(addresses);
    return <div>
      <h3>Intermediate addresses</h3>
      {addresses.map((address, index) => <AddressUTXOList key={index} address={address}/>)} {/*2MyhmXWCppJMQH1ui42J7jF4iw4j5aPufHU*/}
    </div>
  }
}

export default Intermediate;