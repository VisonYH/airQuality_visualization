import axios from 'axios'

export default async function (type, timeScale, time, spaceScale, address) {
  let url = `http://localhost:8080/api/circle/data`
  let res = await axios.post(url, {
    type,
    timeScale,
    time,
    spaceScale,
    address
  })
  return res.data
}
