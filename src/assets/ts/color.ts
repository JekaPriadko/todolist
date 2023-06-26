const body = document.getElementById('body');

var params = window.location.search
  .replace('?', '')
  .split('&')
  .reduce(function (p, e) {
    var a = e.split('=');
    p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
    return p;
  }, {});

body.classList.remove('light');
body.classList.remove('dark');
params.color = params.color ?? 'dark';
body.classList.add(params.color);
