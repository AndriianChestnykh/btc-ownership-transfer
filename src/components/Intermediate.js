import React from 'react';
import AddressUTXOList from "./AddressUTXOList";

class Intermediate extends React.Component{
  render(){
    return <div>
      <h3>Intermediate addresses</h3>
      {/*2MyhmXWCppJMQH1ui42J7jF4iw4j5aPufHU*/}
      {this.props.addresses.map((address, index) => (<AddressUTXOList key={index}
                                                                      address={address}
                                                                      actions={['sendToOwner', 'sendToHeir']}/>))}
    </div>
  }
}

export default Intermediate;