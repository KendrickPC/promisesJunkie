// app-axios.js
let url = "https://swapi.dev/api/planets/1/"
let ourFirstPromise = axios.get(url);
console.log("Argentina gonna win it all on Sunday!")
ourFirstPromise.then( (data) => console.log(data))
ourFirstPromise.catch( (err) => console.log("BUMMER", err))
console.log("Wait. Nevermind. France gonna win it all on Sunday!")