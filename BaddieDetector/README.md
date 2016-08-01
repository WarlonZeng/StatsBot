# Baddie Detector
BaddieDetector Website

## Overview
Baddie Detector is a website aimed at crawling Riot's API and returning particular statistics aimed at determining if the user is "bad" or not.

This website is entirely objectively subjective and built to train my development skills (non-profit).

Website is entirely one-page.

## Technologies involved
* MEAN Stack

> Currently, MongoDB and Angular.js are not employed yet.

## Techniques involved
* Ajax calls
* JSON parsing
* File systems

## Usuage
User will search a summoner's name and statistics from Riot's API will be returned. 

## How to run
Set app.js as Node.js start-up file.

Microsoft Visual Studio 2015 build and debug node project.

## Developer-dependency
Microsoft Visual Studio 2015 Community was used to run & debug this project.

## npm-dependencies
###Latest Versions 7/31/2016
1. body-parser
2. cookie-parser
3. debug
4. express
5. jade
6. method-override
7. mongodb
8. morgan
9. serve-favicon
10. serve-static
11. stylus

## Bower-dependencies
### Latest Versions 7/31/2016
1. jQuery

## Planned features
* Logging IP Address, number of searches, etc.
* Linking and managing a database system (MongoDB). 
* Decorate the front-end via Angular.js, bootstrap.
* Programming internal timer to prevent website's APIKey over-the-limit APIKey abuse (it's not a production key).
* May switch out jQuery.js for Vanillia.js or take it out completely.
* May change system deployment to UNIX and use gulp to run Node.js.
* TCP connection via socket.io npm module to livecheck if API key is ready to use.

## Changelog
### v1.0.0: 
* BaddieDetector website initiated with base features.

### v1.0.1: 
* Logs last time APIKey was used into server as a .txt file.

### v1.0.2: 
* Increased API key security:
 * Created 2400 milliseconds delay per search server-wide to prevent API rate limit abuse (Riot Games' rates are 1.2 calls/sec continuous). 
 * Alerts user if any search was made within 2400ms to the server and specifies time left for next available search.