require('dotenv').config()

var http = require('http');

var pictureArray = [];

var exif = require('fast-exif');
const fs = require('fs');
var glob = require('glob');
const path = require('path');

initPicturesArray();

http.createServer(function (request, response) {

    var selectedIndex = randomIntFromInterval(0, pictureArray.length);
    var selectedFilePath = pictureArray[selectedIndex];

    console.log(selectedFilePath);

    try {
        var fileStream = fs.createReadStream(selectedFilePath);
        fileStream.on('open', function() {
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.setHeader('Content-Type', 'image/jpeg');
            fileStream.pipe(response);
        });
    } catch (e) {
        response.setHeader('Content-Type', 'text/plain');
        response.write('Please Try Again.');
    }
}).listen(8000);

function initPicturesArray() {
    glob(process.env.PICTURES_ROOT_DIR + "20*/**/*.+(jpg|jpeg)", {nocase: true}, function(err, files) {
        if (err) {
            console.log(err);
        } else {
            pictureArray = files;
            console.log('pictureArray initialized with ' + pictureArray.length + ' pictures.');
        }
    });
}

function initPicturesDictionary() {
    for (var year = process.env.PICTURES_START_YEAR; year < new Date().getFullYear(); year++) {
        console.log('initializing ' + year);
        // picturesDictionary[year] = walkSync(process.env.PICTURES_ROOT_DIR + year).filter(fileName => typeof fileName === 'string' && (fileName.toLowerCase().endsWith("jpeg") || fileName.toLowerCase().endsWith("jpg")));
        //picturesDictionary[year] = glob.sync(process.env.PICTURES_ROOT_DIR + year + "/**/*.+(jpg|jpeg)", {nocase: true});
        picturesDictionary[year] = glob.sync(process.env.PICTURES_ROOT_DIR + "200*/**/*.+(jpg|jpeg)", {nocase: true});
    }
}

function randomIntFromInterval(min,max) {
    min = parseInt(min);
    max = parseInt(max);
    return Math.floor(Math.random()*(max-min+1)+min);
}