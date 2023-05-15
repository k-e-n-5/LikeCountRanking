console.log('start');

const Web3 = require('web3');
const JSToken = require('../contracts/JSToken.json');

const web3 = new Web3('https://rpc-mumbai.maticvigil.com/'); // ノードに接続
const contractAddress = '0x0F58e8A426642f93821EFB30246A2C372bf55481'; // コントラクトのアドレス
const contractInstance = new web3.eth.Contract(JSToken, contractAddress); // コントラクトのインスタンスを作成

//const fromAccount = '0x8F5E6BAFA7bbaF1Ebe4CfB6Be3Ffc236AD252A8c'; // トークンを発行するためのアドレス
const fromAccountPVKey = '0444531611a3adf58965f04b4601fb01bc6ec6449d2447ecec9d97196112fa52'; // トークン発行者の秘密鍵
const fromAccount = web3.eth.accounts.privateKeyToAccount(fromAccountPVKey).address;
const receiptAccount = '0x7D53b7c9FdE2889Bef30dd8feD658AF114ed050c'; // トークンを受け取るアドレス
const amount = 1; // トークンの数量

console.log(fromAccount);

web3.eth.getTransactionCount(fromAccount).then((nonce) => {
    const data = contractInstance.methods.mint(receiptAccount, web3.utils.toWei(amount.toString(), 'ether')).encodeABI();
    const tx = {
      nonce: nonce,
      gasPrice: web3.utils.toWei('10', 'gwei'),
      gasLimit: 300000,
      to: contractAddress,
      //value: web3.utils.toWei(amount.toString(), 'ether'),
      value: 0,
      data: data,
      from: fromAccount,
    };
    web3.eth.accounts.signTransaction(tx, fromAccountPVKey).then((signedTx) => {
      web3.eth.sendSignedTransaction(signedTx.rawTransaction).on('receipt', (receipt) => {
        console.log(`Transaction hash: ${receipt.transactionHash}`);
      });
    }).catch((error) => {
      console.error(`Failed to mint tokens: ${error}`);
    });
  });

console.log('end');
