var express = require('express');
var router = express.Router();
const fs = require('fs');
var mysql = require('mysql');
const utils = require('./utils');
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    port:3306,
    database:'air_quality',
    multipleStatements: true
});

connection.connect(function(err){
    if(err){
        console.log("链接失败");
        throw(err)
    } else {
        console.log("链接成功");
    }
})

router.get('/', function(req, res) {
  let type = req.query.type;
  let space = req.query.space;
  // let sql = `SELECT DISTINCT stationName FROM station WHERE city='${req.params.city}'`;
  let tablenameSql = "select table_name from information_schema.tables where table_schema='air_quality' AND table_name LIKE '%m';"
  connection.query(tablenameSql, (err, result) => {
    let monthTable = [];
    result = result.forEach(item => {
      monthTable.push(item['TABLE_NAME'])
    });
    let sql = '';
    monthTable.forEach(month => {
      sql += `select date, AVG(value) as value from ${month} where type='${type}' AND province='${space}' GROUP BY date;`
    })
    console.log('++++++++++', sql)
    connection.query(sql, (err, res2) => {
      if (err) {
        throw err;
      }
      res2 = utils.flatten(res2);
      let json = {};
      res2.forEach(item => {
        json[item.date] = item.value
      })
      res.setHeader('max-age', 640000)
      res.json(json);
    });

  })
})

module.exports = router
