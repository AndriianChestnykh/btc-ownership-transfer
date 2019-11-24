import React from 'react';
import AddressUTXOList from "./AddressUTXOList";

class Intermediate extends React.Component{
  getAddressUtxoLists() {
    return this.props.addressesData.map((data, index) => (<AddressUTXOList key={index}
                                                                          address={data.address}
                                                                          redeem={data.redeem}
                                                                          info={data.info}
                                                                          actions={this.props.actions}
                                                                          blocks={this.props.blocks}
                                                                          statsTime={this.props.statsTime}
                                                                          owner={this.props.owner}
                                                                          heir={this.props.heir}
    />))
  }

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