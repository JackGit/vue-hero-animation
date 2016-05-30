Vue.use(VueRouter);
var router = new VueRouter();

var PageA = Vue.extend({
    template: '#pageATemplate',
    methods: {
        toPageB: function(value) {
            "use strict";
            this.$router.go({name: 'pageB', params: {value: value}})
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

var App = Vue.extend({});


VueAnimatedList.rescue({fade: ['hero-avatar', 'hero-name', 'hero-page']})

router.map({
    '/pageA': {
        name: 'pageA',
        component: PageA
    },
    '/pageB/': {
        name: 'pageB',
        component: PageB
    }
});

router.start(App, '#mountNode');