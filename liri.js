require("dotenv").config();
var Spotify = require('node-spotify-api');

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

var axios = require("axios");

// C O M M A N D S
// * `concert-this`
// * `spotify-this-song`
// * `movie-this`
// * `do-what-it-says`

// PROCESS INPUT


// WORKING SPOTIFY 
// var spotify = new Spotify({
    //   id: <your spotify client id>,
    //   secret: <your spotify client secret>
    // });
    
    // spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
    //     if (err) {
    //         return console.log('Error occurred: ' + err);
    //     }
        
    //     console.log(data); 
    // });

// WORKING OMDB
// // We then run the request with axios module on a URL with a JSON
// axios.get("http://www.omdbapi.com/?t=remember+the+titans&y=&plot=short&apikey=" + keys.omdb.key).then(
//   function(response) {
//     // Then we print out the imdbRating
//     console.log("The movie's rating is: " + response.data.imdbRating);
//   }
// );


// THIRD API
// input hookups symbol
// move api key

// var symbol to upper case
// console.log(keys.alpha_vantage.key);

// var symbol = 'GOOG';

// axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + symbol + "&apikey=" + keys.alpha_vantage.key).then(
//     function(response) {
//         console.log(response.data['Meta Data']);
//     }
// );