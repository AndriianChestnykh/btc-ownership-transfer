import React from 'react';
import UTXO from './UTXO';
import axios from 'axios';
import config from '../config';
import PropTypes from 'prop-types';
import * as utils from '../utils';

class AddressUTXOList extends React.Component{
  constructor(props) {
    super(props);
    this.loadingUTXOs = false;
    this.state = {
      needToRerenderUTXOs: false,
      utxos: []
    };
  }

  componentDidMount() {
    this.updateUTXOList(this.props.address);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.address !== this.props.address) {
      this.updateUTXOList(nextProps.address);
      return true;
    }
    return nextState.needToRerenderUTXOs;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevState && this.state.needToRerenderUTXOs) this.setState({ needToRerenderUTXOs: false });
  }

  async updateUTXOList(address) {
    if (!utils.validateAddress(address).isValid) return;
    this.loadingUTXOs = true;
    const uri = `${config.apiURIs.address}/${address}`;
    const response = await axios.get(uri)
      .catch(error => alert('Blockchain API request error: ' + error));
    console.log(`Fetching for ${address}`);
    this.loadingUTXOs = false;
    this.setState({ needToRerenderUTXOs: true, utxos: response.data.data[address].utxo });
  }

  getAllUtxo(){
    if (!this.loadingUTXOs) {
      const utxos = this.state.utxos;
      return (utxos.length
        ? utxos.map((utxo, index) => (<UTXO key={index}
                                            index={index}
                                            utxo={utxo}
                                            redeem={this.props.redeem}
                                            actions={this.props.actions}/>))
        : <div>No UTXOs</div>);
    } else {
      return <div>Loading...</div>
    }
  }

  getHeader(){
    const validateAddressResult = utils.validateAddress(this.props.address);
    return validateAddressResult.isValid
      ? <div style={{ wordWrap: "break-word" }}><h4>{this.props.address}</h4><p>Redeem: {this.props.redeem}</p><br/></div>
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