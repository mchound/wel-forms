; (function (document, window, undefined) {

    var

    self = this,

    wf = {},

    // Settings
    settings = {},

    forms = [],

    // Form
    form = function (formElement) {

        var

        elements = [],

        hideAll = function (e) {

            for (var i = 0; i < elements.length; i++) {

                elements[i].hide();

            }                

        };

        for (var q = 0; q < settings.elementSelectors.length; q++) {

            var

            elementsInForm = formElement.querySelectorAll(settings.elementSelectors[q].selector);

            for (var k = 0; k < elementsInForm.length; k++) {

                var el = new settings.elementStarters[settings.elementSelectors[q].init](elementsInForm[k]);
                elements.push(el);
                el.hideOthers = hideAll;

            }

        }

    },

    // Element Starters
    standardSelect = function(element){

        var

        self = this,

        options = element.querySelectorAll('option'),

        container = document.createElement('div'),

        span = document.createElement('span'),

        input = document.createElement('input'),

        ul = document.createElement('ul'),

        listItemClickHandler = function (e) {

            container.setAttribute('data-selected-value', e.target.getAttribute('data-value'));
            container.setAttribute('data-selected-text', e.target.innerText);
            input.value = e.target.getAttribute('data-value');
            span.innerText = e.target.innerText;

        },

        containerClickHandler = function (e) {

            var status = ul.classList.contains('show') ? true : false;

            if (self.hideOthers) {

                self.hideOthers.call(self, e);

            }

            if (status) {

                self.hide();

            } else {

                self.show();

            }   

        };
        
        // Convert options to list items
        internals.selectHelpers.optionsToList(options, ul, listItemClickHandler);

        // Configure input element
        input.value = options[0].getAttribute('data-value');
        input.setAttribute('type', 'text');
        input.id = element.id;
        if (element.getAttribute('name')) { input.setAttribute('name', element.getAttribute('name')); }
        input.setAttribute('disabled', '');

        // Configure span element
        span.innerText = options[0].innerText;

        // Configure container element
        internals.copyClasses(element, container);
        container.setAttribute('data-selected-value', options[0].value);
        container.setAttribute('data-selected-text', options[0].value);
        container.addEventListener(container.touchstart ? 'touchstart' : 'click', containerClickHandler, true);
        container.appendChild(input);
        container.appendChild(span);
        container.appendChild(ul);

        internals.switchElements(element, container);

        this.show = function () {

            ul.classList.add('show');

        };

        this.hide = function () {

            ul.classList.remove('show');

        };

        this.toggle = function () {

            ul.classList.toggle('show');

        };        

    },

    // Default values if nothing is mentioned in init function option parameter
    defaults = {

        elementSelectors: [
                { selector: 'select.standard-select', init: 'standardSelect' }
            ],

        elementStarters: {

            standardSelect: standardSelect

        }

    },

    // Internal functions
    internals = {

        merge: function (obj1, obj2) {

            var obj3 = {};

            for (var attrname in obj1) {

                obj3[attrname] = obj1[attrname];

            }

            for (attrname in obj2) {

                if (obj3[attrname] && Object.prototype.toString.call(obj2[attrname]) === '[object Object]' && Object.prototype.toString.call(obj3[attrname]) === '[object Object]'){

                    obj3[attrname] = internals.merge(obj3[attrname], obj2[attrname]);

                } else {

                    obj3[attrname] = obj2[attrname];

                }

            }

            return obj3;
        },

        rePaintForms: function(){
            
            var _forms = document.querySelectorAll('form.wel-form');

            for (var i = 0; i < _forms.length; i++) {

                forms.push(new form(_forms[i]));

            }

        },

        elementIndex: function(element){

            return Array.prototype.slice.call(element.parentNode.children).indexOf(element);

        },

        insertElementAt: function(element, parent, index){

            var elementCount = parent.children.length;

            if (index >= elementCount){

                parent.appendChild(element);

            } else {
                
                parent.insertBefore(element, parent.children[index]);

            }

        },

        switchElements: function (from, to) {

            var
            index = internals.elementIndex(from),
            parentNode = from.parentNode;

            from.remove();

            internals.insertElementAt(to, parentNode, index);

        },

        copyClasses: function (from, to) {

            for (var i = 0; i < from.classList.length; i++) {

                to.classList.add(from.classList[i]);

            }

        },

        selectHelpers: {

            optionsToList: function (options, listElement, clickHandler) {

                for (var i = 0; i < options.length; i++) {

                    var li = document.createElement('li');
                    li.setAttribute('data-value', options[i].getAttribute('value'));
                    li.innerText = options[i].innerText;

                    li.addEventListener('click', clickHandler, false);

                    listElement.appendChild(li);

                }

            }

        }

    };

    // Initialize the forms
    wf.init = function (options) {

        if (Object.prototype.toString.call(options) === '[object Object]') {

            settings = internals.merge(defaults, options);

        } else {

            settings = internals.merge(defaults, {});

        }
        

        internals.rePaintForms();

    };

    window.welForms = wf;

})(document, window);