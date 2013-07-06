/**
 * dedalus-web.js v0.9
 * 2013, Gustavo Di Pietro
 * Licensed under the MIT license (http://opensource.org/licenses/MIT)
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

        // Set the utility buttons functionality
        this.undoTarget.on('click', this.undo.bind(this));
        this.saveTarget.on('click', this.save.bind(this));
        this.restoreTarget.on('click', this.restore.bind(this));
        this.resetTarget.on('click', this.reset.bind(this));

        // Set the title
        this.titleTarget.html(this.getTitle());

        // Set the story to its initial state
        this.executeReset();

        // subscribe to inventory changes
        this.messageCenter.subscribe('inventory', 'dedalusWeb', this.updateInventory.bind(this));

        $('body, html').on('click', function () {
            self.interactionTarget.hide();
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
         * @param  {Function} fn      Function to be executed when the newly created
         *                            link is clicked
         */
        function handle (element, attrib, fn) {
            self.domTarget.find(element).each(function () {
                var self   = $(this),
                    target = self.attr(attrib),
                    text   = self.text(),
                    link   = $('<a href="#">' + text + '</a>');

                link.on('click', function (e) {
                    fn(target, e);
                    e.stopPropagation();
                    return false;
                });

                self.after(link);
                self.remove();
            });
        }

        // Convert <turn to> (turn page action)
        handle('turn', 'to', function (target) {
            self.turnTo(target);
            self.interactionTarget.hide();
        });

        // Convert <interact with> (object or character action)
        handle('interact', 'with', function (target, e) {
            self.interactWith(target, e);
        });

        // Convert <show paragraph> (paragraph element)
        handle('show', 'paragraph', function (target) {
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
            self    = this,
            object  = this.getObject(target),
            actions = object.getActiveActions();

        this.interactionTarget.html('<ul></ul>');

        /**
         * Generate a function to be attached to an action menu item that, when
         * clicked, prints cont
         * @param  {doT} cont doT template to execute and print
         * @return {Function} The function to be called on object click
         */
        function makeOnClick (cont) {
            return function () {
                self.print(cont);
                self.interactionTarget.hide();
                self.handleInteractions();
            };
        }

        for (action in actions) {
            if (actions.hasOwnProperty(action)) {
                content = actions[action].content;
                link    = $('<a href="#">' + action + '</a>');

                link.on('click', makeOnClick(content));

                // Create the <a> within a <li> within the target <ul>
                this.interactionTarget.find('ul').append(link);
                this.interactionTarget.find('ul>a').wrap('<li>');

                // Position teh interaction host element under the clicked link
                // and centered to it
                this.interactionTarget.css('left', e.pageX - (this.interactionTarget.width() / 2));
                this.interactionTarget.css('top',  e.pageY + 10);

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
            link          = $('<a href="#">' + inventoryName + '</a>');

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
            this.domTarget.append(wrappedContent);
        } else {
            this.domTarget.html(wrappedContent);
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

    DedalusWeb.prototype.endGame = function () {
        // Disable all the links available in domTarget and inventoryTarget
        this.domTarget.find('a').off('click').contents().unwrap();
        this.inventoryTarget.find('a').off('click').contents().unwrap();
    };

}());