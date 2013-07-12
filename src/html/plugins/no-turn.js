/**
 * DedalusWeb.prototype.onPrint plugin. Prevents the "turn page" action to
 * erase the content of domTarget. It always happends the new content, being it
 * from a paragraph, an action or a new page.
 */
function onPrintNoTurn (content, turn) {
    "use strict";
    /*jslint white: true */
    /*global document*/

    /**
     * Turn a <a> element into a <span> with the same text
     * @param  {Integer}     index Not used
     * @param  {DOM Element} elem  The <a> to convert
     */
    function aToSpan (index, elem) {
        var element = $(elem);

        element.after('<span>' + element.text() + '</span>');
        element.remove();
    }

    // If the page *should* turn, just make all the current links unavailable
    // and append the new content instead
    if (turn) {
        this.domTarget.find('a').each(aToSpan);
        this.domTarget.append('<hr>');
    }

    this.domTarget.append(content);
    $('html, body').animate({scrollTop: $(document).height()}, 'slow');

    return false;
}