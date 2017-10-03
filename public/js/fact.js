class IOCore {constructor (ioFunc) {this.then = cb => ioFunc((...args) => cb(...args));};map (transform) {let saveThen = this.then;this.then = cb => {saveThen((...args) => {let result = transform(...args);if (result !== undefined) {if (Array.isArray(result)) {cb(...result);} else {cb(result);}}});};return this;};bind (ioFunc) {let saveThen = this.then;this.then = cb => {saveThen((...args) => {if (args !== undefined) {let _args = ioFunc.length < args.length ? args.slice(0, ioFunc.length) : args;let cbReturn = ioFunc(..._args);if (cbReturn !== undefined) {let cbReturnLen = cbReturn.length;let io = cbReturn[cbReturnLen - 1];let argsForCb = cbReturn.slice(0, cbReturnLen - 1);io.then((...ioargs) => cb(...argsForCb, ...ioargs));}}});};return this;};static timer (s) {var intervalId;var timer = new IOCore(cb => {intervalId = setInterval(cb, Math.floor(s * 1000))});timer.clear = () => clearInterval(intervalId);return timer;};static createIO (ioFunc) {return new IOCore(ioFunc);};};const createRequest = (method, url, cb) => {const request = new window.XMLHttpRequest();request.addEventListener('load', () => {if (request.status === 200) {cb(request);} else {cb(new Error(request.statusText));}});request.addEventListener('timeout', () => cb(new Error('Request timed out')));request.addEventListener('abort', () => cb(new Error('Request aborted')));request.addEventListener('error', () => cb(new Error('Request failed')));request.open(method, url);return request;};class IO extends IOCore {static get (url) {return new IO(cb => {const request = createRequest('GET', url, cb);request.send();}).map(request => request.responseText);};static del (url) {return new IO(cb => {const request = createRequest('DELETE', url, cb);request.send();}).map(request => request.responseText);};static getJSON (url) {return new IO(cb => {const request = createRequest('GET', url, cb);request.responseType = 'json';request.send();}).map(request => [request.response]);};static delJSON (url) {return new IO(cb => {const request = createRequest('DELETE', url, cb);request.responseType = 'json';request.send();}).map(request => [request.response]);};static getBlob (url) {return new IO(cb => {const request = createRequest('GET', url, cb);request.responseType = 'blob';request.send();}).map(request => new window.Blob([request.response]));};static postJSON (url, obj) {return new IO(cb => {const request = createRequest('POST', url, cb);request.setRequestHeader('Content-Type', 'application/json');request.responseType = 'json';request.send(JSON.stringify(obj));}).map(request => [request.response]);};static putJSON (url, obj) {return new IO(cb => {const request = createRequest('PUT', url, cb);request.setRequestHeader('Content-Type', 'application/json');request.responseType = 'json';request.send(JSON.stringify(obj));}).map(request => [request.response]);};static click (elem) {return new IO(cb => elem.addEventListener('click', cb));};static change (elem) {return new IO(cb => elem.addEventListener('change', cb)).map(e => e.target.value);}}

window.IO = IO

const url2 = 'http://127.0.0.1:8000/fact?num=';
const getInputVal = () =>
  (IO.click(document.getElementById('submit')).map(e => {
    let input = document.getElementById('factno');;
    let val = input.value;
    return [String(val)]
  }));
const getExternalData = () =>
  (getInputVal().bind(data => {
    let link = url2 + data;
    return [
      data,
      link,
      IO.get(link)
    ]
  }).map((data, link, res) => [res]));
getExternalData().then(res => {
  let parent = document.getElementById('outer');;
  let child = document.getElementById('inner');;
  parent.removeChild(child);
  let elenode = document.createElement('div');
  elenode.setAttribute('id', 'inner');
  let textnode = document.createTextNode(res);
  elenode.appendChild(textnode);
  parent.appendChild(elenode)
})
