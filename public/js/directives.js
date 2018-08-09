rainApp.directive('addToCartButtonDirect', function(){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            productId: '@',
            price: '@'
        },
        controller: 'cartCtrl',
        template: [
            '<button ',
                'class="btn btn-success catalog-product-buy pull-right" ',
                'ng-click="addToCart(productId, price); $event.stopPropagation();"',
            '>',
                'В кошик',
            '</button>'
        ].join('')
    };
});

rainApp.directive('cartBlockDirect', function(){
    return {
        restrict: 'A',
        controller: 'cartCtrl',
        template: [
            '<div class="cart-block-image"></div>',
            '<div class="cart-block-sum">{{cart.sum}} грн.</div>'
        ].join('')
    };
});
