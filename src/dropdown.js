(function (global, document) {
    'use strict';
    console.log('debug', 'Initial set of DrowdownJS.');

    var VERSION = '1.0',
        defaults = {
            size: 200
        },

        Dropdown = function (selectors) {
            this.selectors = selectors || ['dropdown'];
        };

    /**
     * Dropdown engine - Lots TODO.
     */
    function doSomething(element) {
        console.log(element);
        return element;
    }

    /**
     * Add selector to the object list for later apply dropdown.
     */
    Dropdown.prototype.add = function (sel) {
        if (typeof sel !== 'string') {
            return;
        }
        this.selectors.push(sel);
    };

    /**
     * Apply dropdown to all elements matching the property selector of the object.
     */
    Dropdown.prototype.apply = function () {
        var length = this.selectors.length,
            i = 0,
            element = null;

        // Iterate over all selectors.
        for (i = 0; i < length; i = i + 1) {
            // Get DOM element(s) matching the selector.
            element = document.querySelectorAll(this.selectors[i]);
            // Check if something was returned.
            if (element.length > 0) {
                // TO-DO Check if there is more than one element for this selector and TODO: Iterate over elements and call function that do things.
                doSomething(element);
            }
        }
    };

    /**
     * Return Version of the plugin.
     */
    Dropdown.prototype.version = function () {
        return VERSION;
    };

    /**
     * Return the options array for this object.
     */
    Dropdown.prototype.options = function () {
        return defaults;
    };

    global.Dropdown = Dropdown;
}(this, this.document));
