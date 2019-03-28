var express = require('express');
const {getStation, getStationData, spaceBasedData, timeBasedData, multiLine} = require('./utils')
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

connection.connect(function(err){
    if(err){
        console.log("链接失败")
        throw(err)
    } else {
        console.log("链接成功")
    }
})

router.post('/data/space', function(req, res) {
  let params = req.body;
  let {type, timeScale, time, spaceScale, address} = params;
  // console.log(type, timeScale, time, spaceScale, address);
  spaceBasedData(connection, type, spaceScale, address, timeScale, time, function (data) {
    res.json(data)
  })
})
router.post('/data/time', function(req, res) {
  let params = req.body;
  let {type, timeScale, time, spaceScale, address} = params;
  // console.log(type, timeScale, time, spaceScale, address);
  timeBasedData(connection, type, spaceScale, address, timeScale, time, function (data) {
    res.json(data)
  })
})
router.post('/data/multiline', (req, res) => {
  let params = req.body;
  let {type, timeScale, time, spaceScale, address} = params;
  multiLine(connection, type, spaceScale, address, timeScale, time, function (data) {
    res.json(data)
  })
})
// 获取站点
router.get('/station/:scale/:space', function(req, res) {
    let params = req.params;
    let {scale, space} = params;
    console.log('scale, space', scale, space)
    let sql =  scale !== 'all' ? `SELECT s.* FROM station as s WHERE ${scale}='${space}'` : `SELECT * FROM station`;
    connection.query(sql, (err, result) => {
        res.json(toGeojson(result));
    })
});

function toGeojson(data) {
    let geojson =  {
        "type": "FeatureCollection",
        "features": []
    };
    data.forEach(item => {
        let {stationId, stationName, province, city} = item;
        let feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [item.lon, item.lat]
            },
            "properties": {
                stationId,
                stationName,
                province,
                city
            }
        };
        geojson.features.push(feature);
    })
    return geojson;
}
module.exports = router;
