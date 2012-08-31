define(['analytics/clickstream', 'vendor/bean-0.4.11-1', 'common'], function(Clickstream, bean, common) {

    describe("Clickstream", function() { 

        // prevents unit tests from visiting the link
        bean.add(document.getElementById('click-me'), 'click', function(e) {
            e.preventDefault();
        })
        
        bean.add(document.getElementById('click-me-quick'), 'click', function(e) {
            e.preventDefault();
        })
        
        beforeEach(function(){

            // ensure each instance of Clickstream has a fresh <body>
            bean.remove(document.body, 'click');

            // clean listeners before each test
            var a = common.mediator.removeAllListeners('module:clickstream:click');

        });

        it("should derive analytics tag name from the dom ancestors of the source element", function(){
        
            var cs  = new Clickstream({ filter: ["span"] }),
                object = { method: function (p) {} },
                spy = sinon.spy(object, "method");
             
            spy.withArgs(['outer div | the link', false, false]);

            common.mediator.on('module:clickstream:click', spy);

            bean.fire(document.getElementById('click-me-span'), 'click');
    
            runs(function(){
                expect(spy.withArgs(['outer div | the span', false, false])).toHaveBeenCalledOnce();
                console.log('end test');
            });
            
        });

        it("should ignore clicks *not* from a list of given element sources", function(){
            
            var cs  = new Clickstream({ filter: ['a'] }), // only log events on [a]nchor elements
                object = { method: function (tag) {} },
                spy = sinon.spy(object, "method");

            common.mediator.on('module:clickstream:click', spy);

            bean.fire(document.getElementById('not-inside-a-link'), 'click');
            
            runs(function(){
                expect(spy.callCount).toBe(0);
            });

        });
        
        it("should indicate if a click eminates from an XmlHttpRequest source", function(){

            var cs  = new Clickstream({ filter: ["a"] }),
                object = { method: function (p) {} },
                spy = sinon.spy(object, "method");
            
            spy.withArgs(["outer div | xhr link", true]);

            common.mediator.on('module:clickstream:click', spy);

            bean.fire(document.getElementById('click-me-quick'), 'click');

            runs(function(){
                expect(spy.withArgs(['outer div | xhr link', true, false])).toHaveBeenCalledOnce();
                expect(spy).toHaveBeenCalledOnce();
            });
        });

        it("should indicate if a click eminates from a internal anchor", function(){

            var cs  = new Clickstream({ filter: ["p"] }),
                object = { method: function (p) {} },
                spy = sinon.spy(object, "method");
            
            spy.withArgs(["outer div | parapraph", false, true]);

            common.mediator.on('module:clickstream:click', spy);

            bean.fire(document.getElementById('click-me-slow'), 'click');

            runs(function(){
                expect(spy.withArgs(['outer div | paragraph', false, true])).toHaveBeenCalledOnce();
                expect(spy).toHaveBeenCalledOnce();
            });
        });



    });

});

