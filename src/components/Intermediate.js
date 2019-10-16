import React from 'react';
import AddressUTXOList from "./AddressUTXOList";

class Intermediate extends React.Component{
  getAddressUtxoLists() {
    return this.props.addressesData.map((data, index) => (<AddressUTXOList key={index}
                                                                          address={data.address}
                                                                          redeem={data.redeem}
                                                                          actions={this.props.actions}/>))
  }

  // 2MyhmXWCppJMQH1ui42J7jF4iw4j5aPufHU
  render(){
    return (<div className="ui card">
      <div className="content">
        <div className="header">Intermediate addresses</div>
      </div>
      {this.getAddressUtxoLists()}
    </div>)
  }
}

export default Intermediate;