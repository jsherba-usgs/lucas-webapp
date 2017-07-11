/**
 * Promise helpers module.
 * @module request
 * Adapted from // http://stackoverflow.com/questions/30008114/how-do-i-promisify-native-xhr
 * Adapted from // http://bluebirdjs.com/docs/api/cancellation.html
 */


function makeRequest(opts) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    let params = opts.params;

    if (params && typeof params === 'object') {
      // Encode params for get request
      if (opts.method === 'GET') {
        params = Object.keys(params).map((key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
        ).join('&');
      // Stringify object for post request
      } else {
        params = JSON.stringify(params);
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.response));
      } else {
        reject({
          status: xhr.status,
          statusText: xhr.statusText,
        });
      }
    };

    xhr.onerror = () => {
      reject({
        status: xhr.status,
        statusText: xhr.statusText,
      });
    };

    // Send get request
    if (opts.method === 'GET') {
      if (params) {
        xhr.open(opts.method, `${opts.url}?${params}`);
      } else {
        xhr.open(opts.method, opts.url);
      }
      if (opts.headers) {
        Object.keys(opts.headers).forEach((key) => xhr.setRequestHeader(key, opts.headers[key]));
      }
      xhr.send();
    // Send post request
    } else {
      xhr.open(opts.method, opts.url);
      if (opts.headers) {
        Object.keys(opts.headers).forEach((key) => xhr.setRequestHeader(key, opts.headers[key]));
      }
      xhr.send(params);
    }
  });
}


export default makeRequest;
