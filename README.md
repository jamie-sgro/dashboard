# SDSN Cananada Dashboard

This project involves building a one-page online dashboard for visualizing an SDG Cities Index that is both open-sourced and legally shareable. This includes a three-panel layout that dynamically resizes to based on the viewport. Panel-1 (top left) includes a leaflet map with interactable markers representing each city included. Panel-2 (right) contains a horizontal barplot indicating the various 'scores' for each indicator measured by the city/marker. Panel-2 can toggle a leader-laggard graph that indicates the min and max scores for each indicator with a circle marking the indicator score for the selected city. Panel-3 (bottom left) indicates the selected city name, a table including it's total score and relative ranking, and a vertical barplot sorting total scores from heighest to lowest with the current cities position highlighted.

## Getting Started

Open command prompt/terminal and navigate to the root folder you wish to host the file:
````
cd C:\Users\Name\Documents\Subfolder
````
Then clone the repository with:
````
git clone https://gitlab.com/Jamie.Sgro/dashboard.git
````
Navigate to the cloned repo with:
````
cd dashboard
````

### Install Dependencies

Ensure all modules are up to date with:
````
npm install
````

### Boot Up Localhost Server

To locally host the server and ensure everything is working correctly run the following within the 'dashboard' directory:
````
node ./bin/www
````
Note that the same function can be executed by double-clicking npm_start.bat or typing the following into your command prompt/terminal:
````
npm test
````
A server session should begin the run with a readout of the current ip-address in the command prompt/terminal.

To ensure the website is running, navigate to http://localhost:3000 on your default browser. The server can be shut down by pressing ctrl-c at any time from within the command prompt/terminal.

### Prerequisites

Note that the dashboard requires the following libraries and their dependents:

````
async
cookie-parser
cors
d3
debug
ejs
express
http
leaflet
morgan
npm
papaparse
request
````

## Deployment

On a remote machine, clone the repository as before. The development team recommends Ubuntu (server) with an ssh key instead of a password, a root --> server account hierarchy, and Nginx with Pm2. Set up a remote proxy to redirect port :3000 using your favourite online tutorial, and pm2 using the following:
````
npm install pm2
````
If a web domain or static DNS has been included, be sure to edit the following line in ./public/javascripts/main.js to match your website name:
```diff
-const locHost = "http://www.sdsn-canada-dashboard.tk/";
+const locHost = "http://www.your-static-dns.com/";
```

## Action Chain
The bin\www file navigates to the app and subsequent \routes folder. All user related data (i.e. username & password) are passed to the user-server on port :8080. Upon authentication, users have access to http://127.0.0.1:3000/ui. All data used to generate cryptocurrency-realted graphs are fetched through \dbServer\server.js on port :8081.
## Author
* **Jamie Sgro** - *Developer*
