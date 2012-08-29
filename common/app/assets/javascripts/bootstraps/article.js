define(['common', 'modules/related', 'modules/images', 'modules/popular', 'modules/expandable',
    'vendor/ios-orientationchange-fix', 'modules/relativedates', 'modules/analytics', 'modules/tabs', 'qwery'],
    
    function(common, Related, Images, Popular, Expandable, Orientation, RelativeDates, Analytics, Tabs, qwery) {

        modules = {

            upgradeImages: function() {
                var i = new Images();
                i.upgrade();
            },

            transcludeRelated: function(host, pageId) {
                 var url =  host + '/related/UK/' + pageId,
                     hasStoryPackage = !document.getElementById('js-related'),
                     relatedExpandable = new Expandable({ id: 'related-trails', expanded: false });
               
                if (hasStoryPackage) {
                    relatedExpandable.initalise();
                }
                
                if (!hasStoryPackage) { 
                    common.mediator.on('modules:related:render', relatedExpandable.initalise);
                    new Related(document.getElementById('js-related')).load(url);
                }
            },

            transcludeMostPopular: function(host, section) {
                var url = host + '/most-popular/UK/' + section,
                    domContainer = document.getElementById('js-popular');

                new Popular(domContainer).load(url);
                
                common.mediator.on('modules:popular:render', function(){
                    common.mediator.emit('modules:tabs:render', '#js-popular-tabs');
                    qwery('.trailblock', domContainer).forEach(function(tab){
                        var popularExpandable = new Expandable({ id: tab.id, expanded: false });
                        common.mediator.on('modules:popular:render', popularExpandable.initalise);
                    });
                })
            },

            showRelativeDates: function() {
                RelativeDates.init();
            },

            loadAnalytics: function(config) {
                new Analytics().submit(config);
            },

            showTabs: function() {
                var tabs = new Tabs().init();
            }
            
        }
    
    return {
        init: function(config) {
            modules.upgradeImages();
            modules.transcludeRelated(config.page.coreNavigationUrl, config.page.pageId);
            modules.transcludeMostPopular(config.page.coreNavigationUrl, config.page.section);
            modules.showRelativeDates();
            modules.showTabs(); 
            modules.loadAnalytics(config);
        }
    }
});
