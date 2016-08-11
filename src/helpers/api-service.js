/**
 * API Service module.
 * @module api_service
 */

import config from './api-config';
import makeRequest from './request';

const apiEndpoint = config.apiEndpoint;
const service = {};

function getAllRecords(urlWithParams) {
  return new Promise((resolve, reject) => {
    let series = [];
    const opts = {};

    const recursivelyGetPages = (url) => {
      opts.method = 'GET';
      opts.headers = {
        Accept: 'application/json',
      };
      opts.url = url;
      makeRequest(opts)
        .then((response) => {
          if (!response) {
            reject(Error('No response from server'));
          }
          series = series.concat(response.results);
          if (!response.next) {
            resolve(series);
          } else {
            recursivelyGetPages(response.next);
          }
          return null;
        });
    };

    recursivelyGetPages(urlWithParams);
  });
}

service.loadStates = (params) => {
  let url = `${apiEndpoint}stateclasses/`;
  if (params && typeof params === 'object') {
    params = Object.keys(params).map((key) =>
      `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
    url = `${url}?${params}`;
  }
  return new Promise((resolve, reject) => {
    getAllRecords(url)
      .then((response) => {
        if (!response) {
          reject(Error('No response from server'));
        } else {
          resolve(response);
        }
      });
  });
};

service.loadTransitions = (params) => {
  let url = `${apiEndpoint}transitions/`;
  if (params && typeof params === 'object') {
    params = Object.keys(params).map((key) =>
      `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
    url = `${url}?${params}`;
  }
  getAllRecords(url)
    .then((response) => response);
};

export default service;
