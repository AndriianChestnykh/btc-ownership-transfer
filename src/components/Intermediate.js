import React from 'react';
import AddressUTXOList from "./AddressUTXOList";

class Intermediate extends React.Component{
  render(){
    return (<div className="ui card">
      <div className="content">
        <div className="header">Intermediate addresses</div>
      </div>
      {/*2MyhmXWCppJMQH1ui42J7jF4iw4j5aPufHU*/}
      {this.props.addresses.map((address, index) => (<AddressUTXOList key={index}
                                                                      address={address}
                                                                      actions={['sendToOwner', 'sendToHeir']}/>))}
    </div>)
  }
}

export default Intermediate;