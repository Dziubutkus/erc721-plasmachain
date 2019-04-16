import Web3 from 'web3';

const web3Provider = window.web3 ? window.web3.currentProvider : null;

const web3 = web3Provider
    ? new Web3(web3Provider)
    : new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/aef1483094d34971a33968ea7819f8c1'));

web3.eth.defaultAccount = web3.eth.accounts[0];

export default web3;