; (function wp(document, window, pf, undefined) {

    var

    self = this,

    defaults = {
        selector: '.wp'
    },

    variables = {
        scaledImageInfo: {},
        fullScaleImageInfo: {}
    },

    elements = {},

    settings,

    init = function (options) {

        settings = defaults;

        if (Object.prototype.toString.call(options) === '[object Object]') {
            settings = merge(defaults, options);
        }

        elements.imageContainers = document.querySelectorAll(settings.selector);
        setupElementsAndEvents();
    },

    setupElementsAndEvents = function () {

        pf.array.each(elements.imageContainers, function (i, imageContainer) {

            var
            image = new Image(),
            imageSrc = imageContainer.getAttribute('data-img-src');

            elements.imageTag = document.createElement('img');
            elements.mouseTrap = document.createElement('div');
            elements.tooltip = imageContainer.querySelector('.tooltip');

            pf.classList(elements.mouseTrap, 'add', 'mousetrap');
            imageContainer.appendChild(elements.mouseTrap);

            event(elements.mouseTrap, 'click', imageClickEventHandler, true);
            event(elements.mouseTrap, 'mousemove', mouseMoveEventHandler, true);
            
            event(image, 'load', function () {
                elements.imageTag.src = imageSrc;
                elements.imageTag.removeAttribute('width');
                elements.imageTag.removeAttribute('height');
                imageContainer.appendChild(elements.imageTag);
                
                variables.fullScaleImageInfo.width = image.width;
                variables.fullScaleImageInfo.height = image.height;

                variables.scaledImageInfo.width = imageContainer.offsetWidth;
                variables.scaledImageInfo.height = (imageContainer.offsetWidth / image.width) * image.height;

                imageContainer.style.height = variables.scaledImageInfo.height + 'px';

            }, true);

            image.src = imageSrc;

        });        

    },

    mouseMoveEventHandler = function (e, currentTarget) {

        var
        imageContainer = currentTarget.parentNode,
        mouseX = e.offsetX || e.layerX,
        mouseY = e.offsetY || e.layerY;

        if (!pf.classList(imageContainer, 'contains', 'zoom')) {
            return;
        }        

        var
        image = imageContainer.querySelector('img'),
        x = mouseX / variables.scaledImageInfo.width,
        y = mouseY / variables.scaledImageInfo.height,
        offsetLeft = (variables.fullScaleImageInfo.width - variables.scaledImageInfo.width) * x * -1,
        offsetTop = (variables.fullScaleImageInfo.height - variables.scaledImageInfo.height) * y * -1;

        image.style.left = offsetLeft + 'px';
        image.style.top = offsetTop + 'px';

    },

    imageClickEventHandler = function(e, currentTarget){
      
        pf.classList(currentTarget.parentNode, 'toggle', 'zoom');

    },    

    event = function (context, eventName, eventHandler, useCapture) {

        if (window.addEventListener) {
            context.addEventListener(eventName, function (e) {
                eventHandler.call(context, e, context);
            }, useCapture);
        } else {
            context.attachEvent('on' + eventName, function (e) {
                eventHandler.call(context, e, context);
            }, useCapture);
        }

    },

    merge = function (obj1, obj2) {

        var obj3 = {};

        for (var attrname in obj1) {

            if (true) {
                obj3[attrname] = obj1[attrname];
            }

        }

        for (attrname in obj2) {

            if (obj3[attrname] && Object.prototype.toString.call(obj2[attrname]) === '[object Object]' && Object.prototype.toString.call(obj3[attrname]) === '[object Object]') {

                obj3[attrname] = merge(obj3[attrname], obj2[attrname]);

            } else {

                obj3[attrname] = obj2[attrname];

            }

        }

        return obj3;
    };

    window.wp = self;

    init();

})(document, window, polyfiller);