(function(){

    /*  super basic printf / templating tool
        source: http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format/4673436#4673436 */
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };

    var require_libs = {
        // for some reason require adds .js to these paths
        "paths" : {
            "reqwest"   : "http://4.gu-pasteup.appspot.com/js/libs/reqwest.min"
        }
    };

    require(require_libs, ["http://3.gu-pasteup.appspot.com/js/detect/detect.js", "http://3.gu-pasteup.appspot.com/js/detect/images.js", "reqwest"], function(detect, images, reqwest) {

        var gu_debug = {
            screenHeight: screen.height,
            screenWidth: screen.width,
            windowWidth: window.innerWidth || document.body.offsetWidth || 0,
            windowHeight: window.innerHeight || document.body.offsetHeight || 0,
            layout: detect.getLayoutMode(),
            bandwidth: detect.getConnectionSpeed(),
            battery: detect.getBatteryLevel(),
            pixelratio: detect.getPixelRatio(),
            retina: (detect.getPixelRatio() === 2) ? 'true' : 'false'
        };

        for (var key in gu_debug) {
            document.getElementById(key).innerText = gu_debug[key];
        }

        // Find and upgrade images.
        images.upgrade();
        
        // fetch comments for article (if available)
        if (guardian.pageData.commentable) {

            // get discussion URL
            var urlBase = 'http://coddisapi01.gudev.gnl:8900/discussion-api/discussion/';
            var shortUrl = guardian.pageData['short-url'].replace("http://gu.com", "");
            var discussionAjaxUrl = urlBase + shortUrl;

            // fetch via ajax
            reqwest({
                url: discussionAjaxUrl + '?callback=?',
                type: 'jsonp',
                jsonpCallback: 'callback',
                jsonpCallbackName: 'showArticleComments',
                success: function(json) {

                    if (json.discussion.commentCount > 0) {

                        // util for comment datastamps
                        function formatDate(d) {
                            var day = d.getDate();
                            var month = d.getMonth() + 1;
                            var year = d.getFullYear();
                            var monthName = '';
                            var minutes = d.getMinutes();
                            var hours = d.getHours();
                            var meridian = 'AM'
                            if (hours > 12) {
                                hours = hours-12;
                                meridian = 'PM';
                            }


                            switch(month) {
                                case 1:
                                    monthName = 'Jan';
                                    break;
                                case 2:
                                    monthName = 'Feb';
                                    break;
                                case 3:
                                    monthName = 'March';
                                    break;
                                case 4:
                                    monthName = 'April';
                                    break;
                                case 5:
                                    monthName = 'May';
                                    break;
                                case 6:
                                    monthName = 'June';
                                    break;
                                case 7:
                                    monthName = 'July';
                                    break;
                                case 8:
                                    monthName = 'Aug';
                                    break;
                                case 9:
                                    monthName = 'Sep';
                                    break;
                                case 10:
                                    monthName = 'Oct';
                                    break;
                                case 11:
                                    monthName = 'Nov';
                                    break;
                                case 12:
                                    monthName = 'Dec';
                                    break;
                                
                            }

                            return day + ' ' + monthName + ' ' + year + ', ' + hours + ':' + minutes + ' ' + meridian;
                        }

                        var html = '<h4>Comments <span class="count">' + json.discussion.commentCount + '</span></h4>';
                        var commentTemplate = '<div class="line b1"><div class="unit size1of3"><p><strong><a href="{0}">{1}</a></strong></p></div><div class="unit lastUnit"><p class="datestamp">{2}</p></div></div><div class="line"><div class="unit size1of1">{3}</div></div>';
                        var avatarTemplate = ' <a href="{0}"><img class="badge" src="{1}" alt="{2}" /></a>';

                        for (var i in json.discussion.comments) {
                            var c = json.discussion.comments[i];
                            var username = c.userProfile.username;
                            var datestamp = new Date(c.date);
                            datestamp = formatDate(datestamp);

                            if (c.userProfile.badge) {
                                for (var j in c.userProfile.badge) {
                                    var b = c.userProfile.badge[j];
                                    username += avatarTemplate.format('#', b.imageUrl, b.name);
                                }
                            }
                            html += commentTemplate.format('#', username, datestamp, c.body);
                        }

                        var commentsPlaceholder = document.createElement("div");
                        commentsPlaceholder.className = 'comments';
                        commentsPlaceholder.innerHTML = html;
                        var article = document.querySelector("article");
                        var parent = article.parentNode;

                        parent.insertBefore(commentsPlaceholder, article.nextSibling)

                    }
                }
            });

        } // end of commentable check

    });

})();