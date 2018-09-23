import { uiModules } from 'ui/modules';
import metricPercentVisParamsTemplate from './metric_percent_vis_params.html';
import _ from 'lodash';
const module = uiModules.get('kibana');

module.directive('metricPercentVisParams', function () {
  return {
    restrict: 'E',
    template: metricPercentVisParamsTemplate,
    replace: true,
    link: function ($scope) {
      $scope.collections = $scope.vis.type.editorConfig.collections;
      $scope.showColorRange = true;

      $scope.$watch('editorState.params.metric.metricColorMode', newValue => {
        switch (newValue) {
          case 'Labels':
            $scope.editorState.params.metric.style.labelColor = true;
            $scope.editorState.params.metric.style.bgColor = false;
            break;
          case 'Background':
            $scope.editorState.params.metric.style.labelColor = false;
            $scope.editorState.params.metric.style.bgColor = true;
            break;
          case 'None':
            $scope.editorState.params.metric.style.labelColor = false;
            $scope.editorState.params.metric.style.bgColor = false;
            break;
        }
      });

      $scope.resetColors = function () {
        $scope.uiState.set('vis.colors', null);
        $scope.customColors = false;
      };

      $scope.getGreaterThan = function (index) {
        if (index === 0) return 0;
        return $scope.editorState.params.metric.colorsRange[index - 1].to;
      };

      $scope.addRange = function () {
        const previousRange = _.last($scope.editorState.params.metric.colorsRange);
        const from = previousRange ? previousRange.to : 0;
        const to = previousRange ? from + (previousRange.to - previousRange.from) : 100;
        $scope.editorState.params.metric.colorsRange.push({ from: from, to: to });
      };

      $scope.removeRange = function (index) {
        $scope.editorState.params.metric.colorsRange.splice(index, 1);
      };

      $scope.getColor = function (index) {
        const defaultColors = this.uiState.get('vis.defaultColors');
        const overwriteColors = this.uiState.get('vis.colors');
        const colors = defaultColors ? _.defaults({}, overwriteColors, defaultColors) : overwriteColors;
        return colors ? Object.values(colors)[index] : 'transparent';
      };

      $scope.uiState.on('colorChanged', () => {
        $scope.customColors = true;
      });

    }
  };
});