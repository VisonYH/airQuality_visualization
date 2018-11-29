module.exports = {
  getStation (spaceScale, address, connection, callback) {
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
  getStationData (connection, type, spaceScale, address, timeScale, time, XVar, callback) {
    // console.log(type, spaceScale, address, timeScale, time);
    let tableName = formatTableName(time, timeScale);
    // console.log(XVar)
    XVar = formatX(XVar, spaceScale);
    let sql = `SELECT AVG(value) AS value, ${XVar} FROM ${tableName} GROUP BY ${XVar};`
    // console.log(sql)
    connection.query(sql, function(err, result) {
      result.map(item => {
        item.value = Math.round(item.value);
        return item;
      })
      // console.log(result)
      callback(result);
    })
  }
}

function formatTableName (time, timeScale) {
  let tableName
  if (timeScale === 'year') {
    tableName = time + 'y'
  } else if (timeScale === 'month') {
    tableName = time + 'm'
  }
  return tableName
}

function formatX (XVar, spaceScale) {
  if (XVar === 'time') {
    return 'date'
  } else if (XVar === 'space') {
    if (spaceScale === 'all') {
      return 'province'
    } else if (spaceScale === 'province') {
      return 'city'
    }
  }
}
