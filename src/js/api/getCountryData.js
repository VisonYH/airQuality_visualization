import axios from 'axios'
export default async function (spaceScale, address) {
  let url
  if (spaceScale === 'all') {
    url = 'http://localhost:8080/static/china.geojson'
  } else {
    url = `http://localhost:8080/api/quhua/${spaceScale}/${address}`
  }
  let p = await axios.get(url)
  return p
}
