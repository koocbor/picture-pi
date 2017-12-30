require('dotenv').config()

var http = require('http');

var picturesDictionary = {};

const fs = require('fs');
const path = require('path');
const walkSync = (d) => fs.statSync(d).isDirectory() ? fs.readdirSync(d).map(f => walkSync(path.join(d, f))) : d;

initPicturesDictionary();

http.createServer(function (request, response) {

    // Pictures are organized by year - pick a random year between
    // the PICTURES_START_YEAR and the current year.
    // Then select a random .jpg or .jpeg file
    var yearDir = randomIntFromInterval(process.env.PICTURES_START_YEAR, new Date().getFullYear());

    var picturesArray = picturesDictionary[yearDir] || walkSync(process.env.PICTURES_ROOT_DIR + yearDir).filter(fileName => typeof fileName === 'string' && (fileName.toLowerCase().endsWith("jpeg") || fileName.toLowerCase().endsWith("jpg")));
    var selectedIndex = randomIntFromInterval(0, picturesArray.length);
    var selectedFilePath = picturesArray[selectedIndex];

    console.log(selectedFilePath);

    try {
        var fileStream = fs.createReadStream(selectedFilePath);
        fileStream.on('open', function() {
            response.setHeader('Content-Type', 'image/jpeg');
            fileStream.pipe(response);
        });
    } catch (e) {
        response.setHeader('Content-Type', 'text/plain');
        response.write('Please Try Again.');
    }
}).listen(8000);

function initPicturesDictionary() {
    for (var year = process.env.PICTURES_START_YEAR; year < new Date().getFullYear(); year++) {
        console.log('initializing ' + year);
        var tmp = walkSync(process.env.PICTURES_ROOT_DIR + year);
        picturesDictionary[year] = walkSync(process.env.PICTURES_ROOT_DIR + year).filter(fileName => typeof fileName === 'string' && (fileName.toLowerCase().endsWith("jpeg") || fileName.toLowerCase().endsWith("jpg")));
    }
}

function randomIntFromInterval(min,max) {
    min = parseInt(min);
    max = parseInt(max);
    return Math.floor(Math.random()*(max-min+1)+min);
}

// function readDirRecursive(dir) {
//     return FileSystem.statSync(dir).isDirectory()
//         ? Array.prototype.concat(...FileSystem.readdirSync(dir).map(f => readDirRecursive(Path.join(dir, f))))
//         : dir;
// }
