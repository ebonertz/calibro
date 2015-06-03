'use strict';

// Configuring the Articles module
angular.module('products').run(['Menus',
	function(Menus) {
    Menus.addMenuItem('topbar', 'Men', 'men', 'dropdown', '/categories/men(/.*)');
    Menus.addSubMenuItem('topbar', 'men', 'Men\'s Eyewear', 'categories/men/eyewear');
    Menus.addSubMenuItem('topbar', 'men', 'Men\'s Sunglasses', 'categories/men/sunglasses');
    Menus.addSubMenuItem('topbar', 'men', 'Men\'s Summer 2015', 'categories/men/summer2015');

    Menus.addMenuItem('topbar', 'Women', 'women', 'dropdown', '/categories/women(/.*)');
    Menus.addSubMenuItem('topbar', 'women', 'Women\'s Eyewear', 'categories/women/eyewear');
    Menus.addSubMenuItem('topbar', 'women', 'Women\'s Sunglasses', 'categories/women/sunglasses');
    Menus.addSubMenuItem('topbar', 'women', 'Women\'s Summer 2015', 'categories/women/summer2015');
	}
]);