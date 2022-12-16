// run this code in promiseJunkie.js
let planet;

// jQuery request...
$.getJSON("https://swapi.dev/api/planets/1/", response => {
  planet = response;
});

console.log(planet);