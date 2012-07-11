define(["bean", guardian.js.modules["$g"]], function(bean, $g) {
    function toggle(item) {
        var trails = $g.qsa("li", item)

        for (i = 0; i < trails.length; i++) {
            var trail = trails[i];

            //interestingly, style.display does not work in this case...
            var isVisible = trail.getClientRects().length > 0

            if (!isVisible) {
                trail.style.display = "block";
                trail.setAttribute("was-hidden", "true");
            } else if (trail.getAttribute("was-hidden") == "true") {
                trail.style.display = "none"
            }
        }
    }

    function init(items) {
        if (typeof itmes == "undefined") {
            items = $g.qsa(".expander");
        }
        for (i = 0; i < items.length; i++) {
            var item = items[i];
            bean.add(item, 'click', function(e) {
                toggle(e.srcElement.parentNode)
            });
        }
    }

    return {
        init: init
    };
});