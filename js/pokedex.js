var pokeApp = angular.module('pokedex', ['ngResource']);

pokeApp.directive('pokedex', function () {
    return {
        templateUrl: 'pokedex.html'
    };
});

pokeApp.config(function ($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
});

var pokeApiUrl = "http://pokeapi.co/";

pokeApp.factory('pokeServ', function ($resource) {
    return $resource(pokeApiUrl + '/api/v2/pokemon/:id');
});

pokeApp.factory('pokedex', function ($resource) {
    return $resource(pokeApiUrl + '/api/v2/pokedex/1')
});

pokeApp.factory('selected', function ($resource) {
    var Info;
    return {
        setData: function (data) {
            Info = data;
        },
        getData: function () {
            return Info;
        }
    };
});


pokeApp.controller('ListeController', function ($scope, $log, pokedex, selected) {

        pokedex.get(function (data) {
            $scope.data = {
                model: null,
                liste: data.pokemon_entries
            };
        });

        $scope.select = function () {
            $scope.selectedPok = $scope.data.liste[$scope.data.model - 1];
            selected.setData($scope.selectedPok)
        };

    }
);

pokeApp.controller('PokemonController', function ($scope, $log, pokeServ, selected) {

    $scope.$watch(function (scope) { return selected.getData()}
    ,       function update(newValue, oldValue, scope) {
            if (newValue != null) {
                pokeServ.get({id:newValue.entry_number}, function (data) {
                    $scope.pokemon = data;
                })
            }
        }
    );

});
