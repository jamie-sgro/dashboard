[![Unit Tests](https://github.com/jamie-sgro/dashboard/actions/workflows/unit_tests.yml/badge.svg)](https://github.com/jamie-sgro/dashboard/actions/workflows/unit_tests.yml)

🌐 [View Live Dashboard!](https://sdsn-canada-dashboard.tk/home)

# SDSN Cananada Dashboard

This project involves building a one-page online dashboard for visualizing an SDG Cities Index that is both open-sourced and legally shareable. This includes a three-panel layout that dynamically resizes to based on the viewport. Panel-1 (left) includes a control panel, to select averaging methods and select particular cities to view in more detail. Panel-2 (middle) indicates the selected city name, a table including it's total score and relative ranking, and a barplot sorting total scores from highest to lowest with the current cities position highlighted. Panel-3 (right) contains a horizontal barplot indicating the various 'scores' for each indicator measured by the city/marker. Panel-3 can toggle a leader-laggard graph that indicates the min and max scores for each indicator with a circle marking the indicator score for the selected city.

## Getting Started

Open command prompt/terminal and navigate to the root folder you wish to host the file:
````
cd C:\Users\Name\Documents\Subfolder
````
Then clone the repository with:
````
git clone https://github.com/jamie-sgro/dashboard.git
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
npm run dev
````
A server session should begin the run with a readout of the current ip-address in the command prompt/terminal.

To ensure the website is running, navigate to http://localhost:3000 on your default browser. The server can be shut down by pressing ctrl-c at any time from within the command prompt/terminal.

### Docker

- On versions >1.3.3, run `docker build .` and `docker-compose up` to boot the development server on localhost:3000
- Docker testing can be run in isolation with `docker-compose run --rm test`

## Deployment

On a remote machine, run `npm run ci` to pull the repository and rebuild the docker container and spin-up the container. The development team recommends Ubuntu (server) with an ssh key instead of a password, a root --> server account hierarchy, and Nginx with Docker. Set up a remote proxy to redirect port :3000 using your favourite online tutorial
- For those with access to the current production server, a shorthand command would be:
  `sudo su;cd Documents/code/dashboard;npm run ci;`

## Authorship
* **Cameron McCordic** - *Project Manager*
* **Bruce Frayne** - *Principal Investigator*
* **Jamie Sgro** - *Lead Developer*



### Thank you to our wonderful contributors!

* **Shelby Sgro**
* **Vishal Sharma**
* **Chris Keppler**
* **Snehaa Suryanarayanan**
* **Jay Clark**
* **Justin McIntosh**
