import axios from 'axios'

export default async function (type, timeScale, time, spaceScale, address, XVar) {
  let url = `http://localhost:8080/api/history/data/${XVar}`
  console.log(url)
  let res = await axios.post(url, {
    type,
    timeScale,
    time,
    spaceScale,
    address,
    XVar
  })
  return res.data
}
