const Web3 = require('web3');
const web3 = new Web3('https://rpc-mumbai.maticvigil.com/');
const mysql = require('mysql');
const connection = mysql.createConnection({
    user: 'root',
    password: 'password',
    database: 'dbtest'
});

async function createAccount(user) {
  //const account = web3.eth.accounts.create();
  //console.log(account.address); // 作成されたアカウントのアドレス
  //console.log(account.privateKey); // 作成されたアカウントの秘密鍵

  try {
    // 非同期処理を実行するためにPromiseを使用する
    return new Promise((resolve, reject) => {
      //const query = `INSERT INTO users (username) VALUES ('${user}')`;
      const query = `INSERT INTO Users VALUES ('${user}','TEST','test')`;
      connection.query(query, (error, results, fields) => {
        if (error) {
          reject(error); // エラーが発生した場合はrejectを呼び出してPromiseを失敗させる
        } else {
          resolve(user); // 更新が成功した場合はresolveを呼び出してPromiseを解決する
        }
      });
    });

  } catch (error) {
    throw error;
  }
}
  
module.exports = createAccount;
  
  
  