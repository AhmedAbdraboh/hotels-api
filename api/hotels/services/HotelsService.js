'use strict';
// @ts-check

const _ = require('lodash');
const fetch = require('node-fetch');
const Boom = require('boom');
const moment = require('moment');
const SERVICE_URL = require('hapi-arc').config.apis.hotels;

class Hotels {
  constructor () {
    this.initialized = false;
  }

  async init () {
    let result = await fetch(SERVICE_URL);
    result = await result.json();
    this.allHotels = result.hotels;
    this.initialized = true;
    return this;
  }

  /**
   * check if hotel name includes search string
   * @param {string} hotelName
   * @param {string} searchName
   * @returns boolean
   * @memberof Hotels
   */
  _doesNameInclude (hotelName, searchName) {
    return _.includes(
      _.chain(hotelName)
        .lowerCase()
        .trim('hotel')
        .trim()
        .value(),
      _.chain(searchName)
        .lowerCase()
        .trim()
        .value()
    );
  }

  /**
   * check if hotel city same as search city
   * @param {string} hotelCity
   * @param {string} searchCity
   * @returns boolean
   * @memberof Hotels
   */
  _doesCityEqual (hotelCity, searchCity) {
    return (
      _.chain(hotelCity)
        .lowerCase()
        .trim()
        .value() ===
      _.chain(searchCity)
        .lowerCase()
        .trim()
        .value()
    );
  }

  /**
   * check if hotel availability includes specific date range
   * @param {array} hotelAvailability
   * @param {string} fromDate
   * @param {string} toDate
   * @returns boolean
   * @memberof Hotels
   */
  _isAvailableInRange (hotelAvailability, fromDate, toDate) {
    let result = false;
    const format = 'DD-MM-YYYY';
    _.forEach(hotelAvailability, ({ from, to }) => {
      from = moment(from, format);
      to = moment(to, format);
      if (
        moment(fromDate).isBetween(from, to) &&
        moment(toDate).isBetween(from, to)
      ) {
        result = true;
        return;
      }
    });
    return result;
  }

  /**
   * check if hotel availability includes specific date
   * @param {array} hotelAvailability
   * @param {string} checkDate
   * @returns boolean
   * @memberof Hotels
   */
  _isAvailableInDate (hotelAvailability, checkDate) {
    let result = false;
    const format = 'DD-MM-YYYY';
    _.forEach(hotelAvailability, ({ from, to }) => {
      from = moment(from, format);
      to = moment(to, format);
      if (moment(checkDate).isBetween(from, to)) {
        result = true;
        return;
      }
    });
    return result;
  }

  /**
   *  1. filter hotels list based on query
   *  2. sort the list based on sorting params
   * @param {object} {
   *     name,
   *     city,
   *     minPrice,
   *     maxPrice,
   *     fromDate,
   *     toDate,
   *     sortBy,
   *     sortType
   *   }
   * @returns array
   * @memberof Hotels
   */
  search ({
    name,
    city,
    minPrice,
    maxPrice,
    fromDate,
    toDate,
    sortBy,
    sortType
  }) {
    const self = this;
    if (!self.initialized) {
      throw Boom.badImplementation('You need to call init() first');
    }

    return _.chain(self.allHotels)
      .filter((hotel) => {
        let result = true;
        if (name && !self._doesNameInclude(hotel.name, name)) {
          result = false;
        }
        if (city && !self._doesCityEqual(hotel.city, city)) {
          result = false;
        }
        if (minPrice && !(hotel.price >= minPrice)) {
          result = false;
        }
        if (maxPrice && !(hotel.price <= maxPrice)) {
          result = false;
        }
        if (
          fromDate &&
          toDate &&
          !self._isAvailableInRange(hotel.availability, fromDate, toDate)
        ) {
          result = false;
        }
        else if (
          (fromDate || toDate) &&
          !self._isAvailableInDate(hotel.availability, fromDate || toDate)
        ) {
          result = false;
        }
        return result;
      })
      .orderBy([sortBy], sortType)
      .value();
  }
}

module.exports = { Hotels };
