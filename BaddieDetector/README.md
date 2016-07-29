# Baddie Detector
BaddieDetector Website

### Overview
Baddie Detector is a website aimed at crawling Riot's API and returning particular statistics aimed at determining if the user is "bad" or not. 
This website is entirely objectively subjective and built for fun (non-profit).

### How to run
Set app.js as Node.js start-up file.
Microsoft Visual Studio 2015 build and debug node project.

### Developer-dependency
Microsoft Visual Studio 2015 Community was used to run & debug this project.

### npm-Dependencies
1. body-parser
2. cookie-parser
3. debug
4.express
5. jade
6. method-override
7. mongodb
8. morgan
9. serve-favicon
10. serve-static
11. stylus

### Bower-Dependencies
1. jQuery

### Views
User will search a summoner's name and statistics from Riot's API will be returned. 

### Planned features
Logging IP Address, number of searches, etc.
Linking and managing a database system (MongoDB).
Decorate the front-end via Angular.js, bootstrap.
Programming internal timer to prevent website's APIKey over-the-limit APIKey abuse (it's not a production key).
May switch out jQuery.js for Vanillia.js or take it out completely.
May change system deployment to UNIX and use gulp to run Node.js.