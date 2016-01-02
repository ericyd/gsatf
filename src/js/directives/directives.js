/* 
# Define my custom directives

[This site](http://subliminalsources.com/9/building-angularjs-bootstrap-components-popover-directive-part-1/)
is a great reference

## Basic ideas
1. Create a module for directives, which will later be added to me main app module


*/


gsatf.directive('customPopover', ['$compile', 
    function($compile){
        return {
            restrict: 'A',
            //templateUrl: 'js/directives/templates/popover1.html',
            //template: '<span>{{label}}</span>',

            link: function (scope, el, attrs) {
                //scope.label = attrs.popoverLabel;

                $(el).popover({
                    trigger: attrs.popoverTrigger,
                    html: true,
                    content: getContent(attrs.popoverHtml),
                    placement: attrs.popoverPlacement
                });
                
                function getContent(popoverHtml) {
                    var options = {
                        copyPaste:  $('#copy-paste_popover_content').html(),
                        upload: $('#upload_popover_content').html(),
                        whichOne: $('#which-one_popover_content').html()
                    };
                    return $compile(options[popoverHtml])(scope);
                }       
            }
        };
    }]);
    
    
    
gsatf.directive('dynamic', ['$compile', '$sce', function ($compile, $sce) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.dynamic, function(html) {
        ele.html(html);
        $compile(ele.contents())(scope);
        
        
        // I think I need to make the compiled output to be html?
        //var content = $compile(ele.contents())(scope);
        //return $sce.trustAsHtml(content);
      });
    }
  };
}]);