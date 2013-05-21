var dyTester = new function () {
  var me = this,
      $showDy,
      $tspan,
      label;
  
  me.init = function () {
    
    $showDy = $('#showDy')
    tspan = $('tspan')[0];
    $label = $('label');
    
    // only do this for SVG browserss
    if (tspan) {
      $showDy.bind('change', checkboxEvent);
      checkboxEvent();
    } else {
      $showDy[0].disabled=true;
      $label.addClass('disabled')
    }
    
    
    
  }
  
  function checkboxEvent(e) {
    if ($showDy[0].checked) {
      tspan.setAttribute('dy', '0.3em');
    } else {
      tspan.setAttribute('dy', '0');
    }
  }
}

$(document).ready(dyTester.init);
