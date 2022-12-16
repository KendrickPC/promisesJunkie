// app-axios.js
let url = "https://swapi.dev/api/planuts/1/"
axios.get(url)
  .then(res => {
    console.log(res.data)
    return axios.get(res.data.residents[0])
  })
  .then(res => {
    console.log(res.data)
  })
  .catch(err => console.log("Rejected!! Get that ish outta here! Not in my house!", err))