import axios from 'axios'
export default function () {
  return axios.get('http://localhost:8080/static/china.geojson')
}
