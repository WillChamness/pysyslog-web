# Pysyslog Web

A web application designed specifically to complement the [pysyslog-server](https://github.com/WillChamness/pysyslog-server) project.

# Features

## Web page frontend

This project contains the frontend web page to send Syslog messages via a REST API and retrieve sepcific logs from a database.

Here is what it looks like:

![Syslog Web App Page 1](./.github/syslog-webpage-page1.jpg)

![Syslog Web App Page 2](./.github/syslog-webpage-page2.jpg)

## REST API backend

### Connecting to a database

The backend contains the code for a REST API to send data to the Syslog server
and connect to the MongoDB database.

### UDP socket programming

It will perform UDP socket programming on behalf of the browser to
send actual Syslog messages.

# Installation

## Docker

While this repo can be used in a regular server with Node, it is designed to
be used with Docker specifically.

You can set it up with docker-compose. Copy-paste the following into a
`docker-compose.yml` file and run `docker-compose up -d`:

```
version: "3.4"

services:
  syslog-web:
    image: willchamness/pysyslog-web-nginx:latest
    container_name: psysylog-web
    restart: unless-stopped
    ports:
      - 80:80
    volumes:
      - ./frontend/env/:/var/www/html/env/ # environment variables to be put into the browser such as the API URL
      - ./nginx/:/etc/nginx/
    networks:
      - frontnet
      - backnet

  syslog-web-api:
    image: willchamness/pysyslog-web-api:latest
    container_name: pysyslog-web-api
    restart: unless-stopped
    ports:
      - 3000:3000
    environment:
      - MONGODB_URI=mongodb://mongoadmin:m0ngoadminPW!@mongo # username/password should be same as below
      - SYSLOG_SERVER_ADDR=pysyslog-server
    networks:
      - backnet

  syslog-server:
    image: willchamness/pysyslog-server:latest
    container_name: pysyslog-server
    restart: unless-stopped
    ports:
      - 514:514/udp
    environment:
      - SYSLOG_FILE=syslog.log
      - SYSLOG_LISTEN_ADDRESS=0.0.0.0
      - SYSLOG_LISTEN_PORT=514
      - SYSLOG_USE_DB=yes # if set to 'no', ignore mongodb configuration
      - MONGODB_URI=mongodb://mongoadmin:m0ngoadminPW!@mongo # username/password should be same as below
      - MONGODB_DBNAME=syslog
      - MONGODB_COLLECTION=logs
      - TZ=America/New_York
    volumes:
      - ./syslog:/app/syslog
    networks:
      - frontnet
      - backnet

  mongo:
    image: mongo:4.4
    container_name: pysyslog-db
    restart: unless-stopped
    ports:
      - 27017:27017
    logging:
      options:
        max-size: 1g
    environment:
      - MONGO_INITDB_ROOT_USERNAME=mongoadmin
      - MONGO_INITDB_ROOT_PASSWORD=m0ngoadminPW!
    volumes:
      - ./mongodb-data:/data/db
    networks:
      - backnet

networks:
  frontnet:
    name: pysyslog_frontnet
  backnet:
    internal: true
    name: pysyslog_backnet
```

Note that you will have to create the `frontend/env/env.js` file manually.
This is because there are environment variables that can only be applied when
the file is served to the browser. Use the `frontend/env/env.js.example` file as a template.

You will also need a `nginx/conf.d/*.conf` file for Nginx.

## Manual Installation

Ensure you have `git`, `node` version 20.7.0, and `nginx` installed.

Clone the repo with the command `git clone https://github.com/WillChamness/pysyslog-web`. Then,
run `npm install` in both the project root directory and the `frontend/` directory. You will need
to create and edit a `.env` file. Use the `.env_example` file as a template. Then run
`npm run build` in the `frontend/` directory FIRST, then in the project root directory.

Copy `frontend/build/*` to `/var/www/html/` or to `/var/www/example.com/html` if you plan to use a
custom Nginx config. Next, modify the Nginx config. Use the `nginx/conf.d/default.conf.example`
file as a template. When done, run `sudo systemctl reload nginx` to apply all changes. Also, you
will need to manually create `/var/www/html/env/env.js`. Use the `frontend/env/env.js.example`
file as a template.

Lastly, `cd` back to the project root. Copy the `package.json` file to `./build` and change directory
to `./build`. Then run `npm install --production` and `node server.js`. You can get rid of the files in
the project root now that the project has been built, including `node_modules`.
