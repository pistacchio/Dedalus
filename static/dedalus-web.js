/**
 * dedalus-web.js v0.9.5
 * 2013, Gustavo Di Pietro
 * Licensed under the GPL license (http://www.gnu.org/licenses/gpl-2.0.html)
**/

/**
 * DedalusWeb is an implementatio on Dedalus (that DedalusWeb depens on) that
 * runs a Dedalus story in a browser
 */

var DedalusWeb;

(function () {
    "use strict";
    /*jslint evil: true, white: true, nomen: true */
    /*global Dedalus, $, jQuery, doT, localStorage*/

    /**
     * DedalusWeb class inheriting from Dedalus
     * @param  {JSON} options A dictionary of configuration options:
     *                            {
     *                                domTarget:         jQuery element that will contain the output
     *                                                   of the running story
     *                                inventoryTarget:   jQuery element that will contain the inventory
     *                                                   items
     *                                titleTarget:       jQuery element that will contain the title
     *                                                   of the story
     *                                interactionTarget: jQuery element that will contain the dynamic
     *                                                   action menu. Should have "position: absolute"
     *                                undoTarget:        jQuery <a> element that, clicked, runs the undo
     *                                                   action
     *                                saveTarget:        jQuery <a> element that, clicked, runs the save
     *                                                   action
     *                                restoreTarget:     jQuery <a> element that, clicked, runs the restore
     *                                                   action
     *                                resetTarget:       jQuery <a> element that, clicked, runs the reset
     *                                                   action
     *                                undoStageTarget:   jQuery element that will contain a temporary copy
     *                                                   of domTarget. Should have "display: none"
     *                            }
     * @return                    A DedalusWeb instance
     */
    DedalusWeb = function (options) {
        var self = this;

        Dedalus.call(this, options);

        this.domTarget         = options.domTarget;
        this.inventoryTarget   = options.inventoryTarget;
        this.titleTarget       = options.titleTarget;
        this.interactionTarget = options.interactionTarget;
        this.undoTarget        = options.undoTarget;
        this.saveTarget        = options.saveTarget;
        this.restoreTarget     = options.restoreTarget;
        this.resetTarget       = options.resetTarget;
        this.undoStageTarget   = options.undoStageTarget;
        this.domTargetParent   = options.domTargetParent;
        this.onPrint           = options.onPrint ? options.onPrint.bind(this) : this.onPrint;

        // Set the utility buttons functionality
        this.undoTarget.on('click', this.undo.bind(this));
        this.saveTarget.on('click', this.save.bind(this));
        this.restoreTarget.on('click', this.restore.bind(this));
        this.resetTarget.on('click', this.reset.bind(this));

        // Set the title
        this.titleTarget.html(this.getTitle());

        // Set the story to its initial state
        this.executeReset();

        // Subscribe to inventory changes
        this.messageCenter.subscribe('inventory', 'dedalusWeb', this.updateInventory.bind(this));

        // Make the interaction menu disappear on body click if there is no combination
        // action awaiting for a parameter
        $('body, html').on('click', function () {
            if(!self.isCombinationAction()) {
                self.interactionTarget.hide();
                self.disactivateCombinationAction();
            }
        });

    };

    DedalusWeb.prototype = new Dedalus();

    /**
     * Convert all the meningful tags (<turn to>, <interact with>, <show paragraph>)
     * withing domTarget into action links
     */
    DedalusWeb.prototype.handleInteractions = function () {
        var self = this;

        /**
         * Convert a target element into a link than, when clicked, runs fn with
         * argument attrib
         * @param  {String}   element Element to convert into <a>
         * @param  {String}   attrib  Attribute to pass to fn
         * @param  {String}   type    object|parapgraph|page added as class to the newly
         *                            created link
         * @param  {Function} fn      Function to be executed when the newly created
         *                            link is clicked
         */
        function handle (element, attrib, type, fn) {
            self.domTarget.find(element).each(function () {
                var elem       = $(this),
                    target     = elem.attr(attrib),
                    originalId = elem.attr('id'),
                    elemId     = originalId ? 'data-id="' + elem.attr('id') + '"' : '',
                    targetId   = 'data-target-id="' + target + '"',
                    isDisabled = elem.hasClass('disabled'),
                    text       = elem.text(),
                    link       = $('<a href="#" ' + elemId + ' ' + targetId + '>' + text + '</a>');

                link.on('click', function (e) {
                    fn(target, e);
                    e.stopPropagation();
                    return false;
                });

                link.addClass(type);

                elem.after(link);
                elem.remove();

                // Actually disable a pre-desabled link (has class="disabled"). Must have an id
                if (isDisabled) {
                    self.disable(originalId);
                }

            });
        }

        // Convert <turn to> (turn page action)
        handle('turn', 'to', 'page', function (target) {
            self.turnTo(target);
            self.interactionTarget.hide();
        });

        // Convert <interact with> (object or character action)
        handle('interact', 'with', 'object', function (target, e) {
            self.interactWith(target, e);
        });

        // Convert <show paragraph> (paragraph element)
        handle('show', 'paragraph', 'paragraph', function (target) {
            self.showParagraph(target);
            self.interactionTarget.hide();
        });
    };

    /**
     * Return the actions available for the interaction with a given object
     * @param  {String}       target Id of the object or character to interact with
     * @param  {jQuery Event} e      Event generated when clicking on the element
     * @return {JSON}                A dictionary with the available actions
     */
    DedalusWeb.prototype.interactWith = function (target, e) {
        var action,
            content, link,
            self           = this,
            object         = this.getObject(target),
            actions        = object.getActiveActions(),
            clickedElement = $(e.target);

        this.interactionTarget.html('<ul></ul>');

        /**
         * Generate a function to be attached to an action menu item that, when
         * clicked, prints cont
         * @param  {JSON} action Dedalus object action to make "onClick" for
         * @return {Function}    The function to be called on object click
         */
        function makeOnClick (action) {
            return function () {

                // If the action is of type "use this in combination with something else"
                // set the current combination action and populate interactionTarget
                // with possible candidates (all the objects visible in domTarget and
                // those in the inventory, exluding the object calling the combination
                // action), else execute the action
                if (action.hasWith) {
                    self.activateCombinationAction();
                    self.interactionTarget.html('<ul></ul>');

                    $(self.domTarget).find('a.object').add($(self.inventoryTarget).find('a')).each(function(idx, elem) {
                        var element                  = $(elem),
                            link                     = $(element.prop('outerHTML')),
                            targetId                 = link.attr('data-target-id'),
                            object                   = self.getObject(targetId),
                            elemText                 = link.text(),
                            linkText                 = object.inventoryName || elemText,
                            combinationActionContent = action['with'][targetId] || action.content;

                        // Skip current object, it cannot be associated with itself!
                        if (targetId === target) {
                            return;
                        }

                        // Set the text of the new <a> to inventoryName of the object
                        // or to the current link text
                        link.text(linkText);

                        link.on('click', function () {
                            self.print(combinationActionContent);
                            self.interactionTarget.hide();
                            self.handleInteractions();
                            self.disactivateCombinationAction();
                        });

                        self.interactionTarget.find('ul').append(link);
                        self.interactionTarget.find('ul>a').wrap('<li>');
                    });
                } else {
                    self.print(action.content);
                    self.interactionTarget.hide();
                    self.handleInteractions();
                    self.disactivateCombinationAction();
                }
            };
        }

        for (action in actions) {
            if (actions.hasOwnProperty(action)) {
                content = actions[action].content;
                link    = $('<a href="#" data-target-id="' + target + '">' + action + '</a>');

                link.on('click', makeOnClick(actions[action]));

                // Create the <a> within a <li> within the target <ul>
                this.interactionTarget.find('ul').append(link);
                this.interactionTarget.find('ul>a').wrap('<li>');

                // Position teh interaction host element under the clicked link
                // and centered to it
                this.interactionTarget.css('left', clickedElement.offset().left - (this.interactionTarget.width() / 2) + (clickedElement.width() / 2));
                this.interactionTarget.css('top',  clickedElement.offset().top + 20);

                this.interactionTarget.show();
            }
        }

        return actions;
    };

    /**
     * Refresh the inventory host element with the items currently in inventory
     */
    DedalusWeb.prototype.updateInventory = function () {
        var i, link, object, inventoryName,
            self  = this,
            items = this.getInventory();

        this.inventoryTarget.html('<ul></ul>');

        /**
         * Generate a function to be attached to an action menu item that, when
         * clicked, triggers the object action
         * @param  {JSON} obj A story object item
         * @return {Function} The function to be called on object action click
         */
        function makeOnClick (obj) {
            return function (e) {
                self.interactWith(obj, e);
                e.stopPropagation();
                return false;
            };
        }

        for (i = 0; i < items.length; i += 1) {
            object        = this.getObject(items[i]);
            inventoryName = object.inventoryName;
            link          = $('<a href="#" data-target-id="' + items[i] + '">' + inventoryName + '</a>');

            link.on('click', makeOnClick(items[i]));

            // Create the <a> within a <li> within the target <ul>
            this.inventoryTarget.find('ul').append(link);
            this.inventoryTarget.find('ul>a').wrap('<li>');
        }
    };

    DedalusWeb.prototype.executePrinting = function (content, turnPage) {
        var isTurn          = turnPage || false,
            wrappedContent  = '<p>' + content() + '</p>';

        if (!isTurn) {
            if (this.onPrint(wrappedContent, false)) {
                this.domTarget.append(wrappedContent);
            }
        } else {
            if (this.onPrint(wrappedContent, true)) {
                this.domTarget.html(wrappedContent);
            }
        }

        this.handleInteractions();
    };

    DedalusWeb.prototype.executeUndo = function () {
        // Empty domTarget and refill it with the previous state stored in
        // undoStageTarget
        this.domTarget.html('');
        this.undoStageTarget.appendTo(this.domTarget);
        this.updateInventory();
    };

    DedalusWeb.prototype.afterUndoSave = function () {
        // Empty undoStageTarget and refill it with a deep cloned copy of
        // domTarget
        this.undoStageTarget.html('');
        this.undoStageTarget = this.domTarget.children().clone(true);
    };

    DedalusWeb.prototype.executeSave = function (story, _story) {
        // Save story data in localStorage
        localStorage.story  = JSON.stringify(story);
        localStorage._story = JSON.stringify(_story);
    };

    DedalusWeb.prototype.saveAvailable = function () {
        return localStorage.story && localStorage._story;
    };

    DedalusWeb.prototype.getRestoreData = function () {
        return [jQuery.parseJSON(localStorage.story), jQuery.parseJSON(localStorage._story)];
    };

    DedalusWeb.prototype.executeRestore = function () {
        this.updateInventory();
        this.turnTo(this.getCurrentPageId());
    };

    DedalusWeb.prototype.executeReset = function () {
        this.turnTo('intro');
        this.turnTo(this.getCurrentPageId(), true);
        this.resetCounters();
        this.updateInventory();
        this.executeInitialization();

        this.interactionTarget.hide();
    };

    DedalusWeb.prototype.disable = function (id) {
        // Subsitute the matched <a> with a <span> remembering the click function
        var element = this.domTarget.find('a[data-id="' + id + '"]'),
            elementDom,
            spanElement,
            originalClickFn;

        if (element.length > 0) {
            elementDom      = element.get(0),
            spanElement     = '<span data-id="' + id + '">' + element.text() + '</span>',

            // Trick to get the current click event
            // http://stackoverflow.com/questions/2518421/jquery-find-events-handlers-registered-with-an-object
            originalClickFn = $._data(elementDom, 'events').click[0].handler;

            // Make the <a> a <span>
            element.after($(spanElement).data('originalClickFn', originalClickFn));
            element.remove();
        }
    };

    DedalusWeb.prototype.enable = function (id) {
        // Subsitute the matched <span> with a <a> restoring the click function
        var element         = this.domTarget.find('span[data-id="' + id + '"]'),
            aElement        = '<a href="#" data-id="' + id + '">' + element.text() + '</a>',
            originalClickFn = element.data('originalClickFn');

        // Restore original click function
        element.after($(aElement).on('click', originalClickFn));
        element.remove();
    };

    DedalusWeb.prototype.endGame = function () {
        // Disable all the links available in domTarget and inventoryTarget
        this.domTarget.find('a').off('click').contents().unwrap();
        this.inventoryTarget.find('a').off('click').contents().unwrap();
    };

    DedalusWeb.prototype.onPrint = function (content, turn) {
        return true;
    };

}());
