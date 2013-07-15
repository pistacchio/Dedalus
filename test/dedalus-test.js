// Helper functions to find matching text within a jQuery element
function contain (jQueryElement, text) {
    return jQueryElement.text().indexOf(text) !== -1;
}

function notContain (jQueryElement, text) {
    return !contain(jQueryElement, text);
}

function mergeText (el) {
    return el.text().replace(/\s+/g, '');
}


// QUnit configuration
QUnit.config.reorder   = false;

// Test cases
test('Title set', function () {
    equal($('#title').text(), 'QUnit testing story!');
});

test('Intro printed', function () {
    ok(contain($('#host'), 'Intro text'));
});

test('First page printed', function () {
    ok(contain($('#host'), 'First page'));
});

test('Empty inventory', function () {
    equal($('#inventoryHost ul').length, 1);
    equal($('#inventoryHost ul li').length, 0);
});

test('Initialization script invoked', function () {
    equal(story.customVariable, 42);
    equal($('#inventoryHost ul li').length, 0);
});

test('Page turned', function () {
    ok(notContain($('#host'), 'Second page'));
    ok(notContain($('#host'), 'Should show'));
    ok(notContain($('#host'), "Shouldn't show"));
    $('a:contains("second page")').click();
    ok(contain($('#host'), 'Second page'));
    ok(contain($('#host'), 'Should show'));
    ok(notContain($('#host'), "Shouldn't show"));
    ok(notContain($('#host'), 'First page'));
});

test('Paragraph shown', function () {
    ok(notContain($('#host'), 'Some paragraph'));
    $('a:contains("first paragraph")').click();
    ok(contain($('#host'), 'Some paragraph'));
});

test('Before and after page turn events', function () {
    equal(story.beforeEveryPageTurnCheck, false);
    equal(story.afterEveryPageTurnCheck, false);
    ok(story.currentPageIs('secondPage'));
    $('a:contains("third page")').click();
    equal(story.beforeEveryPageTurnCheck, true);
    equal(story.afterEveryPageTurnCheck, true);
    ok(story.currentPageIs('thirdPage'));
});

test('Before and after paragraph turn events', function () {
    equal(story.beforeEveryParagraphCheck, false);
    equal(story.afterEveryParagraphCheck, false);
    $('a:contains("second paragraph")').click();
    equal(story.beforeEveryParagraphCheck, true);
    equal(story.afterEveryParagraphCheck, true);
});

test('Interaction with objects', function () {
    equal($('#interactionHost li').children().length, 0);
    $('a:contains("first object")').click();
    equal($('#interactionHost li').children().length, 2);
    equal($('#interactionHost li:first').text(), 'Examine');
    equal($('#interactionHost li:nth-child(2)').text(), 'Get');

    ok(notContain($('#host'), 'Just a simple object'));
    $('a:contains("Examine")').click();
    ok(contain($('#host'), 'Just a simple object'));
});

test('Inventory and object "when" descriptor', function () {
    equal($('#inventoryHost ul li').length, 0);
    $('a:contains("first object")').click();
    equal($('#interactionHost li:nth-child(2)').text(), 'Get');
    $('a:contains("Get")').click();
    equal($('#inventoryHost ul li').length, 1);
    ok(contain($('#inventoryHost ul li:first'), 'First object'));
    ok(story.isInInventory('firstObject'));
    $('a:contains("first object")').click();
    equal($('#interactionHost li:nth-child(2)').text(), 'Drop');
    equal($('#interactionHost li:nth-child(3)').text(), '');
    $('a:contains("first object")').click();
    $('a:contains("Drop")').click();
    ok(notContain($('#inventoryHost ul li:first'), 'First object'));
    equal(story.isInInventory('firstObject'), false);
});

test('Before and after everythig', function () {
    equal(story.beforeEverytingCounter, 49);
    equal(story.afterEverytingCounter, -49);
});

test('Counters', function () {
    equal(story.getNumPagesTurned(), 2);
    equal(story.getNumParagraphsShown(), 2);
    equal(story.getNumParagraphsShownInPage(), 1);
    equal(story.getNumActionsPerformedInPage(), 4);
    $('a:contains("second paragraph")').click();
    $('a:contains("second paragraph")').click();
    $('a:contains("first object")').click();
    $('a:contains("Get")').click();
    equal(story.getNumParagraphsShown(), 4);
    equal(story.getNumParagraphsShownInPage(), 3);
    equal(story.getNumTotalActions(), 10);
    equal(story.getNumActionsPerformedInPage(), 7);
});

test('Paragraph showing from script', function () {
    $('a:contains("second object")').click();
    $('a:contains("Show Paragraph")').click();
    ok(contain($('#host'), 'Third paragraph'));
});

test('Page turning from script', function () {
    ok(story.currentPageIs('thirdPage'));
    $('a:contains("second object")').click();
    $('a:contains("Turn Page")').click();
    ok(story.currentPageIs('fourthPage'));
});

test('Characters', function () {
   ok(notContain($('#host'), 'Bla Bla'));
    $('a:contains("character")').click();
    $('a:contains("Talk")').click();
    ok(contain($('#host'), 'Bla Bla'));
});

test('Combination actions', function () {
    $('a:contains("third object")').click();
    $('a:contains("Use with...")').click();
    equal(mergeText($('#interactionHost')), 'Firstobjectcharacterfourthobject');
    ok(notContain($('#host'), 'Interaction with fourth object'));
    $('#interactionHost a:contains("fourth object")').click();
    ok(contain($('#host'), 'Interaction with fourth object'));

    ok(notContain($('#host'), 'Interaction with first character'));
    $('a:contains("third object")').click();
    $('a:contains("Use with...")').click();
    $('#interactionHost a:contains("character")').click();
    ok(contain($('#host'), 'Interaction with first character'));

    ok(notContain($('#host'), 'Default value'));
    $('a:contains("third object")').click();
    $('a:contains("Use with...")').click();
    $('#interactionHost a:contains("First object")').click();
    ok(contain($('#host'), 'Default value'));
});

test('Id in links', function () {
    equal($('#host a:contains("character")').attr('data-id'), 'characterId');
});


test('Disable/Enable', function () {
    $('a:contains("third page")').click();
    $('a:contains("second paragraph")').click();
    $('a:contains("fourth paragraph")').click();
    equal($('#host').text().indexOf('fourth paragraph content'), -1);
    $('a:contains("fourth paragraph enable")').click();
    $('a:contains("fourth paragraph")').click();
    notEqual($('#host').text().indexOf('fourth paragraph content'), -1);
    $('a:contains("Disabled link")').click();
    equal($('#host').text().indexOf('sixth paragraph content'), -1);
});

test('End game', function () {
    equal($('#host a').length, 5);
    equal(mergeText($('#host')), 'ThirdPageLinktosecondparagraphfirstobjectsecondobjectLinktofourthparagraphRe-enablefourthparagraphenableDisabledlinkSecondparagraphfourthparagraphcontent');
    story.endGame();
    equal($('#host a').length, 0);
    equal(mergeText($('#host')), 'ThirdPageLinktosecondparagraphfirstobjectsecondobjectLinktofourthparagraphRe-enablefourthparagraphenableDisabledlinkSecondparagraphfourthparagraphcontent');
});
