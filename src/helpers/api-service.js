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

/*function getAllRecordsCSV(urlWithParams) {
  return new Promise((resolve, reject) => {
    let series = [];
    const opts = {};
    console.log("test")
    
      opts.method = 'GET';
      opts.headers = {
        Accept: 'text/csv; charset=utf-8',
      };
      opts.url = urlWithParams;
      makeRequest(opts)
        .then((response) => {
          if (!response) {
            reject(Error('No response from server'));
          }
          return null;
        });
    
   
    
  });
}*/
 


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
        } else if (response.length === 0) {
          reject(Error('No data'));
        } else {
          resolve(response);
        }
      });
  });
};



 function downloadFile(urlToSend, extension) {
  
     var req = new XMLHttpRequest();
     req.open("GET", urlToSend, true);
     req.responseType = "blob";
     req.onload = function (event) {
        
        var blob = req.response;
        
        var link=document.createElement('a');
        link.href=window.URL.createObjectURL(blob);
        link.download="lucas_download" + extension;
        document.body.appendChild(link)
        link.click();
         //window.location = urlToSend;
       // window.open(urlToSend, '_blank')
      
     };

     req.send();
 }


service.tabularDownload = (params, variableType) => {
  let url = apiEndpoint+variableType;
  
  let csvType = "&format=csv"
  if (params && typeof params === 'object') {
    params = Object.keys(params).map((key) =>
      `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');

    url = `${url}?${params}${csvType}`;
  }
 let extension= ".csv"
 downloadFile(url, extension)
 
  
};

service.spatialDownload = (urlPath, jsonStrata) => {
  let url = apiEndpoint+"series/"+urlPath;
  
  let tifType = "&format=tif.zip"
  let strataGeom = "g="+jsonStrata
  if(jsonStrata){
 url = `${url}?${strataGeom}${tifType}`;
  }else{
  url= `${url}?${tifType}`;
}
 console.log(url)
 let extension= ".zip"
 downloadFile(url, extension)
 
  
};

service.loadCarbonStocks = (params) => {
  let url = `${apiEndpoint}stocktypes/`;
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
        } else if (response.length === 0) {
          reject(Error('No data'));
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
  return new Promise((resolve, reject) => {
    getAllRecords(url)
      .then((response) => {
        if (!response) {
          reject(Error('No response from server'));
        } else if (response.length === 0) {
          reject(Error('No data'));
        } else {
          resolve(response);
        }
      });
  });
};

export default service;
