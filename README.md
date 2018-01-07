# hotels-api

[![Build Status](https://travis-ci.org/IslamWahid/hotels-api.svg?branch=master)](https://travis-ci.org/IslamWahid/hotels-api)
[![Maintainability](https://api.codeclimate.com/v1/badges/50b42b563c3ca288a655/maintainability)](https://codeclimate.com/github/IslamWahid/hotels-api/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/50b42b563c3ca288a655/test_coverage)](https://codeclimate.com/github/IslamWahid/hotels-api/test_coverage)

**This is an educational application (RESTFUL API) that allows search in list of hotels by any of the following:**

* Hotel Name
* Destination [City]
* min price [ex: $100]
* max price [ex: $200]
* Date range [ex: 10-10-2020:15-10-2020]

and it allows sorting by:

* Hotel Name
* Price

whether 'ascending' or 'descending'

## Requirements

* Install Docker <https://docs.docker.com/engine/installation/>

## Instructions

* clone Repository then `cd ./hotels-api`

* create docker Image

      docker build -f docker/development/Dockerfile -t hotels-api .

* create docker Container

      docker run -it --name hotels-api -v $(pwd)/:/app -p 4000:4000 -p 5858:5858 hotels-api /bin/sh

now you'll be inside the docker container

* to run tests : `npm test`

* to start the application: `npm start`

then open from your browser <http://0.0.0.0:4000/documentation>
