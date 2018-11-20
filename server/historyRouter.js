var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    port:3306,
    database:'air'
});

connection.connect(function(err){
    if(err){
        console.log("链接失败");
        throw(err)
    } else {
        console.log("链接成功");
    }
})


router.get('/:type/:timeScale/:time/:spaceScale/:address/:method', function(req, res) {

});

// 获取站点
router.get('/station/:scale/:space', function(req, res) {
    let params = req.params;
    let {scale, space} = params;
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
