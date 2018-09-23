export default function (kibana) {
  return new kibana.Plugin({
    uiExports: {
      visTypes: ['plugins/metric_percent_vis/metric_percent_vis']
    }
  });
}
