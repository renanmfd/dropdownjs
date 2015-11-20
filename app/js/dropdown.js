/*jslint browser: true*/
/*jshint unused: true, node: true */

/**
 *
 */
var Dropdown = (function () {
    'use strict';

    // Make sure to use the right document.
    var document = window.document;

    /**
     * Dropdown constructor.
     */
    function Dropdown(selector, settings) {
        // Return the object if it was used as a selector.
        if (typeof selector === 'object' && selector.dropdown) {
            return selector;
        }

        // If not a string, return selector.
        if (typeof selector !== 'string') {
            return selector;
        }

        // Return a new Dropdown object.
        return new Dropdown.fn.init(selector, settings);
    }

    /**
     * Copy the first array and take the values available on the second.
     * @return Object
     */
    function merge(object, extra) {
        var copy,
            attribute;
        if (object === null || typeof object !== "object") {
            return object;
        }
        copy = object.constructor();
        for (attribute in object) {
            if (object.hasOwnProperty(attribute)) {
                copy[attribute] = object[attribute];
                if (extra.hasOwnProperty(attribute)) {
                    copy[attribute] = extra[attribute];
                }
            }
        }
        return copy;
    }

    /**
     * Has classes check if an element has a class.
     */
    function hasClass(element, className) {
        if (element.classList) {
            return element.classList.contains(className);
        }
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
    }

    /**
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
     * Handle click on the Dropdown container.
     */
    function clickContainer(event) {
        //console.log('clickContainer', event, this);
        var rect = this.getBoundingClientRect();

        // Prevent from propagate to outser div that covers the window.
        event.stopPropagation();
        addClass(this, 'dropdown-open');

        // Handle bottom page overflow. 
        // Make open upsidedown when there is no space available.
        if (document.body.offsetHeight < this.children[1].offsetHeight + rect.top + window.scrollY) {
            addClass(this, 'dropdown-upsidedown');
        }
    }

    /**
     * Handle click on view link, to prevent achor.
     */
    function clickView(event) {
        //console.log('clickView', event);
        event.preventDefault();
    }

    /**
     * Handle click outisde Dropdown container, to close options.
     */
    function clickOutside(event) {
        //console.log('clickOutside', event);
        event.stopPropagation();
        removeClass(this.parentNode, 'dropdown-open');
    }

    /**
     * Handle click on options. Prevent closing when click it.
     */
    function clickOptionContainer(event) {
        //console.log('clickOptionContainer', event);
        event.stopPropagation();
    }

    /**
     * Handle click on multiple option view item to remove it from selected.
     */
    function clickMultiClose(event) {
        var span = this.parentNode,
            view = span.parentNode,
            selected = span.getAttribute('data-selected'),
            option,
            select = view.parentNode.previousElementSibling;
        // Remove closed option from view.
        span.remove();

        // Unselect closed option on dropdown.
        option = view.parentNode.querySelector('li[data-index="' + selected + '"]');
        removeClass(option, 'selected');
        select.options[selected].selected = false;

        // Put placeholder back if view is empty.
        if (view.children.length <= 1) {
            view.children[0].style.display = '';
        }

        // Prevent dropdown from opening (container click).
        event.stopPropagation();
        // Prevent anchoring.
        event.preventDefault();
    }

    /**
     * Handle click on the dropdown options.
     */
    function clickOption() {
        //console.log('clickOption', event);
        var span = document.createElement('span'),
            selected = this.getAttribute('data-index'),
            dropdown = this.parentNode,
            view,
            multiIcon,
            multiPlaceholder,
            select = null,
            options = null,
            i = 0;

        // Search for Dropdown container element.
        do {
            dropdown = dropdown.parentNode;
        } while (dropdown.tagName !== 'DIV');
        view = dropdown.querySelector('.dropdown-view');

        // Create a new element of the view to hold selected option.
        span.setAttribute('data-selected', selected);
        span.innerHTML = this.innerHTML;

        // Change the dropdown view to show selected one or ones.
        if (hasClass(dropdown, 'dropdown-multiple')) {
            multiIcon = document.createElement('a');
            multiIcon.className = 'icon icon-cross';
            multiIcon.setAttribute('href', '#');
            multiIcon.onclick = clickMultiClose;
            span.appendChild(multiIcon);

            // If placeholder is in place, remove it.
            multiPlaceholder = view.querySelector('.placeholder');
            if (multiPlaceholder) {
                multiPlaceholder.style.display = 'none';
            }
        } else {
            view.innerHTML = '';
        }
        view.appendChild(span);

        // Change selected option on the original select element.
        select = dropdown.previousSibling;
        select.options[selected].selected = true;

        // Remove the previous selected and add selected class to new option.
        options = dropdown.querySelectorAll('li.selected');
        if (!hasClass(dropdown, 'dropdown-multiple')) {
            for (i = 0; i < options.length; i = i + 1) {
                removeClass(options[i], 'selected');
            }
        }
        addClass(this, 'selected');

        // Close dropdown.
        removeClass(dropdown, 'dropdown-open');
    }

    /**
     * Add event to elements with cross-browser compatibility.
     */
    function addEvent(element, event, handler) {
        if (element.attachEvent) {
            return element.attachEvent('on' + event, handler);
        }
        return element.addEventListener(event, handler, false);
    }

    /**
     * Add click events to Dropdown element.
     */
    function addClickListeners(dropdown) {
        addEvent(dropdown, 'click', clickContainer);
        addEvent(dropdown.querySelector('.dropdown-view'), 'click', clickView);
        addEvent(dropdown.querySelector('.dropdown-options'), 'click', clickOptionContainer);
        addEvent(dropdown.querySelector('.dropdown-outside'), 'click', clickOutside);
    }

    /**
     * Template of the dropdown plugin.
     * @return HTMLElement
     */
    function buildHTML() {
        var container = document.createElement('div'),
            view = document.createElement('a'),
            options = document.createElement('ul'),
            outside = document.createElement('div');

        container.className = 'dropdown-container';

        view.className = 'dropdown-view';
        view.href = '#';
        view.setAttribute('tab-index', '-1');

        options.className = 'dropdown-options';

        outside.className = 'dropdown-outside';

        container.appendChild(view);
        container.appendChild(options);
        container.appendChild(outside);

        return container;
    }

    /**
     * Build options for the select element (recursive for optgroup).
     * @return HTMLElement
     */
    function buildOptionHTML(element, index, isSelected, isDisabled) {
        var option = document.createElement('li'),
            list,
            i;

        // Handle the optgroup tag, building a nested list.
        if (element.tagName === 'OPTGROUP') {
            option.innerHTML = element.getAttribute('label') || 'Group';
            option.className = 'optgroup';
            list = document.createElement('ul');
            for (i = 0; i < element.children.length; i = i + 1) {
                list.appendChild(buildOptionHTML(element.children[i], index, isSelected, isDisabled));
            }
            option.appendChild(list);
            return option;
        }

        // Copy the original option content to the list element.
        option.innerHTML = element.innerHTML;
        if (element.className) {
            option.className = element.className;
        }
        option.setAttribute('data-index', index.num);
        index.num = index.num + 1;

        // Click event.
        option.onclick = clickOption;
        option.setAttribute('value', element.getAttribute('value'));

        // Add default class option.
        if (option.className === '') {
            option.className = 'option';
        } else {
            option.className += ' option';
        }

        // Add classes for selected and disabled state.
        if (isSelected) {
            option.className += ' selected';
        }
        if (isDisabled) {
            option.className += ' disabled';
        }

        return option;
    }

    /**
     *
     * Define all properties and mathods that goes with the Dropdown instance.
     *
     */
    Dropdown.fn = Dropdown.prototype = {
        // Used to check if the object is a Dropdown instance.
        dropdown: true,

        // Default selectors.
        selector: '.dropdown',

        // Length of the object. Default 0.
        length: 0,

        // Default settings of Dropdown object.
        settings: {
            // Horizontal size of the widget. 
            width: 200,
            // Max height of the dropdown.
            maxHeight: 200,
            // Whether or not avoid line breaking.
            ellipsis: true,
            // Show or not selected element as an option.
            hideSelected: false,
            // Default placeholder.
            placeholder: null,
            // Multiple options can be selected.
            multi: false,
            // Multiple select text if doesn't have placeholder.
            multiText: 'Choose some options'
        },

        // Events associated with Dropdown object.
        events: {
            // Functions called when dropdown OPENS.
            open: [],
            // Functions called when dropdown CLOSE.
            close: [],
            // Functions called when dropdown option is CLICKED.
            option: []
        },

        // ===================================================== //

        /**
         * Return an instance of the Dropdown object.
         * @return Dropdown instance
         */
        init: function (sel, opts) {
            var elements = null,
                element,
                i = 0;

            // HANDLE: $(""), $(null), $(undefined), $(false).
            if (!sel) {
                return this;
            }
            // Check whether selector is a string.
            if (typeof sel !== 'string') {
                throw 'Error: Dropdown constructor paramenter is not a valid string';
            }

            // Initialize object properties.
            this.selector = sel;
            this.length = 0;
            this.opts = opts;
            this.settings = merge(this.settings, opts);
            this.events = merge(this.events, {});
            //console.log('- settings', this.settings, opts);

            // Query for the selector.
            elements = document.querySelectorAll(sel);
            for (i = 0; i < elements.length; i = i + 1) {
                element = elements[i];

                // Check whether the found element is in fact a select.
                if (element.tagName === 'SELECT') {
                    this[this.length] = element;
                    this.length = this.length + 1;
                }
            }

            return this;
        },

        /**
         * Apply the plugin to the select elements specified.
         * @return Dropdown instance
         */
        apply: function () {
            var template = buildHTML(),
                i,
                j,
                select,
                selectParent,
                dropdown,
                option,
                isSelected,
                isDisabled,
                span,
                index = {num: 0};

            for (i = 0; i < this.length; i = i + 1) {
                select = this[i];
                //console.log('select', select);
                dropdown = template.cloneNode(true);
                addClickListeners(dropdown);

                // Copy all attributes from the original select to the container.
                for (j = 0; j < select.attributes.length; j = j + 1) {
                    if (select.attributes[j].nodeName !== 'class') {
                        dropdown.setAttribute(select.attributes[j].nodeName, select.attributes[j].nodeValue);
                    } else {
                        dropdown.className = select.attributes[j].nodeValue + ' ' + dropdown.className;
                    }
                }

                // Check if it's an multiple selection widget.
                if (select.hasAttribute('multiple')) {
                    this.settings.multi = true;
                }

                // Set view (default value of the select or placeholder).
                span = document.createElement('span');
                if (this.settings.placeholder) {
                    span.innerHTML = this.settings.placeholder;
                    span.setAttribute('data-selected', -1);
                    select.selectedIndex = -1;
                } else if (select.hasAttribute('data-placeholder')) {
                    span.innerHTML = select.getAttribute('data-placeholder');
                    span.setAttribute('data-selected', -1);
                    select.selectedIndex = -1;
                } else if (!this.settings.multi) {
                    span.innerHTML = select[select.selectedIndex].innerHTML;
                    span.setAttribute('data-selected', select.selectedIndex);
                } else {
                    span.innerHTML = this.settings.multiText;
                    addClass(span, 'placeholder');
                    select.selectedIndex = -1;
                }
                dropdown.children[0].appendChild(span);

                // Create and add options to dropdown.
                index.num = 0;
                for (j = 0; j < select.children.length; j = j + 1) {
                    isSelected = select.selectedIndex === j ? true : false;
                    isDisabled = select[j].hasAttribute('disabled');
                    option = buildOptionHTML(select.children[j], index, isSelected, isDisabled);
                    dropdown.querySelector('ul').appendChild(option);
                }

                // Set extra options.
                if (this.settings.ellipsis) {
                    addClass(dropdown, 'dropdown-ellipsis');
                }
                if (this.settings.hideSelected) {
                    addClass(dropdown, 'dropdown-hideSelected');
                }
                if (this.settings.multi) {
                    addClass(dropdown, 'dropdown-multiple');
                }
                dropdown.style.width = this.settings.width + 'px';
                dropdown.querySelector('.dropdown-options').style.maxHeight = this.settings.maxHeight + 'px';

                // Insert the dropdown after the select element.
                selectParent = select.parentNode;
                if (selectParent.lastchild === select) {
                    selectParent.appendChild(dropdown);
                } else {
                    selectParent.insertBefore(dropdown, select.nextSibling);
                }

                // Hide original select element.
                select.style.display = 'none';
                dropdown = null;
            }

            return this;
        },

        /**
         * Set placeholder for the selected elements.
         */
        placeholder: function (placeholderText) {
            if (typeof placeholderText === 'string') {
                this.settings.placeholder = placeholderText;
            }
            return this;
        },

        /**
         * Event Listener
         */
        on: function (type, handler) {
            // Check if parameter its a function.
            if (typeof handler !== 'function') {
                return this;
            }

            // Add events to variables to be called on time.
            if (type === 'open') {
                this.events.open.push(handler);
            } else if (type === 'close') {
                this.events.close.push(handler);
            }
            return this;
        }
    };

    Dropdown.fn.init.prototype = Dropdown.fn;

    return Dropdown;
}());
