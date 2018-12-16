

exports.getStation = function (spaceScale, address, connection, callback) {
  let sql =  spaceScale !== 'all' ? `SELECT s.* FROM station as s WHERE ${spaceScale}='${address}'` : `SELECT * FROM station`;
  if (spaceScale === 'all') {
    sql = `SELECT GROUP_CONCAT(stationId) as stations, province FROM station GROUP BY province;`
  } else if (spaceScale === 'province') {
    sql = `SELECT GROUP_CONCAT(stationId) as stations, city FROM station WHERE province='${address}' GROUP BY city;`
  } else if (spaceScale === 'city') {
    sql = `SELECT stationId as stations, city FROM station WHERE city='${address}'`
  }
  connection.query(sql, (err, result) => {
    let stations = [];
    result.forEach(item => {stations.push(item.stationId)})
    callback(stations)
  })
},
exports.getStationData = function (connection, type, spaceScale, address, timeScale, time, XVar, callback) {
  console.log(type, spaceScale, address, timeScale, time, XVar);
  let sql = ''
  if (timeScale !== 'hour') {
    let tableName = formatTableName(time, timeScale);
    XVar = formatX(XVar, spaceScale, timeScale);
    if (timeScale !== 'day') {
      if (spaceScale === 'all') {
        sql = `SELECT AVG(value) AS value, ${XVar} FROM ${tableName} GROUP BY ${XVar};`
      } else {
        sql = `SELECT AVG(value) AS value, ${XVar} FROM ${tableName} WHERE ${spaceScale}='${address}' GROUP BY ${XVar};`
      }
      // console.log(sql)
      connection.query(sql, function(err, result) {
        result.map(item => {
          item.value = Math.round(item.value);
          return item;
        })
        callback(result);
      })
    } else {
      getTables(connection, spaceScale, address, function(tables) {
        if (spaceScale === 'all') {
          for(let table of tables) {
            sql += `SELECT value, ${XVar} FROM ${table} WHERE type='${type}' AND date='${time}';`
          }
        } else {
          for(let table of tables) {
            sql += `SELECT value, ${XVar} FROM ${table} WHERE type='${type}' AND date='${time}';`
          }
        }
        // console.log(sql)
        connection.query(sql, function(err, result) {
          result = catgorifyH(result, 'address')
          callback(result);
        })
      })
    }

  } else if (timeScale === 'hour') {
    let hour = parseInt(time.substring(8, 10));
    time = time.slice(0, 8);
    getTables(connection, spaceScale, address, function(tables) {
      XVar = formatX(XVar, spaceScale);
      if (spaceScale === 'all') {
        for(let table of tables) {
          sql += `SELECT value, ${XVar} FROM ${table} WHERE type='${type}' AND hour='${hour}' AND date='${time}';`
        }
      } else {
        for(let table of tables) {
          sql += `SELECT value, ${XVar} FROM ${table} WHERE type='${type}' AND hour='${hour}' AND ${spaceScale}='${address}' AND date='${time}';`
        }
      }
      connection.query(sql, function(err, result) {
        result = result.filter(item => {
          return item.length
        })
        result = catgorifyH(result, 'address')
        callback(result);
      })
    })
  }
}
exports.spaceBasedData = function (connection, type, spaceScale, address, timeScale, time, callback) {
  console.log(type, spaceScale, address, timeScale, time);
  if (address === '北京市' || address === '重庆市' || address === '上海市' || address === '天津市') {
    address = address.substring(0, 2)
    spaceScale = 'city'
  }
  let sql = ''
  let XVar = formatX('space', spaceScale, timeScale);
  if (timeScale === 'year' || timeScale === 'month') {
    let tableName = formatTableName(time, timeScale);
    if (spaceScale === 'all') {
      sql = `SELECT AVG(value) AS value, ${XVar} as address FROM ${tableName} WHERE type='${type}' GROUP BY ${XVar};`
    } else {
      sql = `SELECT AVG(value) AS value, ${XVar} as address FROM ${tableName} WHERE ${spaceScale}='${address}' AND type='${type}' GROUP BY ${XVar};`
    }
    connection.query(sql, function(err, result) {
      result.map(item => {
        item.value = Math.round(item.value);
        return item;
      })
      if (spaceScale === 'city') {
        addLonLat(connection, result, function(res) {
          result = res;
          console.log(result)
          callback(result);
        })
      } else {
        callback(result);
      }
    })
  }
  if (timeScale === 'day') {
    let tableName = formatTableName(time, timeScale);
    sql = `SELECT AVG(value) as value, ${XVar} as address FROM ${tableName} WHERE type='${type}' AND ${spaceScale}='${address}' AND date='${time}' GROUP BY ${XVar};`
    connection.query(sql, function(err, result) {
      result.map(item => {
        item.value = Math.round(item.value);
        return item;
      })
      callback(result);
    })
  }
  if (timeScale === 'hour') {
    let hour = parseInt(time.substring(8, 10));
    time = time.slice(0, 8);
    getTables(connection, spaceScale, address,function(tables) {
      if (spaceScale === 'all') {
        for(let table of tables) {
          sql += `SELECT value, ${XVar} as address FROM ${table} WHERE type='${type}' AND hour='${hour}' AND date='${time}';`
        }
      } else {
        for(let table of tables) {
          sql += `SELECT value, ${XVar} as address FROM ${table} WHERE type='${type}' AND hour='${hour}' AND ${spaceScale}='${address}' AND date='${time}';`
        }
      }
      connection.query(sql, function(err, result) {
        result = catgorifyH(result, 'date')
        callback(result);
      })
    })
  }
}
exports.timeBasedData = function (connection, type, spaceScale, address, timeScale, time, callback) {
  console.log(type, spaceScale, address, timeScale, time);
  let sql = ''
  let XVar = formatX('time', spaceScale, timeScale);
  if (timeScale === 'year' || timeScale === 'month') {
    let tableName = formatTableName(time, timeScale);
    if (spaceScale === 'station') {
      connection.query(`SELECT stationId FROM station WHERE stationName='${address}'`, (err, res) => {
        let stationId = res[0].stationId
        sql = `SELECT AVG(value) AS value, ${XVar} as date FROM ${tableName} WHERE stationId='${stationId}' AND type='${type}' GROUP BY ${XVar};`
        console.log(sql)
        connection.query(sql, function(err, result) {
          result.map(item => {
            item.value = Math.round(item.value);
            return item;
          })
          callback(result);
        })
      })
    } else {
      if (spaceScale === 'all') {
        sql = `SELECT AVG(value) AS value, ${XVar} as date FROM ${tableName} WHERE type='${type}' GROUP BY ${XVar};`
      }  else {
        sql = `SELECT AVG(value) AS value, ${XVar} as date FROM ${tableName} WHERE ${spaceScale}='${address}' AND type='${type}' GROUP BY ${XVar};`
      }
      console.log(sql)
      connection.query(sql, function(err, result) {
        result.map(item => {
          item.value = Math.round(item.value);
          return item;
        })
        callback(result);
      })
    }
  }
  if (timeScale === 'day') {
      if (spaceScale === 'station') {
        connection.query(`SELECT stationId FROM station WHERE stationName='${address}'`, (err, res) => {
          let stationId = res[0].stationId
          sql = `SELECT value, ${XVar} as date FROM ${stationId} WHERE date='${time}' AND type='${type}';`
          connection.query(sql, function(err, result) {
            result = catgorifyH(result, 'date')
            callback(result);
          })
        })
      } else {
        getTables(connection, spaceScale, address, function(tables) {
          if (spaceScale === 'all') {
            for(let table of tables) {
              sql += `SELECT value, ${XVar} as date FROM ${table} WHERE type='${type}' AND date='${time}';`
            }
          }
          else {
            for(let table of tables) {
              sql += `SELECT value, ${XVar} as date FROM ${table} WHERE type='${type}' AND ${spaceScale}='${address}' AND date='${time}';`
            }
          }
          // console.log(sql)
          connection.query(sql, function(err, result) {
            result = catgorifyH(result, 'date')
            callback(result);
          })
        })
    }
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

function formatX (XVar, spaceScale, timeScale) {
  if (XVar === 'time') {
    if (timeScale === 'day') {
      return 'hour';
    } else {
      return 'date';
    }
  } else if (XVar === 'space') {
    if (spaceScale === 'all') {
      return 'province';
    } else if (spaceScale === 'province') {
      return 'city';
    } else if (spaceScale === 'city') {
      return 'stationId';
    } else {
      throw new Error('变量为space时不能到站点尺度')
    }
  }
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
function catgorifyH (arr, XVar) {
  let catObj = {};

  arr = flatten(arr);
  arr.forEach(inner => {
    if (!catObj[inner[XVar]]) {
      catObj[inner[XVar]] = [inner.value]
    } else {
      catObj[inner[XVar]].push(inner.value)
    }
  })
  let res = []
  for (let item in catObj) {
    let temp = {};
    temp[XVar] = item;
    let length = catObj[item].length
    catObj[item] = catObj[item].reduce((a, b) => {
      return a + b
    })
    catObj[item] = Math.round(catObj[item] / length);
    temp.value = catObj[item];
    res.push(temp)
  }
  return res
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
// 给返回结果加上lat河lon字段
function addLonLat (connection, result, callback) {
  let sql = '';
  result.forEach(item => {
    sql += `SELECT stationId, lat, lon FROM station WHERE stationId='${item.address}';`
  })
  connection.query(sql, (err, res) => {
    if (err) {
      console.log(err)
    }
    res = flatten(res)
    for (let item in result) {
      result[item].lat = res[item].lat;
      result[item].lon = res[item].lon;
    }
    callback(result)
  })
}
