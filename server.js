'use strict'
//Method that allwos me to access information from the .env file
require('dotenv').config();

//require() .. built-in function to include external modules that exist in separate files. require() statement basically reads a JavaScript file, executes it, and then proceeds to return the export object.
//const express = require(argument which specify the name of the package)

//Express Framework
//Express provides methods to specify what function is called for a particular HTTP verb ( GET , POST , SET , etc.) and URL pattern ("Route"), and methods to specify what template ("view") engine is used, where template files are located, and what template to use to render a response.
const express = require('express');

//CORS - Cross-Origin Resource Sharing
//It is a mechanism to allow or restrict requested resources on a web server depend on where the HTTP request was initiated.
//If you are currently on http://example.com/page1 and you are referring an image from http://image.com/myimage.jpg you won't be able to fetch that image unless http://image.com allows cross-origin sharing with http://example.com.
const cors = require('cors');

//pg is the Library that provides us with the Client, client is a database that will be connected to my database
const pg = require('pg');

//Security for the PORT
const PORT = process.env.PORT || 3030;

//Create your server, an Instance of the express module in a new variable
const app = express();

//Create a Client with the DataBase in the Postgres (Ubuntu) URL
//New client -- Link it with the DataBase we created
const client = new pg.Client(process.env.DATABASE_URL);
//Conect the client to the DataBase
//psql -d movieslib -f schema.sql

//app.use(cors()) .. will enable the express server to respond to preflight requests
//A preflight request is basically an OPTION request sent to the server before the actual request is sent, in order to ask which origin and which request options the server accepts
//makes the server accessible to any domain that requests a resource from the server via a browser.
//Connect between front-end and back-end
app.use(cors());

//Parse the data from the body to JSON data 
app.use(express.json());

//Data from JSON File
const moviesJson = require('./data.json');

//Data from third-party API
const axios = require('axios');


//**Build the routes using the GET request **

//*Home Page Endpoit: "/"
//A route with a method of get and a path of /
//Callback -- JSON data
app.get('/', moviesLibraryHandler);

//*Favorite Page Endpoint: "/favorite"
app.get('/favorite', favoriteMoviesLibraryHandler);

//GET request to the 3rd party API for Endpoints

//*Get the trending movies data from the Movie DB API "/trending"
app.get('/trending', trendingMoviesLibraryHandler);

//*Search for a movie name to get its information "/search"
app.get('/search', searchMoviesLibraryHandler);

//* for a movie name to get its information "/genre"
app.get('/genre', genreMoviesLibraryHandler);

//* for a movie name to get its information "/discover"
app.get('/discover', discoverMoviesLibraryHandler);


//**DATABASE**
//*Post request to save a specific movie to database along with your personal comments "addMovie"
app.post('/addMovie', addMovieMoviesLibraryHandler);

//*Get request to get all the data from the database "/getMovies"
//app.get('/getMovies', getMoviesMoviesLibraryHandler);

//Constructor Function for the Third-Party API || JSON file
function MoviesLibrary(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

//Function homePageHandler
function moviesLibraryHandler(req, res) {
    let moviesLibray = [];
    //To throw the 500 server error, call a notexisiting function hi();
    moviesJson.data.forEach(movie => {
        let movieOne = new MoviesLibrary(movie.title, movie.poster_path, movie.overview);
        moviesLibray.push(movieOne);
    });
    return res.status(200).json(moviesLibray);
}

//Function favoriteMoviesLibraryHandler
function favoriteMoviesLibraryHandler(req, res) {
    return res.status(200).send('Welcome to Favorite Page')
}

//Function trendingMoviesLibraryHandler
function trendingMoviesLibraryHandler(req, res) {
    let trendUrl = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`
    axios.get(trendUrl).then((trendData) => {
        //console.log(trendData.data.results)
        let movies = trendData.data.results.map(movie => {
            return new MoviesLibrary(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview)
        })
        res.status(200).json(movies);
    }).catch(err => {
        errorHandler(err, req, res);
    });
}

//Function searchMoviesLibraryHandler
function searchMoviesLibraryHandler(req, res) {
    let searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=The&page=2`
    axios.get(searchUrl).then(searchData => {
        console.log(searchData.data.results)
        let movies = searchData.data.results.map(movie => {
            return new MoviesLibrary(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview)
        })
        res.status(200).json(movies);
    }).catch(err => {
        errorHandler(err, req, res);
    })
}

//Function genreMoviesLibraryHandler
function genreMoviesLibraryHandler(req, res) {
    let genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.APIKEY}&language=en-US`
    axios.get(genreUrl).then((genreData) => {
        //console.log(genreData.data.genres)
        let movies = genreData.data.genres.map(movie => {
            return new MoviesLibrary(movie.id, movie.name, movie.title, movie.release_date, movie.poster_path, movie.overview)
        })
        res.status(200).json(movies);
    }).catch(err => {
        errorHandler(err, req, res);
    });
}

//Function discoverMoviesLibraryHandler
function discoverMoviesLibraryHandler(req, res) {
    let discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.APIKEY}&language=en-US`
    axios.get(discoverUrl).then((discoverData) => {
        //console.log(discoverData.data.results)
        let movies = discoverData.data.results.map(movie => {
            return new MoviesLibrary(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview)
        })
        res.status(200).json(movies);
    }).catch(err => {
        errorHandler(err, req, res);
    });
}

//
function addMovieMoviesLibraryHandler(req, res){
    console.log(req.body);
}


//Page not Found Error(or .use) 
app.get('*', pageNotFoundHandler);

//Server Error, that the server encountered an unexpected condition that prevented it from fulfilling the request.
app.use(errorHandler);


//Function to handle the Page not Found Error
function pageNotFoundHandler(req, res) {
    return res.status(404).send({
        "status": 404,
        "responseText": "page not found error"
    });
}

//Function to handle the server error (status 500)
function errorHandler(err, req, res) {
    res.status(500).send({
        "status": 500,
        "responseText": "Sorry, something went wrong",
    });
}

//Listen to the Server
//console.log to make sure its listening
//const PORT = process.env.PORT;
/*Static
app.listen(3030, () => {
    console.log('listening to port 3030')
});
*/
//To listen to any port
// app.listen(PORT, ()=>{
//     console.log(`listening to port ${PORT}`)
// });

//Connect the server to the Client, to connect with the DB and then run the server 
client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`listening to port ${PORT}`)
    });
})






//NOTES:
//http methods: get, post, put, delete
//DataBase methods: CRUD operations - create, read, update, delete | drop