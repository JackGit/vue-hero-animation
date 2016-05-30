// hero-name
// hero-duration
// hero-delay
// hero-timing
// hero-depth
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

            // re-hook the transitions
            Vue.transition(this.transitionName, this.transitionOptions);
        },

        _hookEnter: function() {
            var that = this;
            var oldHook = this.transitionOptions.enter;

            // for routers, target heroes have to be found right before the enter transition started
            this.transitionOptions.enter = function() {
                var heroName;

                oldHook && oldHook.apply(this, arguments);
                // for every found active hero in the outgoing page, try to find its destination hero
                for(heroName in that.mapping) {
                    var destHero = document.querySelector('[hero-name="' + heroName + '"]');

                    if(destHero) {
                        that.mapping[heroName].dest = destHero;
                        that.mapping[heroName].destClone = destHero.cloneNode();
                        that.mapping[heroName].destBoundingClientRect = destHero.getBoundingClientRect();

                        that.mapping[heroName].destClone.style.cssText = getComputedStyle(destHero).cssText;
                        that.mapping[heroName].destClone.style.opacity = 0;
                        that._placeClone(that.mapping[heroName].destClone, that.mapping[heroName].destBoundingClientRect);
                    }
                }

                //
                that._transit();
            };
        },

        _hookBeforeLeave: function() {
            var oldHook = this.transitionOptions.beforeLeave;
            var that = this;

            // for routers, heroes have to be found the active heroes before the page leaves
            // an active hero is the element with hero-name and hero attributes

            this.transitionOptions.beforeLeave = function() {
                oldHook && oldHook.apply(this, arguments);

                that.heroNames.forEach(function(heroName) {
                    // only one hero can be active with the same hero name
                    var activeHero = document.querySelector('[hero=""][hero-name="' + heroName + '"]');

                    if(activeHero) {
                        that.mapping[heroName] = {
                            source: activeHero,
                            sourceClone: activeHero.cloneNode(activeHero.childElementCount === 0 ? true : false),
                            sourceBoundingClientRect: activeHero.getBoundingClientRect()
                        };

                        that.mapping[heroName].sourceClone.style.cssText = getComputedStyle(activeHero).cssText;
                        that._placeClone(that.mapping[heroName].sourceClone, that.mapping[heroName].sourceBoundingClientRect);
                    }

                });
            };
        },

        _transit: function() {

            for(var heroName in this.mapping) {
                console.log('transit hero', heroName)
                var hero = this.mapping[heroName];

                if(hero.source && hero.dest)
                    this._transitHero(hero, heroName);
            }
        },

        _transitHero: function(hero) {
            var sourceClone = hero.sourceClone;
            var dest = hero.dest;
            var destClone = hero.destClone;

            dest.style.opacity = 0;
            destClone.style.opacity = 0;
            destClone.style.transition = 'all .3s ease';

            sourceClone.style.transition = 'all .3s ease';
            sourceClone.style.cssText = getComputedStyle(destClone).cssText;
            sourceClone.style.opacity = 1;

            var transitionEndHandled = false;
            sourceClone.addEventListener('transitionend', function() {
                if(transitionEndHandled)
                    return;

                transitionEndHandled = true;
                sourceClone.remove();
                destClone.remove();
                dest.style.opacity = 1;
            });
        },

        _placeClone: function(clone, boundingClientRect) {
            var rect = boundingClientRect;

            clone.style.position = 'fixed';
            clone.style.top = rect.top + 'px';
            clone.style.left = rect.left + 'px';
            clone.style.width = rect.width + 'px';
            clone.style.height = rect.height + 'px';

            document.body.appendChild(clone);

            return clone;
        }
    };



    VueHero._instances = {};
    /**
     *
     * @param {Object} options - {fade: ['hero-one', 'hero-two'], expand: ['hero-one', 'hero-three']}
     */
    VueHero.rescue = function(options) {

        for(var transitionName in options) {
            var heroNames = options[transitionName];
            var transitionOptions = Vue.options.transitions[transitionName] || {};

            VueHero._instances[transitionName] = new VueHero({
                transitionName: transitionName,
                transitionOptions: transitionOptions,
                heroNames: heroNames
            });
        }
    };

    return VueHero
}));