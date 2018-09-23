import './metric_percent_vis.less';
import './metric_percent_vis_params';
import { VisFactoryProvider } from 'ui/vis/vis_factory';
import { CATEGORY } from 'ui/vis/vis_category';
import { Schemas } from 'ui/vis/editors/default/schemas';
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';
import { vislibColorMaps } from 'ui/vislib/components/color/colormaps';
import { MetricPercentVisComponent } from './metric_percent_vis_controller';

VisTypesRegistryProvider.register(MetricPercentVisProvider);

function MetricPercentVisProvider(Private) {
  const VisFactory = Private(VisFactoryProvider);

  return VisFactory.createReactVisualization({
    name: 'metric_percent',
    title: 'Percent Metric',
    icon: 'fa-calculator',
    description: 'One big percent number for all of your one big number needs.',
    category: CATEGORY.DATA,
    visConfig: {
      component: MetricPercentVisComponent,
      defaults: {
        addTooltip: true,
        addLegend: false,
        type: 'metric',
        metric: {
          useRanges: false,
          colorSchema: 'Green to Red',
          metricColorMode: 'None',
          colorsRange: [
            { from: 0, to: 100 }
          ],
          labels: {
            show: true
          },
          invertColors: false,
          style: {
            bgFill: '#000',
            bgColor: false,
            labelColor: false,
            subText: '',
            fontSize: 60,
          }
        }
      }
    },
    editorConfig: {
      collections: {
        metricColorMode: ['None', 'Labels', 'Background'],
        colorSchemas: Object.keys(vislibColorMaps),
      },
      optionsTemplate: '<metric-percent-vis-params></metric-percent-vis-params>',
      schemas: new Schemas([
        {
          group: 'metrics',
          name: 'metric',
          title: 'Global',
          min: 1,
          max: 1,
          aggFilter: ['count', 'cardinality'],
          defaults: [
            { type: 'count', schema: 'metric' }
          ]
        }, {
          group: 'buckets',
          name: 'segment',
          title: 'Partition',
          min: 0,
          max: 1,
          aggFilter: ['filters']
        }
      ])
    }
  });
}

export default MetricPercentVisProvider;