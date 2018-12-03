var express = require('express');
var router = express.Router();
var fs = require('fs').promises;
router.get('/:scale/:quhua', async function (req, res) {
  let {scale, quhua} = req.params
  if (scale === 'city') {
    let city = await fs.readFile('./city.json', 'utf8')
    city = JSON.parse(city)
    quhua = city[quhua]
  }
  let path = `./quhua/${scale}/${quhua}.json`

  let data = (await fs.readFile(path)).toString()
  if (data.charCodeAt(0) === 0xFEFF) {
    data = data.slice(1);
  }
  res.json(JSON.parse(data))
})
module.exports = router
