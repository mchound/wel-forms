function wz(options) {

    var

    self = this,

    defaults = {
        selector: '.wel-zoom',
        zoomWindowWidth: 0.4,
        zoomWindowScale: 1,
        zoomWindowDimension: 'natural',
        loadingText: 'Laddar bild'
    },

    settings,

    elements = {
        container: undefined,
        scaledImage: undefined,
        magnifier: undefined,
        zoomContainer: undefined,
        fullScaleImage: undefined
    },

    variables = {
        lastPos: { x: -999, y: -999 },
        zoomPos: {},
        initialized: false,
        imageInfo: {},
        zoomWindowDimensions: {},
        magnifierInfo: {},
        imageSrc: undefined,
        image: undefined,
        zoomContainerInfo: {
            position: 'left'
        }
    },

    init = function (options) {

        settings = defaults;

        if (Object.prototype.toString.call(options) === '[object Object]') {
            settings = merge(defaults, options);
        }

        elements.container = document.querySelector(settings.selector);
        variables.imageSrc = elements.container.getAttribute('data-img-src');
        variables.image = new Image();

        showLoader();

        event(variables.image, 'load', function () {
            elements.loader.style.display = 'none';
            variables.imageInfo.width = variables.image.width * settings.zoomWindowScale;
            variables.imageInfo.height = variables.image.height * settings.zoomWindowScale;
            variables.imageInfo.widthHeightRatio = variables.imageInfo.width / variables.imageInfo.height;
            setUpElements();
            setUpEvents();
            initZoomContainer();
        }, true);
        setImagesource();
        return self;

    },

    showLoader = function () {

        elements.loader = document.createElement('div');
        elements.loader.setAttribute('class', 'loader');
        elements.loader.innerText = settings.loadingText;
        elements.container.appendChild(elements.loader);

    },

    setImagesource = function () {

        if (navigator.userAgent.indexOf('MSIE 8.0') > -1) {
            variables.image.src = variables.imageSrc + '?cacheFix=' + Date.now();
        } else {
            variables.image.src = variables.imageSrc;
        }

    },

    setUpElements = function () {

        elements.magnifier = document.createElement('div');
        elements.magnifier.setAttribute('class', 'magnifier');

        elements.zoomContainer = document.createElement('div');
        elements.zoomContainer.setAttribute('class', 'zoom');

        elements.scaledImage = document.createElement('img');
        elements.scaledImage.src = variables.image.src;
        elements.scaledImage.removeAttribute('width');
        elements.scaledImage.removeAttribute('height');

        elements.fullScaleImage = document.createElement('img');
        elements.fullScaleImage.src = variables.image.src;
        elements.fullScaleImage.removeAttribute('width');
        elements.fullScaleImage.removeAttribute('height');
        elements.fullScaleImage.style.width = variables.imageInfo.width + 'px';
        elements.fullScaleImage.style.height = variables.imageInfo.height + 'px';

        elements.zoomContainer.appendChild(elements.fullScaleImage);
        elements.container.appendChild(elements.scaledImage);
        elements.container.appendChild(elements.magnifier);
        elements.container.appendChild(elements.zoomContainer);

    },

    setUpEvents = function () {

        event(elements.scaledImage, 'mousemove', mousemoveEventHandler, true);
        event(elements.magnifier, 'mousemove', mousemoveInMagnifierEventHandler, true);
        event(elements.container, 'mouseleave', mouseleaveEventHandler, false);
        //event(elements.fullScaleImage, 'load', initZoomContainer, true);
        event(elements.zoomContainer, 'mouseenter', mouseEnterZoomContainerEventHandler, false);

    },

    mouseEnterZoomContainerEventHandler = function () {

        positionZoomContainer();

    },

    initZoomContainer = function () {

        variables.zoomWindowDimensions.width = elements.container.offsetWidth * settings.zoomWindowWidth;

        if (settings.zoomWindowDimension === 'natural') {
            variables.zoomWindowDimensions.height = elements.container.offsetHeight * settings.zoomWindowWidth;
        } else if (settings.zoomWindowDimension === 'full-height') {
            variables.zoomWindowDimensions.height = elements.container.offsetHeight - 20;
        }
        
        variables.zoomWindowDimensions.proportion = variables.zoomWindowDimensions.width / variables.imageInfo.width;

        elements.zoomContainer.style.width = variables.zoomWindowDimensions.width + 'px';
        elements.zoomContainer.style.height = variables.zoomWindowDimensions.height + 'px';

        initMagnifier();
        positionZoomContainer();

    },

    initMagnifier = function () {

        variables.magnifierInfo.width = elements.scaledImage.width * (variables.zoomWindowDimensions.width / variables.imageInfo.width);
        variables.magnifierInfo.height = elements.scaledImage.height * (variables.zoomWindowDimensions.height / variables.imageInfo.height);

        elements.magnifier.style.width = variables.magnifierInfo.width + 'px';
        elements.magnifier.style.height = variables.magnifierInfo.height + 'px';

    },

    mousemoveEventHandler = function (e) {

        variables.lastPos.x = e.offsetX || e.layerX,
        variables.lastPos.y = e.offsetY || e.layerY;

        positionMagnifier(variables.lastPos.x, variables.lastPos.y);
    },

    mousemoveInMagnifierEventHandler = function (e) {

        var
        x = e.offsetX || e.layerX,
        y = e.offsetY || e.layerY;

        variables.lastPos.x += (x - variables.magnifierInfo.width / 2);
        variables.lastPos.y += (y - variables.magnifierInfo.height / 2);

        positionMagnifier(variables.lastPos.x, variables.lastPos.y);
        positionFullScaleImage(variables.lastPos.x, variables.lastPos.y);

    },

    mouseleaveEventHandler = function () {

        elements.magnifier.style.display = 'none';
        elements.zoomContainer.style.display = 'none';

    },

    positionMagnifier = function (x, y) {

        elements.magnifier.style.display = 'block';
        variables.zoomPos.x = Math.min(elements.scaledImage.width - variables.magnifierInfo.width, Math.max(0, x - variables.magnifierInfo.width / 2));
        variables.zoomPos.y = Math.min(elements.scaledImage.height - variables.magnifierInfo.height, Math.max(0, y - variables.magnifierInfo.height / 2));
        elements.magnifier.style.left = variables.zoomPos.x + 'px';
        elements.magnifier.style.top = variables.zoomPos.y + 'px';

    },

    positionFullScaleImage = function () {

        elements.zoomContainer.style.display = 'block';
        elements.fullScaleImage.style.left = ((variables.zoomPos.x) / elements.scaledImage.width * elements.fullScaleImage.width * -1) + 'px';
        elements.fullScaleImage.style.top = ((variables.zoomPos.y) / elements.scaledImage.height * elements.fullScaleImage.height * -1) + 'px';
    },

    positionZoomContainer = function () {

        if (variables.zoomContainerInfo.position === 'right') {
            variables.zoomContainerInfo.position = 'left';
            elements.zoomContainer.style.left = '10px';
        } else {
            variables.zoomContainerInfo.position = 'right';
            elements.zoomContainer.style.left = (elements.scaledImage.width - 10 - variables.zoomWindowDimensions.width) + 'px';
        }

    },

    event = function (context, eventName, eventHandler, useCapture) {

        if (window.addEventListener) {
            context.addEventListener(eventName, eventHandler, useCapture);
        } else {
            context.attachEvent('on' + eventName, eventHandler, useCapture);
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

    init(options);
};