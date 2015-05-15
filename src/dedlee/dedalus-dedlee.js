/**
 * dedalus-dadlee.js v0.9.0
 * 2013, Gustavo Di Pietro
 * Licensed under the GPL license (http://www.gnu.org/licenses/gpl-2.0.html)
**/

/**
 * Parse a Dedalus story in dedlee format and generate a standard Dedalus HTML-like story
 * @param  {jQuery} inputSource jQuery element that contains, in its body, the dedlee source
 * @param  {jQuery} target      jQuery element where to append the  output of the parsing
 */
Dedalus.prototype.parseDedlee = function (inputSource, target) {
    "use strict";
    /*jslint evil: true, white: true, nomen: true */
    /*global $, Dedalus*/

    var i,
        lineCounter,
        cleanSource    = Dedalus.getRawContent(inputSource),
        sourceLines    = cleanSource.match(/[^\r\n]+/g),
        notEmptyLines  = removeEmptyLinesAndComments(sourceLines),
        source         = indentToMin(notEmptyLines),
        scriptTags     = ['initscript', 'beforeEveryThing', 'beforeEveryPageTurn', 'beforeEveryParagraphShown', 'afterEveryThing', 'afterEveryPageTurn', 'afterEveryParagraphShown'];

    /**
     * Actual function that operate the parsing based on rules and substitutions
     * @return {[type]} [description]
     */
    function parseBlock () {
        var lineNum         = 0,
            relativeLineNum = 0,
            line            = '',
            out             = '',
            rules           = [
                // Title tag. Get the first line of dedlee source and treat it like the story title
                {
                    type       : 'title',
                    check      : function () { return lineNum === 0; },
                    singleLine : true,
                    openTag    : function () { return '<title>' + line + '</title>'; },
                    closeTag   : null
                },
                // Initscript and before/after actions. Just add the content to the appropriate tag
                {
                    type       : 'scriptTag',
                    check      : function () { return scriptTags.indexOf(line) !== -1; },
                    singleLine : false,
                    openTag    : function () { return '<' + line + '>'; },
                    closeTag   : function () { return '</' + line + '>'; }
                },
                // Objects. Turn o.OBJECT_ID "OPTIONAL_INVENTORY_NAME" in
                // <obj id="OBJECT_ID" inventoryName="OPTIONAL_INVENTORY_NAME">
                {
                    type       : 'object',
                    check      : function () { return line.ltrim().startsWith('o.'); },
                    singleLine : false,
                    openTag    : function () {
                        var maybeInventory = (line.match(/\"(.*)\"/) || [])[1],
                            inventory      = maybeInventory ? 'inventoryName="' + maybeInventory + '"' : '',
                            cleanLine      = line.replace(/(\".*\")/, ''),
                            split          = cleanLine.trim().split('.'),
                            objectId       = split[1],
                            objectClass    = split.length === 3 ? 'class="' + split[2] + '"' : '';


                        return '<obj id="' + objectId + '" ' + inventory + ' ' + objectClass + '>';
                    },
                    closeTag   : function () { return '</obj>'; }
                },
                // Characters. Just like Objects
                {
                    type       : 'character',
                    check      : function () { return line.ltrim().startsWith('c.'); },
                    singleLine : false,
                    openTag    : function () {
                        var maybeInventory = (line.match(/\"(.*)\"/) || [])[1],
                            inventory      = maybeInventory ? 'inventoryName="' + maybeInventory + '"' : '',
                            split          = line.trim().split('.'),
                            characterId    = split[1],
                            characterClass = split.length === 3 ? 'class="' + split[2] + '"' : '';


                        return '<character id="' + characterId + '" ' + inventory + ' ' + characterClass + '>';
                    },
                    closeTag   : function () { return '</obj>'; }
                },
                // Object and characted actions. Look for every line in double quotes
                // and treat it the the action id, for example:
                //
                // "Examine"
                //      Handome as usual
                //
                // generates:
                // <action id="Examine">
                //      Handome as usual
                // </Action>
                {
                    type       : 'action',
                    check      : function (currentRule) { return (currentRule === 'object' || currentRule === 'character') && line.ltrim().startsWith('"'); },
                    singleLine : false,
                    openTag    : function () { return '<action id="' + line.ltrim().replace(/\"+/g, '') + '">'; },
                    closeTag   : function () { return '</action>'; }
                },
                // Action when clause. A string starting with "when", right after
                // the beninning of an action produces the <when> tag with its content
                {
                    type       : 'when',
                    check      : function (currentRule) { return currentRule === 'action' && line.ltrim().startsWith('when') && relativeLineNum === 0; },
                    singleLine : true,
                    openTag    : function () { return '<when>' + line.ltrim().replace(/^when /, '') + '</when>'; },
                    closeTag   : null
                },
                // Combination actions. Turn with.OBJECT_ID in <with id="object">
                {
                    type       : 'with',
                    check      : function (currentRule) { return currentRule === 'action' && line.ltrim().startsWith('with'); },
                    singleLine : false,
                    openTag    : function () {
                        var split    = line.trim().split('.'),
                            objectId = split[1];

                        return '<with id="' + objectId + '">';
                    },
                    closeTag   : function () { return "</with>"; }
                },
                // Pages. Turn p.PAGE_ID in <page id="PAGE_ID">
                {
                    type       : 'page',
                    check      : function () { return line.ltrim().startsWith('p.'); },
                    singleLine : false,
                    openTag    : function () {
                        var split      = line.trim().split('.'),
                            pageId     = split[1],
                            pageClass  = split.length === 3 ? 'class="' + split[2] + '"' : '';

                        return '<page id="' + pageId + '" ' + pageClass + '>';
                    },
                    closeTag   : function () { return '</page>'; }
                },
                // Paragraphs. Turn pg.PARAGRAPH_ID in <page id="PARAGRAPH_ID">
                {
                    type       : 'paragraph',
                    check      : function () { return line.ltrim().startsWith('pg.'); },
                    singleLine : false,
                    openTag    : function () {
                        var split          = line.trim().split('.'),
                            paragraphId    = split[1],
                            paragraphClass = split.length === 3 ? 'class="' + split[2] + '"' : '';

                        return '<paragraph id="' + paragraphId + '" ' + paragraphClass + '>';
                    },
                    closeTag   : function () { return '</paragraph>'; }
                },
                // Everything else is just printed out like it is
                {
                    type       : 'other',
                    check      : function () { return true; },
                    singleLine : true,
                    openTag    : function () { return line; },
                    closeTag   : null
                }
            ],
            substRules = [
                // [[PAGE_ID]]link to page[[]] => <turn to="PAGE_ID">link to page</turn>
                {
                    applyTo    : 'page, paragraph, action',
                    replaceRgx : /\[\[(.*?)\]\](.*?)\[\[\]\]/g,
                    withRgx    : '<turn to="$1">$2</turn>'
                },
                // {{OBJECT_ID}}link to object{{}} => <interact with="OBJECT_ID">link to object</interact>
                {
                    applyTo    : 'page, paragraph, action',
                    replaceRgx : /\{\[(.*?)\]\}(.*?)\{\[\]\}/g,
                    withRgx    : '<interact with="$1">$2</interact>'
                },
                // (PARAGRAPH_ID))link to paragraph() => <show paragraph="PARAGRAPH_ID">link to paragraph</show>
                {
                    applyTo    : 'page, paragraph, action',
                    replaceRgx : /\(\((.*?)\)\)(.*?)\(\(\)\)/g,
                    withRgx    : '<show paragraph="$1">$2</show>'
                }
            ];

        /**
         * Recursive function to parse a block starting from the current line
         * to recognize a block, it uses the current indentation level and
         * keeps analyzing line by like till the block dedets (just like Python)
         * @param  {String} currentRule Parent block type (object, action, page...)
         */
        function _parseBlock (currentRule) {
            line            = source[lineNum];
            // Keep track of the line number *withing the block*
            relativeLineNum = 0;

            var i, rule,
                closeTag           = '',
                initialIndentation = intendationLevel(line);

            // Keep working till there are lines or code or the current block
            // ends
            do {
                // Search the appropriate rule
                for (i = 0; i < rules.length; i += 1) {
                        rule = rules[i];

                    if (rule.check.call(this, currentRule)) {
                        // Add the opening tag
                        out += rule.openTag() + '\n';

                        // Recursively analyze the block contained in the current
                        // one if it is not of type "single line"
                        if (!rule.singleLine) {
                            closeTag = rule.closeTag();

                            // Advance by one line to enter the contained block
                            // When done, go back by one line
                            lineNum += 1;
                            _parseBlock(rule.type);
                            lineNum -= 1;

                            // Close the tag
                            out += closeTag + '\n';
                        }

                        lineNum         += 1;
                        relativeLineNum += 1;
                        line            = source[lineNum];

                        break;
                    }
                }
            } while (line && intendationLevel(line) >= initialIndentation);
        }

        _parseBlock();

        target.append(out);

        // Withing every block of text that requires it, substitute placeholders
        // for links with actual <a>
        (function () {
            var substRule;

            function replaceLinks(index, el) {
                // Apply the replace rules to the raw content of the current element
                $(el).html(Dedalus.getRawContent($(el)).replace(substRule.replaceRgx, substRule.withRgx));

                // Search for <turn>, <show>, <interact> whose attribute contains a
                // dot and use it as an indicator of an id to be set. Example:
                // <turn to="page.pageId">link</turn> => <turn to="page" id="pageId">link</turn>
                // A third dot is treated like a class
                // <turn to="page.pageId.pageClass">link</turn> => <turn to="page" id="pageId" class="pageClass">link</turn>
                function setId(idx, e) {
                    e = $(e);
                    var split,
                        attrib    = (e.attr('to') && 'to') || (e.attr('with') && 'with') || (e.attr('paragraph') && 'paragraph'),
                        attribVal = e.attr(attrib);

                    if (attribVal.indexOf('.') !== -1) {
                        split = attribVal.split('.');
                        e.attr(attrib, split[0]);
                        e.attr('id', split[1]);
                        if (split.length === 3) {
                            e.addClass(split[2]);
                        }
                    }
                }
                $(el).find('turn, show, interact').each(setId);
            }

            for (i = 0; i < substRules.length; i += 1) {
                substRule = substRules[i];

                target.find(substRule.applyTo).each(replaceLinks);
            }
        }());

    }

    parseBlock();

    /* ** UTILITY FUNCTIONS ** */

    /**
     * Calculate the number of spaces in front of a string
     * @param  {String} str string to evaluate
     * @return {Integer}    number of spaces before the string
     */
    function intendationLevel(str) {
        return str.length - str.ltrim().length;
    }

    /**
     * Given an array of strings, return only those that are not empty and not
     * commented (staring with #)
     * @param  {Array} strings Strings to filter
     * @return {Array}         string without empty lines
     */
    function removeEmptyLinesAndComments(strings) {
        return strings.filter(function (str) {
            return str.trim() !== '' && !str.trim().startsWith('#');
        });
    }

    /**
     * Find the minimum indentation level of an array of strings and align
     * all of them to the lower one, for example:
     * ---
     *         AAA
     *             BBB
     *         CCC
     *                 DDD
     * ---
     * returns
     * ---
     * AAA
     *     BBB
     * CCC
     *         DDD
     * ---
     *
     * @param  {Array} strings String to align to the left
     * @return {Array}         Aligned strings
     */
    function indentToMin(strings) {
        var minIndentation =  Math.min.apply(Math,
                strings.map(function (line) {
                    return intendationLevel(line);
                }));

        return strings.map(function (line) {
            return line.substr(minIndentation).rtrim();
        });
    }

};
