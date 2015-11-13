(function () {
    var d = new Dropdown(['#page']);
    d.add('#page');
    d.add('.js-select');
    d.apply();
    console.log(d);
}());