import React from 'react';
import UTXO from './UTXO';
import axios from 'axios';
import config from '../config';
import PropTypes from 'prop-types';
import * as utils from '../utils';

class AddressUTXOList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      utxos: []
    };
  }

  componentDidMount() {
    this.updateUTXOList(this.props.address);
  }

  async updateUTXOList(address){
    if (!utils.validateAddress(this.props.address).isValid) return;
    const uri = `${config.apiURIs.address}/${address}`;
    const response = await axios.get(uri)
      .catch(error => alert('Blockchain API request error: ' + error));
    this.setState({ utxos: response.data.data[address].utxo });
  }

  getAllUtxo(){
    const utxos = this.state.utxos;
    return (utxos && utxos.length
      ? utxos.map((utxo, index) => (<UTXO key={index}
                                          index={index}
                                          utxo={utxo}
                                          redeem={this.props.redeem}
                                          actions={this.props.actions}/>))
      : <div>Empty...</div>);
  }

  getHeader(){
    const validateAddressResult = utils.validateAddress(this.props.address);
    return validateAddressResult.isValid
      ? <div style={{ wordWrap: "break-word" }}><h4>{this.props.address}</h4><p>Redeem: {this.props.redeem}</p></div>
      : <h4>Address is not valid: {validateAddressResult.message}</h4>;
  }

  render(){
    return (<div className="content">
      {this.getHeader()}
      {this.getAllUtxo()}
    </div>)
  }
}

AddressUTXOList.propTypes = {
  address: PropTypes.string.isRequired
};

export default AddressUTXOList;