/*
 * Kristen Gustafson
 * October 2nd 2023
 *
 * This is the client side JS file that adds behavior to
 * index.html. This file allows a user to generate, browse and
 * read reviews about albums.
 *
 * Sources to read files:
 * https://www.w3schools.com/nodejs/nodejs_filesystem.asp
 */

'use strict';
(function() {

  window.addEventListener("load", init);

  /**
   * Sets up event listeners that can detect whether or not a user
   * is interacting with the page, as well as setting up button behavior
   * for the program and an empty time table
   */
  function init() {
    let backBtn = document.querySelector("#full-review button");
    backBtn.addEventListener("click", backToMain);

    let genBtn = document.getElementById("gen-btn");
    genBtn.addEventListener("click", setUp);

    let textBtn = document.getElementById("text-btn");
    textBtn.addEventListener("click", getInput);
  }

  /**
   * Gathers user input from search bar to gather information from the API accordingly
   */
  function getInput() {
    let input = document.getElementById("search-bar").value;
    input = input.replaceAll(" ", "");

    fetchReview(input);
  }

  /**
   * Makes a GET request to get all the albums, song names, artist name and corresponding images
   */
  async function setUp() {
    try {
      let response = await fetch("setup");
      await statusCheck(response);
      response = await response.text();
      setUpDom(response);
    } catch (err) {
      handleError(err);
    }
  }

  /**
   * Facilitates the user switching views from a full review to
   * the main menu while resetting the text sections
   */
  function backToMain() {
    hide("#full-review");
    unhide("#first-page");
    let headings = document.querySelectorAll("#full-review h3");
    for (let i = 0; i < headings.length; i++) {
      let head = headings[i].textContent;
      const indexColon = head.indexOf(":") + 1;
      headings[i].textContent = head.substring(0, indexColon);
    }
  }

  /**
   * Makes a fetch request to get the review details for a sepcific album ID
   */
  function startReview() {
    const id = this.id;
    fetchReview(id);
  }

  /**
   * Th
   * @param {String} param the album that the API will ask the user for
   */
  async function fetchReview(param) {
    try {
      let response = await fetch("review/" + param);
      await statusCheck(response);
      response = await response.json();
      openCard(response);
    } catch (err) {
      handleError(err);
    }
  }

  /**
   * This function populates the dom with every album from the backend
   * @param {Promose} res response from backend containing album information
   */
  function setUpDom(res) {
    let cardInfo = res.split("***");
    let reviewSpace = document.getElementById("review-space");
    for (let i = 1; i < cardInfo.length - 1; i++) {
      const curInfo = cardInfo[i].split("\n");
      const rawAlbum = curInfo[0];
      const curAlbum = curInfo[1];
      const curArtist = curInfo[2];
      const imgUrl = curInfo[3];

      let curContainer = document.createElement("article");
      curContainer.classList.add("album-card");

      let img = document.createElement("img");
      img.src = imgUrl;
      img.alt = curAlbum;
      img.id = rawAlbum;

      let album = document.createElement("h2");
      album.textContent = curAlbum;

      let artist = document.createElement("h3");
      artist.textContent = curArtist;

      img.addEventListener("click", startReview);

      curContainer.appendChild(img);
      curContainer.appendChild(album);
      curContainer.appendChild(artist);
      reviewSpace.appendChild(curContainer);

      let serach = document.getElementById("text-btn");
      serach.disabled = false;
    }
  }

  /**
   * Populates the full review with the information of the album review that the user
   * clicked on in the main page
   * @param {Promise} res review information
   */
  function openCard(res) {
    hide("#first-page");
    hide("#refresh-warning");
    hide("#user-warning");
    unhide("#full-review");

    let headings = document.querySelectorAll("#full-review h3");
    let masterOrder = ["album", "artist", "rating", "faves", "least_faves",
    "review", "moments", "lyrics"];

    for (let i = 0; i < headings.length; i++) {
      let curText = headings[i].textContent;
      if (res[masterOrder[i]] === "" || res[masterOrder[i]] === undefined) {
        headings[i].textContent = curText + " N/A";
      } else {
        headings[i].textContent = curText + res[masterOrder[i]];
      }
    }
    let img = document.querySelector("#full-review img");
    img.src = res.image;
    img.alt = res.album;
  }

  /**
   * Hides and element, chosen by the given query
   * @param {String} query the query of the element being hidden
   */
  function hide(query) {
    let curElem = document.querySelector(query);
    curElem.classList.add("hidden");
  }

  /**
   * Unhides a previously hidden element using the given query
   * @param {String} query the query of the element being unhidden
   */
  function unhide(query) {
    let curElem = document.querySelector(query);
    curElem.classList.remove("hidden");
  }

  /**
   * Checks a given response to see if the status is ok
   * @param {Promise} res a response to check the status of
   * @returns {Promise} the given response if an error is not thrown
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Displays a message to the user prompting them to refresh the page
   * @param {Promise} err a rejected error promise
   */
  function handleError(err) {
    let mes = err.message;
    if (mes.includes("is not an documented album!")) {
      unhide("#user-warning");
    } else {
      unhide("#refresh-warning");
    }
    console.error(err);
  }

})();