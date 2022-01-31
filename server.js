//require() .. built-in function to include external modules that exist in separate files. require() statement basically reads a JavaScript file, executes it, and then proceeds to return the export object.
//const express = require(argument which specify the name of the package)

//Express Framework
//Express provides methods to specify what function is called for a particular HTTP verb ( GET , POST , SET , etc.) and URL pattern ("Route"), and methods to specify what template ("view") engine is used, where template files are located, and what template to use to render a response.
const express = require('express');

//CORS - Cross-Origin Resource Sharing
//It is a mechanism to allow or restrict requested resources on a web server depend on where the HTTP request was initiated.
//If you are currently on http://example.com/page1 and you are referring an image from http://image.com/myimage.jpg you won't be able to fetch that image unless http://image.com allows cross-origin sharing with http://example.com.
const cors = require('cors');

//Server Error Handler

//Enable use Error Handler 


//Create an Instance of the express module in a new variable
const app = express();

//app.use(cors()) .. will enable the express server to respond to preflight requests
//A preflight request is basically an OPTION request sent to the server before the actual request is sent, in order to ask which origin and which request options the server accepts
//makes the server accessible to any domain that requests a resource from the server via a browser.
//Connect between front-end and back-end
app.use(cors());

//Host for the Server
//console.log to make sure its listening



//Data from JSON File
const moviesJson = require('./data.json');


// const //res = require('express/lib/response');

//**Build the routes using the GET request **

//** Home Page Endpoit: "/" **
//A route with a method of get and a path of /
//Callback -- JSON data
app.get('/', moviesLibraryHandler);

//Constructor Function 
function MoviesLibrary(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

//Function homePageHandler
function moviesLibraryHandler(req, res) {
    let moviesLibray = [];
    his();
    moviesJson.data.forEach(movie => {
        let movieOne = new MoviesLibrary(movie.title, movie.poster_path, movie.overview);
        moviesLibray.push(movieOne);
    });
    return res.status(200).json(moviesLibray);
}

//** Favorite Page Endpoint: "/favorite" **
app.get('/favorite', favoriteMoviesLibraryHandler);

//Function favoriteMoviesLibraryHandler
function favoriteMoviesLibraryHandler(req, res) {
    return res.status(200).send('Welcome to Favorite Page')
}

//** Handle errors **


//Page not Found Error
app.get('*', pageNotFoundHandler);

//Function to handle the Page not Found Error
function pageNotFoundHandler(req, res) {
    // let pageNotFound = new ErrorsObject(errorStatus, errorResponseText);
    // this.status = 404;
    // this.responseText = "page not found error"
    return res.status(404).send({
        "status": 404,
        "responseText": "page not found error"
    });

}

//Server Error, that the server encountered an unexpected condition that prevented it from fulfilling the request.
//app.get('/ChooseYourMovie', serverErrorHandler);

//Function to handle the server error (status 500)

app.use(errorHandler);
function errorHandler(err, req, res, next){
    //should i put .status(500)
    res.status(500).send({
        "status": 500,
        "responseText": "Sorry, something went wrong"
    });

}

app.listen(3030, () => {
    console.log('listening to port 3030')
});

//commad to kill: 

