import axios from 'axios'

export default function (callback, scale) {
  let pos = scale[scale.length - 1]
  if (scale.length === 1) {
    scale = 'province'
  } else if (scale.length === 2) {
    scale = 'city'
  } else if (scale.length === 0) {
    scale = 'all'
    pos = 'all'
  } else {
    scale = 'stationName'
  }
  axios.get(`http://localhost:8080/api/history/station/${scale}/${pos}`).then(callback)
}
