import axios from 'axios'

export default function (callback, scaleArr, scale) {
  let pos = scaleArr[scaleArr.length - 1] || 'all'
  scale = scale === 'station' ? 'stationName' : scale
  if (!scale) {
    scale = 'all'
  }
  axios.get(`http://localhost:8080/api/history/station/${scale}/${pos}`).then(callback)
}
