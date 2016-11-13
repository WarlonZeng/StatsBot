# StatsBot
StatsBot Website

## Overview
StatsBot is a website aimed at crawling Riot's API and returning particular statistics aimed at determining the skills of the searched current-season ranked player.

This website is entirely objectively subjective and built to train my development skills (non-profit).

Website is entirely one-page.

## Technologies involved
* MEAN Stack

> Currently, Angular.js is not employed yet, but may not ever need (jQuery is an alternative).

## Techniques involved
* Ajax calls
* JSON parsing
* File systems
* Databases queries

## Usuage
User will search a summoner's name and various statistics from Riot's API will be returned. Summoner must be ranked and must be playing in the current season.

## How to run
1. Download nginx, mongodb, and pm2 from their respective sources (nginx website, mongodb website, npm)
2. Start mongodb service (sudo service mongodb start)
3. Start Nginx (sudo service nginx start)
~~4. unix command: "PORT=54321 pm2 start app1.js" 2..2. 3..3, etc. (multi-server).~~
4. pm2 start app1/2/3/4.js

## Service paths
Database information will be stored in default path /var/lib/mongodb. A glimpse of what database information looks like is included in this GitHub StatsBot/db. Nginx reverse-proxying config is set up in StatsBot/nginx; simply "sudo cp -f nginx.conf /etc/nginx/nginx.conf" to copy-paste over default config file.

## Developer-dependency
Microsoft Visual Studio 2015 Community was used to run & debug this project. Linux is preferred for deployment, but Microsoft VS 2015 is by far the best IDE.

## npm-dependencies
###Latest Versions
1. body-parser
3. debug
3. express
4. method-override
5. mongodb
6. request
7. serve-favicon
8. serve-static
9. stylus
10. pm2 (global)

## Bower/browser-dependencies
### Latest Versions
1. bootstrap
2. font-awesome
3. jquery
4. magnific-popup
5. scrollreveal

## Mini-Dev Blog
### 8/10/16

Until I set up a full blogging system I'll use this for now. I used Node.js with express.js framework to develop this site. 
As far as I am in webdev, Node.js is extremely versatile in web development. The startup server file is in .js. 
The server can mark any file as server-sided by requiring it in startup file. Node.js is essentially a full blooded server-sided technology.
Node.js has npm, and can virtually grab any module Bower can. Bower is a package manager like npm, but deals primarily in front-end framworks. 
I like to keep server-sided modules in npm, and client-sided modules in Bower. 
Unfortunately, visual studio 2015 doesn't have built-in support for Bower in nodejs express apps like npm does. 
I did a little poking around and found ASP.NET 5, where Bower and npm are built-in like visual studio advertises.
However, the startup server file is in C#, a different language than your typical html-css-js trio.
As for MongoDB and Angular.js, wiring the database in will be pushed way into the future. Angular.js may be used soon in conjuction with google-charts.

## 8/21/16
Revoked Angular.js until I learn how to thoroughly use it. Used google-charts with custom features, changed objective of website to a more popular one: if user is 
OTP or generally good. Scrapped sidebar with top-side navigation, another bootstrap free template. I researched into website popularity and essentially what I got was 
MEAN STACK > ASP.NET. Bower is fully implemented with visual studio 2015 update 3. MongoDB not going to be implemented anytime soon, my site may be a 100% dynamic site. 
MVC revoked in favor of SOA architecture. !! I MAY MAKE THIS SITE A FULLY DISTRIBUTED SYSTEM IN THE FUTURE !! With Cookies/Cache/LocalStorage/Sessions and advanced multithreading.

## 8/22/16
Primary chart nearly completion. Will try to improve processing speed after getting functionality down.

## 8/23/16
HTML5 > SVG. The future is HTML5. Planning features for quick search with caches/cookies. Probably database first though.

## 8/24/16
Used cookies to process cross-region search. Planning to use cookies to shorten ajax calls, currently the ajax calls are as follows:
Get StaticData (get static champion data) -> Get APIKeyReadyStatus: (if in limit, wait user) -> Search summoner: (get id) -> Get Champion Data (get ranked data). 
I plan to do async callbacks after getting basic functionality down.

## 8/28/16
Took me awhile to learn the entirety of asynchronous calls. All asynchronous calls are pushed out of the synchronous execution flow. The only
practical way to get a synchronous to work with asynchronous is through a callback. Callbacks after callbacks. Holy hell. And the asynchronous calls
can be performed in parallel too. Basically JavaScript being single-threaded and then multi-threaded after finishing single-threaded. The async function
did not arrive in ES7 2016, I think right now it's at stage 3 or 4 for the proposal. So I used promise.then() and ajax.done().

Feels like I can make a fully distributed system now with C++ multi-threading and js asynchronous events... race condition... concurrency... blah.

## 8/29/16
I think it is safe to say my website has finished local hosting development. I hope to ship it to AWS cloud services.
Custom Queue class defined and used to handle API Key abuse. If using service for first time -> enqueue twice.
If using service again -> enqueue once. Cool feature: Clients automatically "dequeue" from service after 600 seconds. 
Cookies are used for local region, may implement for summoner name-id to reduce http calls. Server does some initialization at start up to improve computing speeds for clients. 

## 9/2/16
Implemented MongoDB. MongoDB is a NoSQL database, which I believe to be efficient for document-style warehousing. Server is linked to database from get-go, connection is dropped
upon server termination. Currently deploying now to AWS. Planning to write an informal software engineering doc soon.

## 9/3/16
Got my website working on Linux Ubuntu 16.0.4 LTS VM. Aiming for AWS cloud deployment soon. Deployed Amazon Linux Ubuntu on the cloud with Nginx reverse proxy for running multiple instances of server. This means high scability is achieved by reducing server load on a single-node system to a multi-node system. Fault tolerance is improved greatly; if one server fails, another server is present and, by default, pm2 automatically restarts any crashed server. All settings are more of less finalized, I'm tired and school is starting.

## Planned features
### Priorities:
* TCP connection via socket.io npm module to livecheck if API key is ready to use (might be done with eventlistener instead). (implemented as http)
* Logging IP Address, number of searches, etc. (logged last time my service was used)
* Frontpage form validation.
* More validation + error handling.
* Linking and managing a database system (MongoDB). (db not implemented yet)
* Enabling cookies/caches/localstorage for returning users. (cookies enabled, caches enabled)
* May switch out jQuery.js for Vanillia.js or take it out completely. (8/29/16 jQuery seems good)
* May change system deployment to UNIX and use gulp to run Node.js. (pm2)

## Changelog
### v1.0.0: 
* BaddieDetector website initiated with base features.

### v1.0.1: 
* Logs last time APIKey was used into server as a .txt file.

### v1.0.2: 
* Increased API key security:
 * Created 2400 milliseconds delay per search server-wide to prevent API rate limit abuse (Riot Games' rates are 1.2 calls/sec continuous). 
 * Alerts user if any search was made within 2400ms to the server and specifies time left for next available search.

### v1.0.3:
* Added favicon.ico.
* Decreased server response time:
 * Accessing last search via file-system logging is performed with realtime variables.

### v1.0.4:
* Redesigned search box:
 * Added a search icon for submitting input.
 * Added outline with curved edges.

### v1.1.0:
* BaddieDetector now renamed to StatsBot!
* Multi-page features w/ sidebar navigation (templated from SB Admin 2.0 Bootstrap's free templates):
 * List elements are not configured yet, but they will be:
  * Home (will be renamed from dashboard, under construction!)
  * Champion Info (under construction!)
  * Runes & Masteries (under construction!)
  * Gamemode Info (under construction!)
  * Summary (functional!)

### v2.0.0:
* Removed previous user features
* Now shows a graph that can tell if user is an One Trick Pony or has big champion pool! 

### v2.1.0:
* Improved chart interface!
 * Now you now the exact champion on sight

### v2.1.1
* Data points are now circles!

### v2.2.0:
* Frontpage and main page updated!
 * Logo is out!

### v2.3.0:
* Improved computing speed:
 * Backend: Website now performs asynchronous operations for asynchronous functions.

### v3.0.0: 
* More graphs!
 * Avg KDA, Avg Kills, Avg Deaths, and Avg Assists per game.

### v3.1.0:
* Added MongoDB:
 * Logs name and id as key-value pair.

### v3.2.0:
* Effectively 1.5x website scale with database implementation
 * New searches = 2 api call
 * Old searches = 1 api call
  * The fewer the API call, the more I can serve!

### v3.3.0:
* Changed deployment to Linux
 * Ubuntu compatible

### v3.4.0:
* Deployment to cloud finalized
 * Uses Amazon Linux Ubuntu for deployment
 * Uses Nginx for reverse proxy
   * There are 4 server instances running behind Nginx on 4 separate ports.
