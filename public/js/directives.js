rainApp.directive('addToCartButtonDirect', function(){
    return {
        restrict: 'E',
        replace: true,
        scope: {productId: '@'},
        controller: 'cartCtrl',
        template: [
            '<button ',
                'class="btn btn-success catalog-product-buy pull-right" ',
                'ng-click="addToCart(productId); $event.stopPropagation();"',
            '>',
                'В кошик',
            '</button>'
        ].join('')
    };
});
