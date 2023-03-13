import { WfuCountUp } from 'https://cdn.jsdelivr.net/gh/sygnaltech/webflow-util@4.8/src/modules/webflow-countup.min.js';

$(function() {

  new WfuCountUp({
    waypointSelfTrigger: '90%',
    waypointGroupTrigger: '70%',
    countupSettings: {
      duration: 2, // sec
      useEasing: true,
      useGrouping: true,
      separator: ",",
      decimal: ".",
      decimalPlaces: 1,
      formattingFn: function(n) {
        var fn = n;
        if (Math.abs(n) == 10)
          fn = n.toFixed(0);
        else 
          fn = n.toFixed(1);
        if (n > 0)
          return '+' + fn
        else
          return fn;
      },
    }
  }).init();

});
