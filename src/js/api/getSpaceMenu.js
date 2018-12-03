import axios from 'axios'
export default async function () {
  let data = await axios.get('http://localhost:8080/api/menu/spaceMenu')
  data = data.data
  data.unshift({
    label: '全国',
    value: 'all'
  })
  return data
}
