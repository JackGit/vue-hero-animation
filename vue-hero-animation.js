// hero-name
// hero-duration
// hero-delay
// hero-timing
// hero => to identify this element will be used as source or destination hero element


// ? about hero-name or hero-id ?
// will a hero-name or id can occur multiple times in the same visiable page, all as hero source?
// => yes, such as a list, all list item should apply the same hero transition type, so they should have same hero-name or id as source hero identification
// => BUT! which one to used as the final source hero element, it should have another tag to identify

// also for the incoming page, there should be only one hero-name element. or it never know how the source element will be transitioned to


(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.VueAnimatedList = factory());
}(this, function () {
    'use strict';

    function VueHero(options) {
        this.transitionOptions = options.transitionOptions;
        this.transitionName = options.transitionName;
        this.heroNames = options.heroNames;

        this.mapping = {}; // {heroName: {source: e, dest: e}}
        this._init();
    }

    VueHero.prototype = {

        constructor: VueHero,

        _init: function() {
            this._hookEnter();
            this._hookBeforeLeave();
        },

        _hookEnter: function() {
            var oldHook = this.transitionOptions.enter;

            this.transitionOptions.enter = function() {
                oldHook && oldHook.apply(this, arguments);

            };
        },

        _hookBeforeLeave: function() {
            var oldHook = this.transitionOptions.beforeLeave;
            var that = this;

            this.transitionOptions.beforeLeave = function() {
                oldHook && oldHook.apply(this, arguments);

                that.heroName.forEach(function(heroName) {

                });
            };
        }
    };



    /**
     *
     * @param {Object} options - {fade: ['hero-one', 'hero-two'], expand: ['hero-one', 'hero-three']}
     */
    VueHero.rescue = function(options) {

        for(var transitionName in options) {
            var heroNames = options[transitionName];
            var transitionOptions = Vue.options.transitions[transitionName];

            new VueHero({
                transitionName: transitionName,
                transitionOptions: transitionOptions,
                heroNames: heroNames
            });
        }
    };


    function _getHeroElements(heroName) {
        return document.querySelectorAll('[hero-name="' + heroId + '"]');
    }

    function _cloneHero(heroElement) {
        var clonedHero = heroElement.cloneNode();
        var rect = heroElement.getBoundingClientRect();

        clonedHero.style.position = 'fixed';

        return clonedHero;
    }

    return VueHero
}));