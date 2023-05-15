const Web3 = require('web3');
const web3 = new Web3('https://rpc-mumbai.maticvigil.com/');

const account = web3.eth.accounts.create();
console.log(account.address); // 作成されたアカウントのアドレス
console.log(account.privateKey); // 作成されたアカウントの秘密鍵
