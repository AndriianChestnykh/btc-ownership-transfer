import React from 'react';
import AddressUTXOList from "./AddressUTXOList";

class Intermediate extends React.Component{
  getAddressUtxoLists() {
    return this.props.addresses.map((address, index) => (<AddressUTXOList key={index}
                                                                          address={address}
                                                                          actions={['sendToOwner', 'sendToHeir']}/>))
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