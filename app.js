/*
 * Kristen Gustafson
 * October 2nd 2023
 *
 * This is the app.js file that acts as a backend for
 * Kristen's Reviews music review website. This API will provide
 * information about Kristen's reviews for 22 different albums. A user
 * can get in depth reviews about an album, or simply the names and images
 * of each album documented.
 *
 */

'use strict';

const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.static('public'));

// Contains arrays of review details mapped to the raw album name
let reviews = new Map();

// A GET endpoint that gives the user the details of a review for a specified album
app.get("/review/:name", (req, res) => {
  const givenName = req.params.name;
  if (reviews.has(givenName)) {
    const reviewArr = reviews.get(givenName);
    const album = reviewArr[0];
    const artist = reviewArr[1];
    const image = reviewArr[2];
    const rate = reviewArr[3];
    const faves = reviewArr[4];
    const least = reviewArr[5];
    const rev = reviewArr[6];
    const moments = reviewArr[7];
    const lyrics = reviewArr[8];
    res.type("json");
    res.json({"album": album, "artist": artist, "rating": rate, "faves": faves,
      "least_faves": least, "review": rev, "moments": moments, "lyrics": lyrics, "image": image});
  } else {
    const userError = 400;
    const error = res.type("text").status(userError);
    error.send(givenName + " is not an documented album!");
  }
});

// A GET endpoint that returns plain text that contains all the display information for each album
app.get("/setup", (req, res) => {
  init();
  res.type("text");
  let setup = "";
  setup = buildText();
  res.send(setup);
});

/**
 * Reads information in from teh raw_reviews.txt file.
 */
function init() {
  fs.readFile("public/raw_reviews.txt", "utf8", function(err, text) {
    if (err) {
      console.error("Error: " + err.message);
    } else {
      dissectText(text);
    }
  });
}

/**
 * Creates a cleaned global variabe based on the raw review
 * data from a text file
 * @param {String} text full raw reviews
 */
function dissectText(text) {
  let fullReviews = text.split("*&");
  for (let i = 0; i < fullReviews.length; i++) {
    const written = writeReview(fullReviews[i]);
    let albumName = written[0].replaceAll(" ", "");
    albumName = albumName.replaceAll("\r\n", "");
    reviews.set(albumName, written);
  }
}

/**
 * Takes all the raw text for an album and creates an array that describes
 * all the details of that review
 * @param {String} plain a block of text from the raw reviews
 * @returns {Array} all of the details of the review
 */
function writeReview(plain) {
  const albumIndex = plain.lastIndexOf("*&");
  const imageIndex = plain.indexOf("Image");

  const album = plain.substring(albumIndex, plain.indexOf(":"));
  const artist = plain.substring(plain.indexOf(":") + 1, imageIndex);

  const ratingIndex = plain.indexOf("Rating");
  const favesIndex = plain.indexOf("Faves");
  const leastIndex = plain.indexOf("Least faves");
  const reviewIndex = plain.indexOf("Review");
  const momentsIndex = plain.indexOf("Favorite moments");
  const lyricsIndex = plain.indexOf("Favorite lyrics");

  const image = plain.substring(imageIndex, ratingIndex);
  const rating = plain.substring(ratingIndex, favesIndex);
  const faves = plain.substring(favesIndex, leastIndex);
  const leastFave = plain.substring(leastIndex, reviewIndex);
  const review = plain.substring(reviewIndex, momentsIndex);
  const moments = plain.substring(momentsIndex, lyricsIndex);
  const lyrics = plain.substring(lyricsIndex);

  const finalReview = [album, artist, image, rating, faves, leastFave, review, moments, lyrics];

  for (let i = 0; i < finalReview.length - 1; i++) {
    finalReview[i] = finalReview[i].substring(finalReview[i].indexOf(":") + 1);
  }
  return finalReview;
}

/**
 * Creates a large string that contains the "display" information for
 * each documented album in the reviews
 * @returns {String} a string that has starting information to display
 * all the albums
 */
function buildText() {
  let ret = "";
  let albumsIterator = reviews.keys();
  for (let i = 0; i < reviews.size; i++) {
    let curAlbum = albumsIterator.next().value;
    let curReview = reviews.get(curAlbum);
    ret = ret + curAlbum + "\n";
    ret = ret + curReview[0] + "\n";
    ret = ret + curReview[1];
    ret = ret + curReview[2];
    ret = ret + "***";
  }
  return ret;
}

app.use(express.static('public'));
const LOCAL = 8000;
const PORT = process.env.PORT || LOCAL;
app.listen(PORT);