
var onmessage = function(e) {
  var url = 'http://jsonplaceholder.typicode.com/users';

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';

  xhr.onload = function(e) {
    postMessage(this.response);
    close();
  };

  xhr.send();
};
