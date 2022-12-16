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


### Promises Intro
