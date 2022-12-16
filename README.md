# JavaScript Promises

### Goals
* Review the callback pattern for asynchronous code in JavaScript 
* Define what a promise is
* Use promises to manage asynchronous code
* Compare and contrast promises with the callback pattern Explore the Promise function in detail

### The Callback Pattern: A Review

#### Asynchronous JavaScript
JavaScript runs synchronously, but there’s a way to handle async code: asynchronous callbacks.

```js
console.log("this prints first");

// The browser itself handles the (Safari Chrome Firefox) will take care of setting this timer.
// Javascript will keep zooming along.
// Javascript is not trying to keep track of 1 second.
setTimeout(function() {
  console.log("this prints third, one second later");
}, 1000);

console.log("this prints second");
```
This code does not run “out of order.” However, the callback to setTimeout is not executed right away — it runs after the timer expires.

[Loupe](http://latentflip.com/loupe/?code=!!!PGJ1dHRvbj5DbGljayBtZSE8L2J1dHRvbj4%3D)

```js
console.log("empezar/start")
setTimeout(function interrupciónTimeout() {
  console.log("adios muchaco/goodbye homie");
}, 5000);

console.log("hola/hello");
```
Above is an over simplified version, but it applies to many other async functions. Things that take time that accept a callback.

#### Async + AJAX
When working with timers, you’ll need to manage asynchronous code.

A common scenario for managing asynchronous code is dealing with AJAX.

Requests are very slow (even at its fastest) in terms of Javascript's execution speed. So instead, we pass in a callback.

Let’s try to pull some data with jQuery, which utilizes callbacks (we’re just using this as an example since axios doesn’t support callbacks):

```js
// run this code in promiseJunkie.html
let planet;

// jQuery request...
$.getJSON("https://swapi.dev/api/planets/1/", response => {
  planet = response;
});

console.log(planet);
```

- [x] promiseJunkie.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="shortcut icon" href="#">
  <script
  src="https://code.jquery.com/jquery-3.6.2.min.js"
  integrity="sha256-2krYZKh//PcchRtd+H+VyyQoZ/e3EcrkxhM8ycwASPA="
  crossorigin="anonymous"></script>
</head>
<body>
  <h1>Ken so guapo/handsome</h1>

  <script>
    let planet;
    // jQuery request...
    $.getJSON("https://swapi.dev/api/planets/1/", response => {
      planet = response;
    });
    console.log(planet);
  </script>
</body>
</html>
```

* What is the value of planet?
* Why is it undefined?!
* The console.log was synchronous; it ran before the asynchronous callback.

Let's fix this...
```js
let planet;

$.getJSON("https://swapi.dev/api/planets/1/", response => {
  planet = response;
  console.log("done", planet);
});

console.log("waiting");
```

Okay. But if we wanted to do 3-4 requests (to same or different APIs), things can get messy.

Inside response, let's make a request to residents.
```js
let planet;

$.getJSON("https://swapi.dev/api/planets/1/", response => {
  planet = response;
  console.log("planet: ", planet)
  $.getJSON(planet.residents[0], response => {
    resident = response
    console.log("resident", resident)
  });
});

console.log("waiting");
```
We got Skywalker? Cool. One more request to films? Sure, why not?

One more request to films.
```js
let planet;

$.getJSON("https://swapi.dev/api/planets/1/", response => {
  planet = response;
  console.log("planet: ", planet)
  $.getJSON(planet.residents[0], response => {
    resident = response
    console.log("resident", resident)
    $.getJSON(resident.films[0], response => {
      film = response
      console.log("film: ", film)
  });
  });
});
```

Is the nesting getting uncomfortable yet? 
What if we introduce error handling and complex logic here?

With jQuery error handling, we would add a second callback. 
Basically, we would have double the callback functions from above.

It's not just about making some request after another. 
There are many times we want some async operation to occur after another async operation. Sometimes more than that. It's not just making API calls and AJAX requests. Things like animations (after an animation is complete), we would wanna make sure there is some callback in there. Maybe run an animation if an API call succeeds and another animation if the request fails?

For years, we dealt with CALLBACK hell. Promises clean up our code and flatten things out for us.

#### Takeaways
* JS code is executed synchronously (in-order).
* JS can use special asynchronous callbacks to delay execution of code.
* Not all callbacks are async; you’ll have to consult their docs to tell.
[MDN Callback Function](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)

### Promises 

##### What is a Promise?
A promise is a one-time guarantee of future value.
Analogy time: I wanna borrow money. The promise is not the result. It's a promise in the future that you'll be able to receive the money I borrowed from you. 

### Working with Promises

#### Our First Promise
```html
<!-- axios-index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Axios Examples</title>
</head>
<body>
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script src="app-axios.js"></script>
</body>
</html>

```
```js
// app-axios.js
let url = "https://swapi.dev/api/planets/1/"
let ourFirstPromise = axios.get(url);
console.log(ourFirstPromise);
// Promise {<pending>}
```
PENDING? WTH! Where's my data? 

### What exactly is a Promise?
* Promises in JavaScript are objects
* They are native to the language as of ES2015
* A promise can be in one of three states:
    * Pending - It doesn’t yet have a value
    * Resolved - It has successfully obtained a value
```js
console.log(ourFirstPromise) // log in console again. Does it change?
```
    * Rejected - It failed to obtain a value for some reason
```js
console.log(ourFirstPromise) // log in console again. Does it reject?
```
* The only way to access the resolved or rejected value is to chain a method on the end of the promise.

Promise is an object. 
Takes time for something to go wrong.
Promise always starts off as pending.
Having an object that tells us fulfilled/rejected is not helpful. We need to be able to act upon the different states of that promise.

### .then and .catch
* Promises provide a .then and a .catch, which both accept callbacks.
* The callback to .then will run if the promise is resolved, and has access to the promise’s resolved value.
* The callback to .catch will run if the promise is rejected, and typically has access to some reason behind the rejection.

```js
// app-axios.js
let url = "https://swapi.dev/api/planets/1/"
let ourFirstPromise = axios.get(url);
ourFirstPromise.then( () => console.log("RESOLVED"))
```
Cool. Now let's do some error handling.
```js
// app-axios.js
let url = "https://swapi.dev/api/planuts/1/"
let ourFirstPromise = axios.get(url);
ourFirstPromise.then( () => console.log("RESOLVED"))
ourFirstPromise.catch( () => console.log("BUMMER"))
```

```js
// app-axios.js
let url = "https://swapi.dev/api/planuts/1/"
let ourFirstPromise = axios.get(url);
ourFirstPromise.then( (data) => console.log(data))
ourFirstPromise.catch( (err) => console.log("BUMMER", err))
```

```js
// app-axios.js
let url = "https://swapi.dev/api/planets/1/"
let ourFirstPromise = axios.get(url);
console.log("Argentina gonna win it all on Sunday!")
// data.data is super funky
ourFirstPromise.then( (data) => console.log(data))
ourFirstPromise.catch( (err) => console.log("BUMMER", err))
console.log("Wait. Nevermind. France gonna win it all on Sunday!")
```
```js
// app-axios.js
let url = "https://swapi.dev/api/planets/1/"
let ourFirstPromise = axios.get(url);
console.log("Argentina gonna win it all on Sunday!")
// res.data is less funky
ourFirstPromise.then( (res) => console.log("res.data: ", res.data))
ourFirstPromise.catch( (err) => console.log("BUMMER", err))
console.log("Wait. Nevermind. France gonna win it all on Sunday!")
```

Compare this to our jQuery callback hell. Not much of benefit w/Axios right now.
So what is the real advantage of Promises?

### Promise Chaining
Okay, I can still nest lots of callback functions inside my .then and .catch. But it's an anti-pattern. The solution to all this is "Promise Chaining."

* When you call .then on a promise, you can return new promise in the callback! (Makes NO SENSE RIGHT NOW. I get it.)
* This means you can chain multiple asynchronous operations together with several .then calls.
* When using this pattern, you only need one .catch at the end. You don’t have to catch every promise individually.


```js
// app-axios.js
let url = "https://swapi.dev/api/planets/1/"
// First promise gotta succeed.
axios.get(url)
  // this callback gonna run now.
  .then(res => {
    console.log(res.data)
    // returning new promise
    return axios.get(res.data.residents[0])
  })
  // That new promise above got resolved. So we can run new promise(.then)...
  // Don't need to nest. Just chain.
  .then(res => {
    console.log(res.data)
  })
  // Don't need multiple catches
  // One .catch to rule them all
  .catch(err => console.log("Rejected!! Get that ish outta here! Not in my house!", err))
```
Make first promise succeed, second promise fail. See how we only need one catch block? One .catch to rule them all.

Google Callback Hell jQuery with Error Handling
![Callback Hell w/Error Handling](https://miro.medium.com/max/1400/1*OVqGAIx11Mmz6JLKXmU2IQ.png)

