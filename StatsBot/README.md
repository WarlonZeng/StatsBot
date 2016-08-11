# StatsBot
StatsBot Website (formerly BaddieDetector)

## Overview
StatsBot is a website aimed at crawling Riot's API and returning particular statistics aimed at determining if the user is "bad" or not.

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
User will search a summoner's name and various statistics from Riot's API will be returned. 

## How to run
1. Set app.js as Node.js start-up file.
2. Microsoft Visual Studio 2015 build and debug node project.

## Developer-dependency
Microsoft Visual Studio 2015 Community was used to run & debug this project.

## npm-dependencies
###Latest Versions
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

## Bower/browser-dependencies
### Latest Versions
1. jQuery
2. Bootstrap
3. bootstrap-social
4. datatables
5. datatables-plugins
6. datatables-responsive
7. flot
8. flot-tooltip
9. font-awesome
10. metismenu
11. morrisjs
12. raphael

## Mini-Dev Blog
8/10/16

Until I set up a full blogging system I'll use this for now. I used Node.js with express.js framework to develop this site. 
As far as I am in webdev, Node.js is extremely versatile in web development. The startup server file is in .js. 
The server can mark any file as server-sided by requiring it in startup file. Node.js is essentially a full blooded server-sided technology.
Node.js has npm, and can virtually grab any module Bower can. Bower is a package manager like npm, but deals primarily in front-end framworks. 
I like to keep server-sided modules in npm, and client-sided modules in Bower. 
Unfortunately, visual studio 2015 doesn't have built-in support for Bower in nodejs express apps like npm does. 
I did a little poking around and found ASP.NET 5, where Bower and npm are built-in like visual studio advertises.
However, the startup server file is in C#, a different language than your typical html-css-js trio.
As for MongoDB and Angular.js, wiring the database in will be pushed way into the future. Angular.js may be used soon in conjuction with google-charts.

TL;DR: May change Express.js + Node.js into ASP.NET 5.

## Planned features
### High-priority:
* TCP connection via socket.io npm module to livecheck if API key is ready to use (might be done with eventlistener instead).
* Logging IP Address, number of searches, etc.
* Decorate the front-end via Angular.js, bootstrap (bootstrap employed!)
* Multi-page dashboard w/ sidebar website overhaul (in alpha phase!)

### Medium-priority:
* Linking and managing a database system (MongoDB). 
* Enabling cookies/caches/localstorage for returning users.

### Low-priority:
* May switch out jQuery.js for Vanillia.js or take it out completely.
* May change system deployment to UNIX and use gulp to run Node.js.

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