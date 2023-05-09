const express = require('express');
const app = express();
const port = 3001;

const mysql = require('mysql');
const con = mysql.createConnection({
  host: 'localhost',
  user: 'maria',
  password: 'password',
  database: 'dbtest'
});

app.use(express.json());

app.get('/',(req, res) => {
  res.send('Hello World');
});

app.get('/dbTest', (req, res) => {
  con.query('SELECT * FROM test0001', function (err, rows, fields) {
    if(err){console.log('err: ' + err);}
    res.json({dbData:rows});
    console.log(rows);
  });
});

app.get('/test', (req, res) => {
  con.query('SELECT * FROM test0001', function (err, rows, fields) {
    if(err){console.log('err: ' + err);}
    res.json({test:
      {"id": rows[0].id, "name":rows[0].name}
    });
  });
});

app.get('/api', (req, res) => {
  res.json({message: "Hello World!"});

  //con.query('SELECT * FROM test0001', function (err, rows, fields) {
    //if(err){console.log('err: ' + err);}
    //res.json(
      //{message: rows[1].name}
    //);
  //});
});

app.post('/login', (req, res) => {
  console.log(req.body);
  console.log('SELECT name FROM test0001 WHERE name = \'' + req.body.name.user + '\'');
  con.query('SELECT name FROM test0001 WHERE name = \'' + req.body.name.user + '\'' ,
  function (err, rows, fields) {
    if (err) {console.log('err:' + err);}
	  console.log(rows);
    if (rows.kength == 1) {console.log('0件')}
    res.json(
      {isExist: rows[0].name}
    );
  });
});

app.listen(port, () => {
  console.log(`listening on *:${port}`);
});
