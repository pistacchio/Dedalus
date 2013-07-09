story = {};

Dedalus.prototype.parseDedlee($('#source'), $('#target'));

/**
 * Testing utility to extract the compress text out on element by removing
 * all the spaces
 * @param  {jQuery} el Element to process
 * @return {String}    Compressed lext
 */
function mergeText (el) {
    return el.text().replace(/\s+/g, '');
}

// QUnit configuration
QUnit.config.reorder = false;

// Test cases
test('Title set', function () {
    equal($('#target title').text(), 'QUnit testing story!');
});

test('Init script', function () {
    ok($('#target initscript'));
    eval($('#target initscript').text());
    equal(story.customVariable, 42);
    equal(mergeText($('#target initscript')),  "story.customVariable=42;story.beforeEveryPageTurnCheck=false;story.afterEveryPageTurnCheck=false;story.beforeEveryParagraphCheck=false;story.afterEveryParagraphCheck=falsestory.beforeEverytingCounter=0;story.afterEverytingCounter=0;");
});

test('Before / After tags', function () {
    ok($('#target beforeEveryThing'));
    equal(mergeText($('#target beforeEveryThing')), "story.beforeEverytingCounter+=7;");
    ok($('#target beforeEveryPageTurn'));
    equal(mergeText($('#target beforeEveryPageTurn')), "if(story.currentPageIs('secondPage')){story.beforeEveryPageTurnCheck=true;}");
    ok($('#target beforeEveryParagraphShown'));
    equal(mergeText($('#target beforeEveryParagraphShown')), "if(story.currentPageIs('thirdPage')){story.beforeEveryParagraphCheck=true;}");
    ok($('#target afterEveryThing'));
    equal(mergeText($('#target afterEveryThing')), "story.afterEverytingCounter-=7;");
    ok($('#target afterEveryPageTurn'));
    equal(mergeText($('#target afterEveryPageTurn')), "if(story.currentPageIs('thirdPage')){story.afterEveryPageTurnCheck=true;}");
    ok($('#target afterEveryParagraphShown'));
    equal(mergeText($('#target afterEveryParagraphShown')), "if(story.currentPageIs('thirdPage')){story.afterEveryParagraphCheck=true;}");
});

test('Objects', function () {
    ok($('#target #firstObject'));
    ok($('#target #secondObject'));
    ok($('#target #firstObject action#Examine'));
    ok($('#target #firstObject action#Get'));
    ok($('#target #firstObject action#Drop'));
    equal(mergeText($('#target #firstObject action#Examine')), 'Justasimpleobject');
    ok($('#target #firstObject action#Get when'));
    equal($('#target #firstObject action#Get when').length, 1);
    equal(mergeText($('#target #firstObject action#Get when')), "!story.isInInventory('firstObject')");
    equal($('#target #firstObject').attr('inventoryName'), 'First object');
});

test('Characters', function () {
    ok('#target #firstCharacter');
    equal(mergeText($('#target #firstCharacter action#Talk')), 'BlaBla');
});

test('Paragraphs (and comments)', function () {
    ok($('#target #firstParagraph'));
    ok($('#target #secondParagraph'));
    ok($('#target #thirdParagraph'));
    equal(mergeText($('#target #firstParagraph')), 'Someparagraph');
    equal(mergeText($('#target #secondParagraph')), 'Secondparagraph');
    equal(mergeText($('#target #thirdParagraph')), 'Thirdparagraph');
});

test('Links', function () {
    ok($('#target #firstPage turn'));
    equal($('#target #firstPage turn').attr('to'), 'secondPage');
    equal(mergeText($('#target #firstPage turn')), 'secondpage');
    ok($('#target #secondPage turn[to="thirdPage"]'));
    equal(mergeText($('#target #secondPage turn[to="thirdPage"]')), 'thirdpage');
    ok($('#target #secondPage show[paragraph="firstParagraph"]'));
    equal(mergeText($('#target #secondPage show[paragraph="firstParagraph"]')), 'firstparagraph');
    ok($('#target #thirdPage interact[with="firstObject"]'));
    equal(mergeText($('#target #thirdPage interact[with="firstObject"]')), 'firstobject');
    ok($('#target #thirdPage interact[with="secondObject"]'));
    equal(mergeText($('#target #thirdPage interact[with="secondObject"]')), 'secondobject');
});