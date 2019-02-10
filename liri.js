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
        console.log("searching for song: " + inquiry + "\n");

        if (inquiry === ''){
            console.log("No song given. This might be a sign. Here's 'The Sign' by Ace of Base instead.");
            inquiry = 'The Sign Ace of Base';
        }
    
        spotify.search({ type: 'track', query: inquiry }, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

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
        break;
        
        case 'stock-check-this':
        inquiry = inquiry.toLocaleUpperCase();
        console.log("searching for symbol: " + inquiry);
                
        axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + inquiry + "&outputsize=compact" + "&apikey=" + keys.alpha_vantage.key).then(
            function(response) {
                var lastRef = response.data['Meta Data']['3. Last Refreshed'];
                console.log("Last Refreshed Date: " + lastRef);

                console.log("Stock value of " + inquiry + " on " + lastRef + ":");
                console.log(response.data['Time Series (Daily)'][lastRef]);
            }
        );
        break;
        
        case 'movie-this':
        console.log("searching for movie: " + inquiry + "\n");

        axios.get("http://www.omdbapi.com/?t=" + inquiry + "&y=&plot=short&apikey=" + keys.omdb.key)
        .then(
          function(response) {
            // console.log(response.data);
            console.log("Movie Title: " + response.data.Title);
            console.log("Released: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);

            var hasRT = false;
            for (var i=0; i<response.data.Ratings.length; i++){
                if(response.data.Ratings[i].Source === "Rotten Tomatoes"){
                    console.log("Rotten Tomatoes Rating: " + response.data.Ratings[i].Value);
                    hasRT = true;
                    break;
                }
            }
            if (!hasRT) {
                console.log("Rotten Tomatoes Rating: None");
            }
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            }
        );
        break;

    case 'do-what-it-says':
        console.log("attemping to do ... ");
        break;

    default:
        console.log("Command not recognized, sorry. Try again.");
        break;
}







// THIRD API
// input hookups symbol
// move api key
