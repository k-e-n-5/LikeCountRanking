console.log('start');

const Web3 = require('web3');
const JSToken = require('../contracts/JSToken.json');
const mysql = require('mysql');
const connection = mysql.createConnection({
  user: 'root',
  password: 'password',
  database: 'dbtest'
});
const web3 = new Web3('https://rpc-mumbai.maticvigil.com/'); // ノードに接続
const contractAddress = '0x0F58e8A426642f93821EFB30246A2C372bf55481'; // コントラクトのアドレス
const contractInstance = new web3.eth.Contract(JSToken, contractAddress); // コントラクトのインスタンスを作成
const fromAccountPVKey = '0444531611a3adf58965f04b4601fb01bc6ec6449d2447ecec9d97196112fa52'; // トークン発行者の秘密鍵
const fromAccount = web3.eth.accounts.privateKeyToAccount(fromAccountPVKey).address;
const amount = 1; // トークンの数量
var receiptAccount = '';

// 非同期関数
async function executeQuery() {
  return new Promise((resolve, reject) => {
    // トークン発行フラグが0のレコードを取得する
    connection.query('SELECT * FROM PostMessage WHERE tokenFlg = 0', async function (error, results, fields) {
      if (error) reject(error);

      // 取得したレコードをループ処理して処理を行う
      for (let i = 0; i < results.length; i++) {
        const aRecord = results[i];
        const aRecordKey = aRecord.postUser;

        await new Promise((resolve, reject) => {
          // 投稿者がUsersテーブルに登録されているか確認する
          connection.query(`SELECT * FROM Users WHERE user = '${aRecordKey}'`, async function (error, results, fields) {
            if (error) reject(error);

            const bRecord = [];

            // Usersテーブルに存在する場合の処理
            if (results.length > 0) {
              bRecord = results[0];
              const receiptAccount = bRecord.wallet;
              console.log(receiptAccount + "に処理を行います。");
            } else {
              // Usersテーブルに存在しない場合の処理
              const createAccount = require('./makeWallet.js');
              try {
                const receiptAccount = await createAccount(aRecordKey);
                console.log(receiptAccount + "に処理を行います。");
              } catch (error) {
                reject(error);
              }
            }
            // トークン発行処理
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

                  // tokenFlg更新
                  updateTokenFlag(bRecord.postId).then(() => {
                    resolve();
                  }).catch((error) => {
                    reject(`Failed to update tokenFlg: ${error}`);
                  });
                });
              }).catch((error) => {
                reject(`Failed to mint tokens: ${error}`);
              });
            });
            resolve(); // レコードの処理が完了したことを通知
          });
        });
      }
      resolve(); // 全てのレコードの処理が完了したことを通知
    });
  });
}

// tokenFlg更新
async function updateTokenFlag(recordId) {
  return new Promise((resolve, reject) => {
    connection.query(`UPDATE PostMessage SET tokenFlg = 1 WHERE id = ${recordId}`, function (error, results, fields) {
      if (error) reject(error);
      resolve();
    });
  });
}
// 非同期関数を呼び出し、完了後に接続を終了する
executeQuery()
  .then(() => {
    connection.end();
    console.log('終了');
    process.exit();
  })
  .catch((error) => {
    connection.end();
    console.error(error);
    process.exit();
  });
  