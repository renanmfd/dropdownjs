(function () {
    /**
     * CONTRUCTOR TESTING.
     */

    // VALID input. Array of strings.
    var a = new Dropdown();

    // VALID input. Array of strings.
    var b = new Dropdown(['#page', '.dropdown']);

    // VALID input. Array of objects and strings.
    var c = new Dropdown([
        {selector: '.dropdown', placeholder: 'Any text to show on select'}, 
        '#id-selector',
        '.selector'
    ]);

    // #2 of the array is INVALID, will be deleted.
    var d = new Dropdown([
        {selector: '.asdasd', placeholder: 'place-asd'},
        {selector: '.asf-sadg'},
        {invalid: '.xxdfdsgasd', placeholder: 'sdf adf dsf'},
    ]);

    // INVALID because the parameter is not an array. An error will be thrown.
    var e = new Dropdown({
        selector: '.asdasd',
        placeholder: 'place-asd'
    });
    var f = new Dropdown(1, '.init');

    // INVALID because the array is empty. Will be used the default values instead. Error thrown.
    var g = new Dropdown([]);
}());