Kristen's Reviews API Documentation
This API is supposed to provide details about my music reviews, where clients can access information regarding all of my user reviews.

Album Reviews
Request Format: /review/:name

Request Type: GET

Returned Data Format: JSON

Description: This endpoint returns a JSON object containing the review details of the requested album review. These details include the name of the album and artist, favorite lyrics and moments of the album, alongside a rating, image URL and a full written review. One important note is that this is raw text that was taken from my notes app. I sometimes did not finish every aspect of a review so any empty parts details of a review will be returned as an empty string.

Example Request: /review/BonesUk

Example Response:

{
  "album": "Bones Uk",
  "artist": "Bones Uk",
  "rating": "8/10",
  "faves": "girls can't play guitar",
  "least_faves": "",
  "review": "I really liked it!",
  "moments": "",
  "lyrics": "Girls can't play guitar",
  "image": "images/bones_uk.jpg"
}
Error Handling: If you request an album name that does not exist, a message displaying "Sorry album name is not availible!" will be returned with a 400 status error will be returned. Any other invalid behavior will result in a 500 level behavior being returned (ie: not fetching from the correct endpoint, such as not adding "/review" before your album name parameter)

Display Albums
Request Format: /setup

Request Type: GET

Returned Data Format: Plain text

Description: This endpoint returns all of the display information for the documented album reviews in the API. Each album information block is separated by a "***", and contains the raw album name, real album name, artist name and album picture link. Raw album names are the ids by which albums are cataloged in our API. Raw album names are just like the normal album name except they do not have spaces. (Ie: Real album name = "Bones UK" and Raw = "BonesUK"). We reccomend using the raw album name as an id as well!

Example Request: /setup

Example Response:

***BonesUK
Bones UK
Bones UK
images/bones_uk.jpg
***InfinitelyOrdinary
Infinitely Ordinary
The Wrecks
images/infinetly_ordinary.jpg
***WetLeg
Wet Leg
Wet Leg
images/wet_leg.jpg
***Stain
Stain
DE’WAYNE
images/stains.jpg
***WhatCouldPossiblyGoWrong
What Could Possibly Go Wrong
Dominic Fike
images/what_go_wrong.jpg
***Pony
Pony
Rex Orange County
 images/pony.jpg
***Whoarethegirls?
Who are the girls?
Nova Twins
 images/who_are_girls.jpg
***Atlast
At last
Etta James
images/at_last.jpg
***Don’tlettheKidsWin
Don’t let the Kids Win
Julia Jacklin
images/kids_win.jpg
***SAINTMAKER
SAINTMAKER
Bonelang
images/saintmaker.jpg
***DiscographyReadythePrince
Discography Ready the Prince
Ready the Prince
images/ready_the_prince.jpg
***Wait
Wait
Arlie
images/wait.jpg
etc...
Error Handling: Invalid behavior will result in a 500 status error being returned (ie: not fetching from the correct endpoint, such as not correctly accessing the /setup endpoint)
