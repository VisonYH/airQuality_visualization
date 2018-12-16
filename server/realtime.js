const fs = require('fs')
var express = require('express');
var router = express.Router();
var axios = require('axios')
router.get('/', (req, res) => {
  // axios.get('http://www.pm25.in/api/querys/all_cities.json?token=5j1znBVAsnSf5xQyNQyq').then(res => {

  // })
  let rs = fs.createReadStream('./realtimeData.js');
  rs.pipe(res)
})

module.exports = router
