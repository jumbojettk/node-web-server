// This is the server of the site, contains the root of the site and other urls,
// binds to the port on local machine

// use const when requiring modules
const express = require('express');		// load express module to use
const hbs = require('hbs');				// load hbs (handlebars) to use
const fs = require('fs');				// load fs (filesync) to use to log all the requests

// set up heroku port or the 3000 for local machine
const port = process.env.PORT || 3000;

var app = express();					// create express app

// use partial templating for the whole app to be able to reuse templates (like headers and footers etc.)
// the argument is the directory of the partial files
hbs.registerPartials(__dirname + '/views/partials');

// set the express related config
// set view engine to hbs (to use hbs as views)
app.set('view engine', 'hbs');


// Using middleware, if express doesn't know how to do something you want it to do
// then use a middleware and teach it how to do that thing. Using app.use()
// Parameters: request
//			   response
//			   next - use to tell the middleware when the function is done
//					  doesn't move on until you call next(), must!
// Description: This middleware keeps track of how our server is doing.
app.use((req, res, next) =>{
	// the date and timestamp
	var now = new Date().toString();

	// req.method returns the method of request used (get/post/etc)
	// req.url returns the url that the request was made to.
	var log = `${now}: ${req.method} ${req.url}`;

	// log the request and the timestamp to the console
	console.log(log);

	fs.appendFile('server.log', log + '\n', (err) => {
		if (err) {
			console.log('Unable to append to server.log');
		}
	});

	next();
});


// // This middleware is used to show when the site is on maintenance
// // (rendering the maintenance page without going anywhere else)
// app.use((req, res, next) =>{
// 	res.render('maintenance.hbs', {
// 		pageTitle: 'We\'ll Be Right Back!',
// 		pageBody: 'This site is under maintenance update, we\'ll be back shortly yo!'
// 	});
// });


// middleware to serve the html page without having to manually config it
// express.static - takes the absolute path to the folder you want to serve up
//					in this case, we wanna serve the help.html which is in public folder
//					so use __dirname as the root then concat from there
// note on 'public' folder - usually contains all the static images, javascripts, css, or any other file type to use
app.use(express.static(__dirname + '/public'));


// helper function: minimizes re-declaring functions to be used multiple times/pages
// helper function to get current year
hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
});

// helper function to cap letters, takes a text as arg
hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
});

// Root of the app: /
// Parameters: req = request, contains things like headers and body of the request and the method
//					 that we used to request etc...
//			   res = response, contains a bunch of method available to use
app.get('/', (req, res) => {
	// send the response back with a text
	// res.send('<h1>Hello world from express!</h1>');

	// sending JSON, express automatically detects it!
	// res.send({
	// 	name: "Jett",
	// 	likes: [
	// 		"motorcycles",
	// 		"cars",
	// 		"gym"
	// 	]
	// });

	// render the home.hbs with the defined objects
	res.render('home.hbs', {
		welcomeMsg: 'Welcome to the APP! This is the home page...Woo!',
		pageTitle: 'Home Page'
	});
});

// About page: /about
app.get('/about', (req, res) => {
	// simple heading for about page
	// res.send('<h1>About</h1>');

	// render: renders any template you have set up with the view engine
	// the second argument can be an object with a bunch of variable to be injected inside the template
	res.render('about.hbs', {
		pageTitle: 'About Page'
	});
});

// Bad page (when a request fails): /bad
app.get('/bad', (req, res) => {
	// send back a JSON with response saying fail
	res.send({
		errorMessage: "Unable to fufil the request..."
	});
});

// set up listener port, binding the app to a port on local machine
// display the message when server running
// use heroku dynamic port
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});