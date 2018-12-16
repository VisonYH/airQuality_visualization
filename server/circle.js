var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    port:3306,
    database:'air_quality',
    multipleStatements: true
});

router.post('/data', function(req, res) {
  let params = req.body;
  let {type, timeScale, time, spaceScale, address} = params;
  let sql = '';
  let tableName = formatTableName(time, timeScale);
  let nextSS = nextSpaceScale(spaceScale)
  if (spaceScale === 'all') {
    sql = `SELECT ${nextSS} as label, AVG(value) as value, date FROM ${tableName} WHERE type='${type}' GROUP BY ${nextSS},date; `
  } else {
    sql = `SELECT ${nextSS} as label, AVG(value) as value, date FROM ${tableName} WHERE type='${type}' AND ${spaceScale}='${address}' GROUP BY ${nextSS},date; `
  }
  connection.query(sql, (err, result) => {
    res.json(formateRes(result))
  })
})

router.post('/update', (req, res) => {
  let params = req.body;
  let {type, time, space, spaceScale} = params;
  let sql = '';
  let timeScale = getTimeScale(time);
  console.log(time, timeScale)
  let nextSS = nextSpaceScale(spaceScale)
  if (timeScale !== 'day' && timeScale !== 'hour') {
    let tableName = formatTableName(time, timeScale);
    console.log(type, time, timeScale, space, tableName);
    sql = `SELECT ${nextSS} as label, AVG(value) as value, date FROM ${tableName} WHERE type='${type}' AND ${nextSS}='${space}' GROUP BY date; `
    connection.query(sql, (err, result) => {
      console.log(result)
      res.json(result)
    })
  } else {
    console.log(type, time, timeScale, space);
    getTables(connection, nextSS, space, function (tables) {
      let sql = ''
      tables.forEach(table => {
        sql += `SELECT ${nextSS} as label, AVG(value) as value, date, hour FROM ${table} WHERE type='${type}' AND date='${time}' AND ${nextSS}='${space}' GROUP BY hour;`
      })
      connection.query(sql, (err, result) => {
        result = flatten(result)
        let obj = {}
        result.forEach(item => {
          if (!obj[item.hour]) {
            obj[item.hour] = [item.value]
          } else {
            obj[item.hour].push(item.value)
          }
        })
        let rr = []
        for(let i in obj) {
          obj[i] = obj[i].reduce((a, b) => a + b) / obj[i].length
          let hour = i.length === 1 ? '0' + i : i
          rr.push({
            date: time + hour,
            label: space,
            value: obj[i]
          })
        }
        console.log(rr)
        res.json(rr)
      })
    })
  }
})
module.exports = router

function getTimeScale (time) {
  console.log(time.length)
  if (time.length === 6) {
    return 'month'
  } else if (time.length === 8) {
    return 'day'
  } else if (time.length === 4) {
    return 'year'
  } else {
    return 'hour'
  }
}
function formatTableName (time, timeScale) {
  let tableName
  if (timeScale === 'year') {
    tableName = time + 'y'
  } else if (timeScale === 'month') {
    tableName = time + 'm'
  } else if (timeScale === 'day') {
    tableName = time.substring(0, 6) + 'm'
  }
  return tableName
}

function nextSpaceScale (spaceScale) {
  if (spaceScale === 'all') {
    return 'province'
  } else if (spaceScale === 'province') {
    return 'city'
  } else {
    return 'stationId'
  }
}

function formateRes (result) {
  let obj = {};
  result.forEach(item => {
    if (!obj[item.label]) {
      obj[item.label] = [{
        value: item.value,
        date: item.date
      }]
    } else {
      obj[item.label].push({
        value: item.value,
        date: item.date
      })
    }
  })
  return obj
}

function getTables(connection, spaceScale, address, callback) {
  let sqlForTables;
  let tables = [];
  if (spaceScale === 'all') {
    sqlForTables = `SELECT stationId from station;`
  } else {
    sqlForTables = `SELECT stationId from station WHERE ${spaceScale}='${address}'`
  }
  connection.query(sqlForTables, (err, res) => {
    tables = res.map(item => item.stationId);
    callback(tables)
  })
}

function flatten (arr) {
  let res = []
  for (let item in arr) {
      if (arr[item] instanceof Array) {
          let re = flatten(arr[item]);
          res = res.concat(re)
      } else {
          res.push(arr[item])
      }
  }
  return res;
}
