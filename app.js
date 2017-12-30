require('dotenv').config()

var http = require('http');

var picturesDictionary = {};

const FileSystem = require('fs');
const Path = require('path');

initPicturesDictionary();

http.createServer(function (request, response) {

    // Pictures are organized by year - pick a random year between
    // the PICTURES_START_YEAR and the current year.
    // Then select a random .jpg or .jpeg file
    var yearDir = randomIntFromInterval(process.env.PICTURES_START_YEAR, new Date().getFullYear());

    var picturesArray = picturesDictionary[yearDir] || readDirRecursive(process.env.PICTURES_ROOT_DIR + yearDir).filter(fileName => fileName.toLowerCase().endsWith("jpeg") || fileName.toLowerCase().endsWith("jpg"));
    var selectedIndex = randomIntFromInterval(0, picturesArray.length);
    var selectedFilePath = picturesArray[selectedIndex];

    console.log(selectedFilePath);

    try {
        var fileStream = FileSystem.createReadStream(selectedFilePath);
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
        picturesDictionary[year] = readDirRecursive(process.env.PICTURES_ROOT_DIR + year).filter(fileName => fileName.toLowerCase().endsWith("jpeg") || fileName.toLowerCase().endsWith("jpg"));
    }
}

function randomIntFromInterval(min,max) {
    min = parseInt(min);
    max = parseInt(max);
    return Math.floor(Math.random()*(max-min+1)+min);
}

function readDirRecursive(dir) {
    return FileSystem.statSync(dir).isDirectory()
        ? Array.prototype.concat(...FileSystem.readdirSync(dir).map(f => readDirRecursive(Path.join(dir, f))))
        : dir;
}
