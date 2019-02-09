require("dotenv").config();
var Spotify = require('node-spotify-api');

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);


// C O M M A N D S
// * `concert-this`
// * `spotify-this-song`
// * `movie-this`
// * `do-what-it-says`

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

var axios = require("axios");
// We then run the request with axios module on a URL with a JSON
axios.get("http://www.omdbapi.com/?t=remember+the+titans&y=&plot=short&apikey=" + keys.omdb.key).then(
  function(response) {
    // Then we print out the imdbRating
    console.log("The movie's rating is: " + response.data.imdbRating);
  }
);






