require("dotenv").config();
var Spotify = require('node-spotify-api');

var keys = require("./keys.js");


// init axios for calls
var axios = require("axios");

// C O M M A N D S
// * `stock-check-this`
// * `spotify-this-song`
// * `movie-this`
// * `do-what-it-says`

// PROCESS INPUT
// command

var command = process.argv[2].toLowerCase();
console.log("command = " + command);

var inquiry = process.argv.slice(3).join(' ').toLowerCase().trim();
console.log("inquiry: " + inquiry);

var spotify = new Spotify(keys.spotify);

//switch case
switch (command) {
    case 'spotify-this-song':
        console.log("searching for song: " + inquiry);

        if (inquiry === ''){
            console.log("No song given. This might be a sign. Here's 'The Sign' by Ace of Base instead.");
            inquiry = 'The Sign Ace of Base';
        }
    
        spotify.search({ type: 'track', query: inquiry }, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            // console.log(data.tracks.items[0]);  // changes the track selected
            // console.log(data.tracks.items[0].album);

            if (data.tracks.items.length === 0){
                console.log("Could not find that song. This might be a sign. Here's 'The Sign' by Ace of Base instead.");
                spotify.search({ type: 'track', query: 'The Sign Ace of Base'}, function(err, data) {
                    if (err) {
                        return console.log('Error occured: ' + err);
                    }

                    console.log("Result #1 of " + data.tracks.items.length);

                    console.log("Song Name: " + data.tracks.items[0].name);
                    console.log("Album: " + data.tracks.items[0].album.name);

                    if (data.tracks.items[0].preview_url === null) {
                        console.log("Preview URL: Not Available");
                    }
                    else {
                        console.log("Preview URL: " + data.tracks.items[0].preview_url);
                    }
        
                    console.log("Artist(s): ");
                    for (var i=0; i<data.tracks.items[0].album.artists.length; i++) {
                        console.log(data.tracks.items[0].album.artists[i].name);
                    }
                });
            }
            else {
                console.log("Result #1 of " + data.tracks.items.length);
                console.log("Song Name: " + data.tracks.items[0].name);
                console.log("Album: " + data.tracks.items[0].album.name);

                // if cannot find preview_url   
                if (data.tracks.items[0].preview_url === null) {
                    console.log("Preview URL: Not Available");
                }
                else {
                    console.log("Preview URL: " + data.tracks.items[0].preview_url);
                }

                console.log("Artist(s): ");
                for (var i=0; i<data.tracks.items[0].album.artists.length; i++) {
                    console.log(data.tracks.items[0].album.artists[i].name);
                }
            }
        });



        // * Artist(s)

        // * The song's name
   
        // * A preview link of the song from Spotify
   
        // * The album that the song is from
   
        // * If no song is provided then your program will default to "The Sign" by Ace of Base.

        break;
    
    case 'stock-check-this':
        console.log("searching for symbol: " + inquiry);
        break;

    case 'movie-this':
        console.log("searching for movie: " + inquiry);
        break;

    case 'do-what-it-says':
        console.log("attemping to do ... ");
        break;

    default:
        console.log("Command not recognized, sorry. Try again.");
        break;
}





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