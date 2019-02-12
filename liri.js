require("dotenv").config();
var Spotify = require('node-spotify-api');
var fs = require('fs');
var inquirer = require("inquirer");
var axios = require("axios");

var keys = require("./keys.js");

// Process Input =============================
var input = process.argv.slice(2).join(', ');
// console.log(input);

var command = process.argv[2].toLowerCase();
// console.log("command = " + command);

var inquiry = process.argv.slice(3).join(' ').toLowerCase().trim();
// console.log("inquiry: " + inquiry);

// Object to store commands
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
                var choicesArr = [];
                for (var i=1; i<data.tracks.items.length+1; i++){
                    // contains all data pertaining to one result
                    var thisItem = data.tracks.items[i-1];
                    // song name
                    var song = data.tracks.items[i-1].name;
                    var artists = [];

                    for (var y=0; y<thisItem.album.artists.length; y++){
                        artists.push(thisItem.album.artists[y].name);
                    }

                    choicesArr.push(i + " - " + song + " - " + artists.join(', '));
                }
                
                inquirer
                .prompt([
                    {
                    name: "selection",
                    type: "list",
                    message: "Select one of the results:",
                    choices: choicesArr
                    }
                ]).then(function(answer) {
                    // The number from selection - 1 to account for the +1 index in previous block
                    var userSelection = answer.selection.split(' ')[0] - 1;
                    console.log("\n");
                    
                    var res = "Result #" + (userSelection + 1) + " of " + data.tracks.items.length + "\n";
                    var song = "Song Name: " + data.tracks.items[userSelection].name + "\n";
                    var album = "Album: " + data.tracks.items[userSelection].album.name + "\n";

                    // if cannot find preview_url   
                    var pUrl;
                    if (data.tracks.items[userSelection].preview_url === null) {
                        pUrl = ("Preview URL: Not Available" + "\n");
                        // console.log(pUrl);
                    }
                    else {
                        pUrl = "Preview URL: " + data.tracks.items[userSelection].preview_url + "\n";
                        // console.log(pUrl);
                    }

                    var artists = [];
                    for (var i=0; i<data.tracks.items[userSelection].album.artists.length; i++) {
                        artists.push(data.tracks.items[userSelection].album.artists[i].name);
                    }
                    artists = "Artist(s): " + artists.join(', ') + "\n";

                    // Displaying & Logging =========================================
                    var display = res + song + album + artists + pUrl;
                    console.log(display);

                    var log = input + "\n\n" + display + "\n\n";

                    fs.appendFile("log.txt", log, function(err){
                        if (err) {
                            return console.log(err);
                        }
                        else {
                            console.log("Updated log.txt");
                        }
                    })
                })
            }
        });

    },

    stockComm : function(symbol) {
        console.log("searching for symbol: " + symbol + "\n");

        axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + symbol + "&outputsize=compact" + "&apikey=" + keys.alpha_vantage.key).then(
            function(response) {
                var lastRef = response.data['Meta Data']['3. Last Refreshed'].split(' ')[0];
                var lrMessage = "Last Refreshed Date: " + lastRef + "\n";

                var stockMessage = "Stock value of " + symbol + " on " + lastRef + ":" + "\n";
                var stockData = response.data['Time Series (Daily)'][lastRef];

                var display = lrMessage + stockMessage;
                console.log(display);
                console.log(stockData);
                console.log("\n");

                var log = input + "\n\n" + display + JSON.stringify(stockData) + "\n\n";

                fs.appendFile("log.txt", log, function(err){
                    if (err) {
                        return console.log(err);
                    }
                    else {
                        console.log("Updated log.txt");
                    }
                })
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
            var movie = ("Movie Title: " + response.data.Title) + "\n";
            var rel = ("Released: " + response.data.Year) + "\n";
            var iRating = ("IMDB Rating: " + response.data.imdbRating) + "\n";
        
            var hasRT = false;
            var rt;
            for (var i=0; i<response.data.Ratings.length; i++){
                if(response.data.Ratings[i].Source === "Rotten Tomatoes"){
                    rt = ("Rotten Tomatoes Rating: " + response.data.Ratings[i].Value) + "\n";
                    hasRT = true;
                    break;
                }
            }
            if (!hasRT) {
                rt = ("Rotten Tomatoes Rating: None") + "\n";
            }

            var country = ("Country: " + response.data.Country) + "\n";
            var lang = "Language: " + response.data.Language + "\n";
            var plot = ("Plot: " + response.data.Plot) + "\n";
            var actors = ("Actors: " + response.data.Actors) + "\n";

            var display = movie + rel + iRating + rt + country + lang + plot + actors;
            console.log(display);

            var log = input + "\n\n" + display + "\n\n";

            fs.appendFile("log.txt", log, function(err){
                if (err) {
                    return console.log(err);
                }
                else {
                    console.log("Updated log.txt");
                }
            })
            }
        );
    },

    doComm : function() {
        console.log("Reading file and doing ... ");
        fs.readFile('./random.txt', 'utf8', function(err, data){
            if (err) throw err;
            console.log(data);

            var thisComm = data.split(' ')[0];
            if (thisComm === "spotify-this-song"){
                commands.spotifyComm(data.split(' ').slice(1).join(' '));
            }
            else if (thisComm === "stock-check-this"){
                commands.stockComm(data.split(' ').slice(1));
            }
            else if (thisComm === "movie-this"){
                commands.movieComm(data.split(' ').slice(1).join(' '));
            }
            else{
                console.log("Command from file not recognized. Try changing the file contents and trying again.");
            }
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