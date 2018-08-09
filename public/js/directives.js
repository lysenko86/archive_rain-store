rainApp.directive('addToCartButtonDirect', function(){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            product: '@'
        },
        controller: 'cartsCtrl',
        template: [
            '<button ',
                'class="btn btn-success catalog-product-buy pull-right" ',
                'ng-click="addToCart(product); $event.stopPropagation();"',
            '>',
                'В кошик',
            '</button>'
        ].join('')
    };
});

rainApp.directive('cartBlockDirect', function(){
    return {
        restrict: 'A',
        controller: 'cartsCtrl',
        template: [
            '<a href="#/cart" class="cart-block-image"></a>',
            '<div class="cart-block-sum">{{cart.sum}} грн.</div>'
        ].join('')
    };
});
