(function (global, document) {
    'use strict';
    console.log('debug', 'Initial set of DrowdownJS.');

    var VERSION = '1.0',
        defaults = {
            size: 200
        },

        /**
         * Constructor.
         */
        Dropdown = function (selectors) {
            // If selectors is not an array or is empty, initialize.
            if (typeof selectors !== 'array' || selectors.length === 0) {
                selectors = ['.dropdown'];
            }
            this.selectors = selectors;
        };

    /**
     * PRIVATE
     * Build the plugin HTML to substitute select tags.
     */
    function buildHTML(element) {
        var dropdown = document.createElement('div'),
            view = document.createElement('div'),
            options = document.createElement('ul'),
            i = 0;
        // Copy all attributes from select to the new dropdown.
        for (i = 0; i < element.attributes.length; i = i + 1) {
            dropdown.setAttribute(element.attributes[i].nodeName, element.attributes[i].nodeValue);
        }
        dropdown.className += ' dropdown-container';

        // Build the viewer of the dropdown.
        view.className = 'dropdown-view';
        view.innerHTML = '<span>' + element[0].innerHTML + '</span>';

        // Add options and a placeholder to the dropdown.
        options.className = 'dropdown-options';
        options.innerHTML = '<li class="placeholder">TODO placeholder</li>';
        for (i = 0; i < element.children.length; i = i + 1) {
            options.innerHTML += '<li class="option">' + element.children[i].innerHTML + '</li>';
        }

        // Join all toghether.
        dropdown.appendChild(view);
        dropdown.appendChild(options);
        return dropdown;
    }

    /**
     * PRIVATE
     * Dropdown engine - Lots TODO.
     */
    function doSomething(element) {
        console.log('debug', 'doSomething');
        console.log('debug', element);
        var parent = element.parentNode,
            dropdown = buildHTML(element);
        // Append new HTML for dropdown.
        parent.insertBefore(dropdown, element);
        // Hide SELECT tag.
        element.style.display = 'none';
        return dropdown;
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
            j = 0,
            elements = null;

        // Iterate over all selectors.
        for (i = 0; i < length; i = i + 1) {
            // Get DOM element(s) matching the selector.
            elements = document.querySelectorAll(this.selectors[i]);

            // Iterate over the returned elements.
            for (j = 0; j < elements.length; j = j + 1) {
                // Check if the element is a SELECT tag.
                if (elements[j].tagName === 'SELECT') {
                    doSomething(elements[j]);
                }
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
