rainApp.directive('addToCartButtonDirect', function(){
    return {
        restrict: 'E',
        replace: true,
        template: '<button class="btn btn-success catalog-product-buy pull-right" ng-click="addToCart(product.id); $event.stopPropagation();">В кошик</button>'
    };
});
