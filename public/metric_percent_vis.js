define(function (require) {

  // we need to load the css ourselves
  require('plugins/metric_percent_vis/metric_percent_vis.less');

  // we also need to load the controller and used by the template
  require('plugins/metric_percent_vis/metric_percent_vis_controller');

  // register the provider with the visTypes registry
  require('ui/registry/vis_types').register(MetricVisProvider);

  function MetricVisProvider(Private) {
    var TemplateVisType = Private(require('ui/template_vis_type/TemplateVisType'));
    var Schemas = Private(require('ui/Vis/Schemas'));

    // return the visType object, which kibana will use to display and configure new
    // Vis object of this type.
    return new TemplateVisType({
      name: 'metric_percent',
      title: 'Percent Metric',
      description: 'One big percent number for all of your one big number needs.',
      icon: 'fa-calculator',
      template: require('plugins/metric_percent_vis/metric_percent_vis.html'),
      params: {
        defaults: {
          handleNoResults: true,
          fontSize: 60
        },
        editor: require('plugins/metric_percent_vis/metric_percent_vis_params.html')
      },
      schemas: new Schemas([
        {
          group: 'metrics',
          name: 'metric',
          title: 'Global',
          min: 1,
          max: 1,
          defaults: [
            { type: 'count', schema: 'metric' }
          ]
        },
        {
          group: 'buckets',
          name: 'segment',
          title: 'Partition',
          min: 1,
          max: 1,
          aggFilter: ['filters']
        }
      ])
    });
  }

  // export the provider so that the visType can be required with Private()
  return MetricVisProvider;
});