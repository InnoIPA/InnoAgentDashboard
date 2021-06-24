# InnoAgent Demo Dashboard

This package provides the InnoAgent dashboard and its source code.

- If you want to customize or re-develop this dashboard, see how to customize or re-develop the chapter description.

---

## System requirements

- Linux (Ubuntu) or Windows
- node.js
- npm

This package supports both public and private clouds. If used in private cloud environments, a Docker engine is required.

- docker(Linux container)

If you want to use the docker-compose method to execute, must have docker and docker-compose installed.

- docker compose

---

## Configure file

### Connect to the InnoAgent web service

Before you start the InnoAgent dashboard service, you must be set the InnoAgent Web Service IP into the following file.

- src/js/config/commonConfig.js

```JS

/*
 * serviceAddress (string)
 * If the server is hosting on public cloud, the variable serverAddress must be given its value.
 *
 */
export const serviceAddress = "https://innoagectlv4v5.azurewebsites.net";

```

## Add device into the deviceConfig file

Modify the "deviceConfig" file to add new InnoAgent devices and control page elements visible status.

- src/js/config/deviceConfig.js

> The "serialNumber" field is the device MAC address without ":" symbol.

```javascript
export const deviceConfig = [
  {
    serialNumber: "999A8D759B2D",
    name: "InnoAgent #1",
    "reboot-button": true,
    "power-button": true,
    "gpio-button": true,
    "tty-button": true,
    "config-button": true,
    "function-test": true,
  },
  {
    serialNumber: "999A8D759B2A",
    name: "InnoAgent #2",
    "reboot-button": true,
    "power-button": true,
    "gpio-button": true,
    "tty-button": true,
    "config-button": true,
    "function-test": true,
  },
];
```

## Building from source code

1. To create the production build, using the following command.

- Windows

  > npm run releasew

- Linux OS

  > npm run releasel

2. After the release script is complete, you can build a Docker image or deploy them to Azure. For more information, see the relevant section description.

## Running the application

### Deploy to private cloud (Using the docker)

If your environment doesn't have docker compose installed, or you want to manually build InnoAgent Dashboard docker images, you can use the following script to build & save docker image.

If you already have InnoAgent Dashboard docker images, following step 3 describe to deploy.

1. Build the docker images.

- Linux
  > ./build-docker-images.sh
- Windows
  > ./build-docker-images.cmd

2. Execute export built docker images, this step can export built images to another computer.

- Linux
  > ./save-image.sh
- Windows
  > ./save-image.cmd

Before run the following command, please make sure the InnoAgent dashboard docker images has been existing in export-images folder.

3. Deploy the InnoAgent Dashboard.

- Linux
  > ./deploy.sh
- Windows
  > ./deploy.cmd

### Deploy to private cloud (Using the docker-compose)

Docker compose can makes build and run in one-click, we recommend use this method to build and run the InnoAgent Dashboard.

Using the following script to deploy InnoAgent Dashboard.

- Linux
  > ./install.sh
- Windows
  > ./install.cmd

---

## The script file usage

This section describes usage for another script file.

## Start dashboard

You can use the following script to start InnoAgent dashboard.

Note: This script for non-first-time start dashboard only! If you are first time run the InnoAgent dashboard, please follow "Deploy" section instructions.

Go to the "release" folder.

cd release/scripts

Start InnoAgent dashboard.

Linux
./start-dashboard.sh

Windows
./start-dashboard.cmd

## Stop dashboard

You can use the following script to stop InnoAgent dashboard.

Note: This script only stop existing InnoAgent dashboard but not remove it, if you want to permanently remove it, please follow "Remove dashboard" section instructions.

1. Go to the "release" folder.

   > cd release/scripts

2. Start InnoAgent dashboard.

- Linux
  > ./stop-dashboard.sh
- Windows
  > ./stop-dashboard.cmd

---

## Remove dashboard

If you want to remove the InnoAgent dashboard service, execute those command in Linux terminal.

Go to the "release" folder.

> cd release/scripts

Execute the remove script to remove InnoAgent dashboard.

- Linux
  > ./remove.sh
- Windows
  > ./remove.cmd

---

## Verify dashboard start status

After started the InnoAgent dashboard, you can check the dashboard status via the URL

> http://{YourDomainName}

![avatar](dashboard.png)

---

## How to customize or re-develop

All source codes are located in the "src" directory.
- This source code is just for the demo propose.
- To keep this example simple, if you need it, you can modify the location of the device config source, to get it from your own web service.



```
.
|-- dist                                                            // The build output folder
    |-- ...
|-- node_modules                                                    // The project dependencies
|   |-- ...
|-- release                                                         // The docker build file folder
|   |-- ...
|-- src                                                             // All source codes
|   |-- assets
|   |   |-- ...
|   |-- html                                                        // Page layouts
|   |   `-- pages       
|   |       |-- deviceInfoTabs.html                                 // Device tabs section
|   |       |-- gpioButtonAlert.html                                // GPIO pop-up page
|   |       |-- header.html                                         // Header section
|   |       |-- powerSwitchAlert.html                               // Power switch pop-up
|   |       |-- uartPassThruAlert.html                              // UART PassThur pop-up
|   |       `-- updateDeviceConfigAlert.html                        // Update board config pop-up
|   |-- js
|   |   |-- components                                              // Components
|   |   |   |-- device                                              // Device control components
|               | -- ...                                              
|   |   |   `-- pages                                               // Page components
|   |   |       |-- ...
|   |   |-- config                                                  // Device config file.
|   |   |   |-- ...
|   |   |-- library                                                 // Shared libraries
|   |   |   |-- utils
|   |   |   |   |-- ...
|   |   |   |-- ...
|   |   |-- pages                                                   // The main page generator js
|   |   |   |-- ...
|   |   |-- ...
|   |-- style                                                       // Page stylesheets
|   |   `-- css
|   |       |-- webfonts
|   |       |   |-- ...
|   |       |-- ...
|   |-- index.html                                                  // Main html
|   `-- index.js                                                    // Main js
|-- ReadMe.md                                                       // * Current file
|-- dashboard.png
|-- favicon.ico
|-- folder.txt
|-- package-lock.json
|-- package.json
|-- release-win.cmd                                                 // Build script (Windows)
|-- release.sh                                                      // Build script (Linux)
`-- webpack.config.js
                               
```
