/**
 * DedalusWeb.prototype.onPrint plugin. Present the new content with a nice fade,
 * by adding the page or paragraph completely transparent and then fading it in
 */
function onPrintFade (content, turn) {
    "use strict";
    /*jslint white: true */

    var self = this,
        newElement;

    if (turn) {
        this.domTarget.css('opacity', 0);
        self.domTarget.html(content);
        this.domTarget.animate({'opacity': 1}, 300);
    } else {
        newElement = $(content).css('opacity', 0);
        this.domTarget.append(newElement);
        newElement.animate({'opacity': 1}, 300);
    }

    return false;
}
