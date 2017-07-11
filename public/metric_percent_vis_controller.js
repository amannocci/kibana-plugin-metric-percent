import { AggResponseTabifyProvider } from 'ui/agg_response/tabify/tabify';

define(function (require) {
  var module = require('ui/modules').get('kibana/metric_percent_vis', ['kibana']);

  module.controller('KbnMetricPercentVisController', function ($scope, $element, Private) {
    const tabifyAggResponse = Private(AggResponseTabifyProvider);

    const metrics = $scope.metrics = [];

    function isInvalid(val) {
      return _.isUndefined(val) || _.isNull(val) || _.isNaN(val);
    }

    $scope.processTableGroups = function (tableGroups) {
      tableGroups.tables.forEach(function (table) {
        var base = null;

        // Search for global
        table.rows.forEach(function (row) {
          if (row[0] === '_global') {
            base = row;
          }
        });

        // Iterate over each row
        if (base != null) {
          table.rows.forEach(function (row) {
            // Skip global
            if (row[0] !== '_global') {
              var column = row[0];
              var value = row[1];
              value = isInvalid(value) ? '?' : value;

              metrics.push({
                label: column,
                value: ((value / base[1]) * 100).toFixed(2) + '%',
                count: value
              });
            }
          });
        }
      });
    };

    $scope.$watch('esResponse', function (resp) {
      if (resp) {
        metrics.length = 0;
        $scope.processTableGroups(tabifyAggResponse($scope.vis, resp));
        if (metrics.length == 0) {
          metrics.push({
            label: "No Result",
            value: "?"
          })
        }
      }
    });

  });

});