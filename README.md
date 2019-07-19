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

###Setting up Local Remote Repository
The developer recommends a dual remote repository deployment structure - one titled 'origin' and another titled 'server'. While 'origin' hosts all development branches on a stable third-party provider like GitHub or GitLab, 'server' is hosted locally on the ubuntu machine that maintains the website. The 'server' should ideally only be pushed commits that are stable and intended as updates to the website itself. To configure the local remote, first navigate to the root folder that contains the /dashboard directory, then create a new .git directory with:
````
mkdir -p remote.git
````
The file structure should be the following:
````
.
├── dashboard
└── remote.git
````
Navigate and initialize /remote.git with:
````
cd remote.git
git init --bare
````
The terminal should print out ````Initialized empty Git repository in /home/server/path/to/directory/````. On your local machine (not the Ubuntu server), configure the remote with:
````
git remote add server server@123.456.78.901:~/path/to/remote.git
````
... substituting the ip address and path with whatever matches your Ubuntu server. To ensure everything is working correctly, type the following:
````
git remote -v
````
Which should return:
````
origin  https://gitlab.com/Jamie.Sgro/dashboard.git (fetch)
origin  https://gitlab.com/Jamie.Sgro/dashboard.git (push)
server  server@123.456.78.901:~/path/to/remote.git (fetch)
server  server@123.456.78.901:~/path/to/remote.git (push)
````
To configure the Ubuntu server to pull directly (and solely) from the remote on the same machine, type the following in the Ubuntu terminal:
````
git remote add server ~/path/to/remote.git
git remote -v
````
Which should return:
````
server  /home/server/Documents/code/remote.git (fetch)
server  /home/server/Documents/code/remote.git (push)
````
The file directory on your Ubuntu machine should reflect the following:

````
.
├── dashboard
│   ├── app.js
│   ├── bin
│   ├── node_modules
│   ├── npm_start.bat
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   ├── routes
│   └── README.md
└── remote.git
    ├── HEAD
    ├── branches
    ├── config
    ├── description
    ├── hooks
    ├── info
    ├── objects
    └── refs
````
Once the remote has been set up, development should be streamlined so that when a stable version is ready to be deployed to the website, developers need only push the stable commit to the 'server' remote repository then ssh into the Ubuntu machine and execute the following:
````
 cd path/to/dashboard
 npm start
````
The console log should include parts of the following:
````
From /home/server/path/to/dashboard
 * branch            master     -> FETCH_HEAD
[This should print of the changes since last pull]
Use --update-env to update environment variables
[PM2] Applying action reloadProcessId on app [./bin/www](ids: 0)
[PM2] [www](0) ✓
````
This readout indicates that the website has implemented the update with zero down-time to the site itself.
