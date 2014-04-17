; (function (document, window, undefined) {
    
    var

    self = this,

    modern = {

        classList: function (element, method, className) {

            if (element && !method) {
                return element.classList;
            }

            return element.classList[method](className);
        }
    };

    self.classList = function (element, method, className) {

        if (element.classList) {
            return modern.classList(element, method, className);
        }

        if (element && !method){
            return element.className.match(/[^ ]+/g);
        }

        var methods = {

            add: function (className) {

                if (methods.contains(className)) {
                    return;
                }

                element.className += (' ' + className);
                element.className = element.className.trim();
            },

            contains: function (className) {
                var matches = element.className.match(/[^ ]+/g);
                if (matches === undefined || matches === null){
                    return 0;
                }
                return matches.indexOf(className) !== -1;

            },

            remove: function (className) {

                if (!methods.contains(className)) {
                    return;
                }

                element.className = element.className.replace(className, '').trim();

                if (element.className === ''){
                    element.removeAttribute('class');
                }
            },

            toggle: function (className) {

                if (methods.contains(className)) {
                    methods.remove(className);
                } else {
                    methods.add(className);
                }

            }

        };

        return methods[method](className);

    };

    self.array = {
        each: function (array, callback) {
            for (var i = 0; i < array.length; i++) {
                callback.call(array[i], i, array[i]);
            }
        }
    };

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (elem, startFrom) {
            var startFrom = startFrom || 0;
            if (startFrom > this.length) {
                return -1;
            }

            for (var i = 0; i < this.length; i++) {
                if (this[i] === elem && startFrom <= i) {
                    return i;
                } else if (this[i] === elem && startFrom > i) {
                    return -1;
                }
            }
            return -1;
        };
    }

    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }

    window.polyfiller = self;

})(document, window);