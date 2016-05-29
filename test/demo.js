Vue.use(VueRouter);
var router = new VueRouter();

var PageA = Vue.extend({
    template: '#pageATemplate',
    methods: {
        toPageB: function() {
            "use strict";
            this.$router.go({name: 'pageB'})
        }
    }
});

var PageB = Vue.extend({
    template: '#pageBTemplate',
    methods: {
        toPageA: function() {
            "use strict";
            this.$router.go({name: 'pageA'})
        }
    }
});

var App = Vue.extend({

});

var heroName = 'myHero';
var clonedHeroElement;
var getHeroElements = function(heroName) {
    "use strict";
    return document.querySelectorAll('[hero-name="' + heroName + '"]');
}
var cloneHero = function(heroElement) {
    "use strict";
    var element = heroElement.cloneNode(true);
    var rect = heroElement.getBoundingClientRect();

    element.style.position = 'fixed';
    element.style.top = rect.top + 'px';
    element.style.left = rect.left + 'px';
    element.style.height = rect.height + 'px';
    element.style.width = rect.width + 'px';
    element.style.transition = 'all .3s ease';
    element.style.willChange = 'auto';

    document.body.appendChild(element);
    heroElement.style.opacity = 0;

    return element;
}

Vue.transition('fade', {

    beforeEnter: function () {
        console.log('before enter', this)
    },
    enter: function () {
        // if there is a source hero element
        // and there is a destination hero element,
        // then apply below code
        // otherwise, return

        console.log('enter')
        // set opacity = 0 of the heroes in the coming page
        var hero = getHeroElements(heroName)[0];


        var sourceRect = clonedHeroElement.getBoundingClientRect();
        var destRect = hero.getBoundingClientRect();
        var sourceWidth = sourceRect.width;
        var sourceHeight = sourceRect.height;
        var sourceCenter = {x: sourceRect.left + sourceWidth / 2, y: sourceRect.top + sourceHeight / 2};
        var destWidth = destRect.width;
        var destHeight = destRect.height;
        var destCenter = {x: destRect.left + destWidth / 2, y: destRect.top + destHeight / 2};

        hero.style.opacity = 0;

        var newStyle = getComputedStyle(hero);

        clonedHeroElement.style.borderRadius = newStyle.borderRadius;
        clonedHeroElement.style.background = newStyle.background;
        clonedHeroElement.style.width = newStyle.width;
        clonedHeroElement.style.height = newStyle.height;
        clonedHeroElement.style.fontSize = newStyle.fontSize;
        clonedHeroElement.style.padding = newStyle.padding;

        var stopped = false;

        clonedHeroElement.addEventListener('transitionend', function() {
            "use strict";
            if(stopped)
                return;
            hero.style.opacity = 1;
            clonedHeroElement.remove();
        });


        // FLIP.last(); make a snapshot as last position
        // FLIP.play(); to play cloned hero from the first position to the last position
        // and when the hero animation completed, remove the cloned heroes, and set original heroes opacity = 1

    },
    afterEnter: function () {
        console.log('after enter')
    },
    enterCancelled: function () {

    },

    beforeLeave: function () {
        // clone the heroes in current page
        var hero = getHeroElements(heroName)[0];

        clonedHeroElement = cloneHero(hero);


        // FLIP.first(); make a snapshot as first position
    },
    leave: function () {

    },
    afterLeave: function () {

    },
    leaveCancelled: function (el) {
        // handle cancellation
    }
})

router.map({
    '/pageA': {
        name: 'pageA',
        component: PageA
    },
    '/pageB': {
        name: 'pageB',
        component: PageB
    }
});

router.start(App, '#mountNode');