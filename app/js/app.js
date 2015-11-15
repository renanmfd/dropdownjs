(function () {
    // VALID input. Array of strings.
    var d = new Dropdown(['#page', '.dropdown', '#basic', '#basic2']);

    d.add({selector: '.js-select', placeholder: 'Placeholder js-select'});
    d.add('#optgroup-example');
    d.apply();
}());