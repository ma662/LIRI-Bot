require("dotenv").config();
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var fs = require('fs');

// init axios for calls
var axios = require("axios");

var command = process.argv[2].toLowerCase();
console.log("command = " + command);

var inquiry = process.argv.slice(3).join(' ').toLowerCase().trim();
console.log("inquiry: " + inquiry);

var commands = {
    spotifyComm : function(song) {
        var spotify = new Spotify(keys.spotify);
        console.log("searching for song: " + song + "\n");

        spotify.search({ type: 'track', query: song }, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            // no track information returned
            if (data.tracks.items.length === 0) {
                console.log("Could not find that song. This might be a sign. Here's 'The Sign' by Ace of Base instead.");
                
                // re-run with this default track
                commands.spotifyComm('The Sign Ace of Base');
            }
            else {
                // Result Number
                console.log("Result #1 of " + data.tracks.items.length);
                // Song Name
                console.log("Song Name: " + data.tracks.items[0].name);
                // Album Name
                console.log("Album: " + data.tracks.items[0].album.name);

                // if cannot find preview_url   
                if (data.tracks.items[0].preview_url === null) {
                    console.log("Preview URL: Not Available");
                }
                else {
                    // preview_url
                    console.log("Preview URL: " + data.tracks.items[0].preview_url);
                }

                // Artists
                console.log("Artist(s): ");
                for (var i=0; i<data.tracks.items[0].album.artists.length; i++) {
                    console.log(data.tracks.items[0].album.artists[i].name);
                }

                // Log to log.txt here
            }
        });

    },

    stockComm : function(symbol) {
        console.log("searching for symbol: " + symbol);

        axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + symbol + "&outputsize=compact" + "&apikey=" + keys.alpha_vantage.key).then(
            function(response) {
                var lastRef = response.data['Meta Data']['3. Last Refreshed'];
                console.log("Last Refreshed Date: " + lastRef);

                console.log("Stock value of " + symbol + " on " + lastRef + ":");
                console.log(response.data['Time Series (Daily)'][lastRef]);
            }
        );
    },
        
    movieComm : function(film) {
        console.log("searching for movie: " + film + "\n");
        
        if (film === ''){
            console.log("You didn't provide a movie. Here is Mr. Nobody for you instead.\n");
            film = 'Mr. Nobody';
        }
        
        axios.get("http://www.omdbapi.com/?t=" + film + "&y=&plot=short&apikey=" + keys.omdb.key)
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
    },

    doComm : function() {
        console.log("Reading file and doing ... ");
        fs.readFile('./random.txt', 'utf8', function(err, data){
            if (err) throw err;
            console.log(data);
            // commands.spotifyComm(data);
        });
    }
};

//switch case
switch (command) {
    case 'spotify-this-song':
        // if no input given, run default
        if (inquiry === ''){
            console.log("No song given. This might be a sign. Here's 'The Sign' by Ace of Base instead.");
            inquiry = 'The Sign Ace of Base';
        }

        commands.spotifyComm(inquiry);
    break;
        
    case 'stock-check-this':
        inquiry = inquiry.toLocaleUpperCase();
        
        commands.stockComm(inquiry);
    break;
        
    case 'movie-this':
        commands.movieComm(inquiry);
    break;

    case 'do-what-it-says':        
        commands.doComm();

    break;
        
    default:
        console.log("Command not recognized, sorry. Try again.");
    break;
    }