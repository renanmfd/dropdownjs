(function (global, document) {
    'use strict';

    // Add isArray function if not implemented.
    if (typeof Array.isArray !== 'function') {
        Array.isArray = function (arr) {
            return Object.prototype.toString.call(arr) === '[object Array]';
        };
    }

    var VERSION = '1.0',
        defaults = {
            width: '200px',
            ellisis: true
        },

        /**
         * Constructor.
         * Take as parameter an array of objects. Each object have a selector
         * and a placeholder.
         */
        Dropdown = function (objects) {
            var i;
            //console.log('type: ', typeof objects);
            //console.log('input: ', objects);
            // If parameter is not defined, initialize.
            objects = objects || [{selector: '.dropdown'}];

            // If objects is not an object or is empty, initialize.
            if (!Array.isArray(objects) || objects.length === 0) {
                console.error('Warning: The parameter passed to Dropdown constructor',                             'have to be an array of strings or an array of objects. Your value',
                    'was not used.');
                objects = [{
                    selector: '.dropdown',
                    placeholder: 'Choose one option'
                }];
            }

            // Iterate through objects to check integrity of data.
            for (i = 0; i < objects.length; i = i + 1) {
                //console.log('- ' + (i + 1) + '. object: ', objects[i]);
                // If element is string, transform to object with selector equals that string.
                if (typeof objects[i] === 'string') {
                    objects[i] = {selector: objects[i]};
                    //console.log('- ' + (i + 1) + '. fixed: ', objects[i]);
                }
                // If element is not an object, warn user and delete it.
                if (typeof objects[i] !== 'object') {
                    console.warn('Warning: The element of index ' + i + ' on the Dropdown',                             'contructor array was invalid, so it was removed from the array.');
                    //console.log('- ' + (i + 1) + '. deleted: ', objects[i]);
                    delete objects[i];
                }
                // If object doesn't have selector property, warn user and delete it.
                if (!Object.prototype.hasOwnProperty.call(objects[i], 'selector')) {
                    console.warn('Warning: The object of index ' + i + ' on the Dropdown',                             'contructor array do not have selector property, so it was',
                        'removed from the array.');
                    //console.log('- ' + (i + 1) + '. deleted: ', objects[i]);
                    delete objects[i];
                }
            }
            //console.log(objects);
            //console.log('--------------------------------');
            this.objects = objects;
        };

    /**
     * PRIVATE HELPER.
     * Has classes check if an element has a class.
     */
    function hasClass(element, className) {
        if (element.classList) {
            element.classList.add(className);
        } else if (!hasClass(element, className)) {
            element.className += " " + className;
        }
    }

    /**
     * PRIVATE HELPER.
     * Remove class from any element.
     */
    function removeClass(element, className) {
        if (element.classList) {
            element.classList.remove(className);
        } else if (hasClass(element, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            element.className = element.className.replace(reg, ' ');
        }
    }

    /**
     * PRIVATE HELPER.
     * Add classes to elements.
     */
    function addClass(element, className) {
        if (element.classList) {
            element.classList.add(className);
        } else if (!hasClass(element, className)) {
            element.className += " " + className;
        }
    }

    /**
     * PRIVATE
     * Event handler for mouseOver on dropdown container.
     */
    function containerClick(event) {
        //console.log('open', event);
        event.stopPropagation();
        addClass(this, 'dropdown-open');
    }

    /**
     * PRIVATE
     * Event handler for mouseOut on dropdown container.
     */
    function containerClickOut(event) {
        //console.log('close', event);
        event.stopPropagation();
        removeClass(this.parentNode, 'dropdown-open');
    }

    /**
     * PRIVATE
     * This event prevent closing the dropdown when click on options.
     */
    function dropdownClick(event) {
        //console.log('optionsContainer', event);
        event.stopPropagation();
    }

    /**
     * PRIVATE
     * Handle click on the dropdown options.
     */
    function optionClick() {
        //console.log('clickOption', event);
        var element = document.createElement('span'),
            selected = this.getAttribute('data-index'),
            dropdown = this.parentNode.parentNode,
            view = dropdown.querySelector('.dropdown-view'),
            select = null,
            options = null,
            i = 0;

        // Create a new element of the view to hold selected option.
        element.setAttribute('data-selected', selected);
        element.innerHTML = this.innerHTML;

        // Change the dropdown view to show selected one.
        view.innerHTML = '';
        view.appendChild(element);

        // Change selected option on the original select element.
        select = dropdown.nextSibling;
        select.options[selected - 1].selected = 'selected';

        // Add selected class to dropdown option.
        options = dropdown.querySelectorAll('li.selected');
        for (i = 0; i < options.length; i = i + 1) {
            removeClass(options[i], 'selected');
        }
        addClass(this, 'selected');

        // Close dropdown.
        removeClass(this.parentNode.parentNode, 'dropdown-open');
    }

    /**
     * PRIVATE
     * Build the plugin HTML to substitute select tags.
     */
    function buildHTML(element, settings) {
        var dropdown = document.createElement('div'),
            view = document.createElement('a'),
            options = document.createElement('ul'),
            option = null,
            background = document.createElement('div'),
            i = 0,
            j = 0,
            index = 1,
            optgroup = null;

        // Copy all attributes from select to the new dropdown.
        for (i = 0; i < element.attributes.length; i = i + 1) {
            dropdown.setAttribute(element.attributes[i].nodeName, element.attributes[i].nodeValue);
        }
        dropdown.className += ' dropdown-container';
        dropdown.style.width = defaults.width;
        dropdown.onclick = containerClick;
        if (defaults.ellisis) {
            dropdown.className += ' dropdown-ellipsis';
        }

        // Build the viewer of the dropdown.
        view.className = 'dropdown-view';
        view.href = '#';
        view.onclick = function (event) {
            event.preventDefault();
        };
        view.setAttribute('tab-index', '-1');

        // Placeholder placement.
        option = document.createElement('span');
        if (Object.prototype.hasOwnProperty.call(settings, 'placeholder')) {
            option.innerHTML = settings.placeholder;
        } else {
            option.innerHTML = element[0].innerHTML;
        }
        view.appendChild(option);

        // Add options and a placeholder to the dropdown.
        options.className = 'dropdown-options';
        options.onclick = dropdownClick;
        for (i = 0; i < element.children.length; i = i + 1) {
            //console.log('element', element.children[i]);
            // Handle normal options
            if (element.children[i].tagName === 'OPTION') {
                option = document.createElement('li');
                option.className = 'option';
                option.setAttribute('data-index', index);
                option.innerHTML = element.children[i].innerHTML;
                option.onclick = optionClick;
                options.appendChild(option);
                index = index + 1;
            // Handle optgroups
            } else if (element.children[i].tagName === 'OPTGROUP') {
                optgroup = element.children[i];
                option = document.createElement('li');
                option.className = 'optgroup';
                option.innerHTML = optgroup.getAttribute('label');
                options.appendChild(option);
                for (j = 0; j < optgroup.children.length; j = j + 1) {
                    option = document.createElement('li');
                    option.className = 'option group-option';
                    option.setAttribute('data-index', index);
                    option.innerHTML = optgroup.children[j].innerHTML;
                    option.onclick = optionClick;
                    options.appendChild(option);
                    index = index + 1;
                }
            }
        }

        // Add background to fill all the window for click outside event for closing dropdown.
        background.className = 'dropdown-outside';
        background.onclick = containerClickOut;

        // Join all toghether.
        dropdown.appendChild(view);
        dropdown.appendChild(options);
        dropdown.appendChild(background);
        return dropdown;
    }

    /**
     * PRIVATE
     * Dropdown engine - Lots TODO.
     */
    function doSomething(element, settings) {
        //console.log('debug', 'doSomething');
        //console.log('debug', element);
        var parent = element.parentNode,
            dropdown = buildHTML(element, settings);
        // Append new HTML for dropdown.
        parent.insertBefore(dropdown, element);
        // Hide SELECT tag.
        element.style.display = 'none';
        //element.style.height = '0';
        //element.style.visibility = 'hidden';
        //element.style.margin = '0';
        //element.style.border = 'none';

        return dropdown;
    }

    /**
     * Add selector to the object list for later apply dropdown.
     */
    Dropdown.prototype.add = function (object) {
        if (typeof object === 'string') {
            this.objects.push({selector: object});
        } else if (typeof object === 'object') {
            if (!Object.prototype.hasOwnProperty.call(object, 'selector')) {
                console.warn('Warning: The object on function add on Dropdown',
                    'object do not have selector property, so it wasn\'t',
                    'added to the selectors.');
                return;
            }
            this.objects.push(object);
        }
    };

    /**
     * Apply dropdown to all elements matching the property selector of the object.
     */
    Dropdown.prototype.apply = function () {
        var length = this.objects.length,
            i = 0,
            j = 0,
            elements = null;

        // Iterate over all objects.
        //console.log('all Objects', this.objects);
        for (i = 0; i < length; i = i + 1) {
            // Get DOM element(s) matching the selector.
            elements = document.querySelectorAll(this.objects[i].selector);

            // Iterate over the returned elements.
            for (j = 0; j < elements.length; j = j + 1) {
                // Check if the element is a SELECT tag.
                if (elements[j].tagName === 'SELECT') {
                    //console.log('doSomething', this.objects[i]);
                    doSomething(elements[j], this.objects[i]);
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
