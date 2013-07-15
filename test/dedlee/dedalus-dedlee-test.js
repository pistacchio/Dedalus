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
    ok($('#target initscript').length === 1);
    eval($('#target initscript').text());
    equal(story.customVariable, 42);
    equal(mergeText($('#target initscript')),  "story.customVariable=42;story.beforeEveryPageTurnCheck=false;story.afterEveryPageTurnCheck=false;story.beforeEveryParagraphCheck=false;story.afterEveryParagraphCheck=falsestory.beforeEverytingCounter=0;story.afterEverytingCounter=0;");
});

test('Before / After tags', function () {
    ok($('#target beforeEveryThing').length === 1);
    equal(mergeText($('#target beforeEveryThing')), "story.beforeEverytingCounter+=7;");
    ok($('#target beforeEveryPageTurn').length === 1);
    equal(mergeText($('#target beforeEveryPageTurn')), "if(story.currentPageIs('secondPage')){story.beforeEveryPageTurnCheck=true;}");
    ok($('#target beforeEveryParagraphShown').length === 1);
    equal(mergeText($('#target beforeEveryParagraphShown')), "if(story.currentPageIs('thirdPage')){story.beforeEveryParagraphCheck=true;}");
    ok($('#target afterEveryThing').length === 1);
    equal(mergeText($('#target afterEveryThing')), "story.afterEverytingCounter-=7;");
    ok($('#target afterEveryPageTurn').length === 1);
    equal(mergeText($('#target afterEveryPageTurn')), "if(story.currentPageIs('thirdPage')){story.afterEveryPageTurnCheck=true;}");
    ok($('#target afterEveryParagraphShown').length === 1);
    equal(mergeText($('#target afterEveryParagraphShown')), "if(story.currentPageIs('thirdPage')){story.afterEveryParagraphCheck=true;}");
});

test('Objects', function () {
    ok($('#target #firstObject').length === 1);
    ok($('#target #secondObject').length === 1);
    ok($('#target #firstObject').hasClass('firstObjectClass'));
    ok($('#target #firstObject action#Examine').length === 1);
    ok($('#target #firstObject action#Get').length === 1);
    ok($('#target #firstObject action#Drop').length === 1);
    equal(mergeText($('#target #firstObject action#Examine')), 'Justasimpleobject');
    ok($('#target #firstObject action#Get when').length === 1);
    equal($('#target #firstObject action#Get when').length, 1);
    equal(mergeText($('#target #firstObject action#Get when')), "!story.isInInventory('firstObject')");
    equal($('#target #firstObject').attr('inventoryName'), 'First object');
    equal($('#secondObject action[id= "Use with..."] with').length, 1);
    equal($('#secondObject action[id= "Use with..."] with').length, 1);
});

test('Characters', function () {
    ok($('#target #firstCharacter').length === 1);
    ok($('#target #firstCharacter').hasClass('firstCharacterClass'));
    equal(mergeText($('#target #firstCharacter action#Talk')), 'BlaBla');
});

test('Paragraphs (and comments)', function () {
    ok($('#target #firstParagraph').length === 1);
    ok($('#target #firstParagraph').hasClass('firstParagraphClass'));
    ok($('#target #secondParagraph').length === 1);
    ok($('#target #thirdParagraph').length === 1);
    equal(mergeText($('#target #firstParagraph')), 'Someparagraph');
    equal(mergeText($('#target #secondParagraph')), 'Secondparagraph');
    equal(mergeText($('#target #thirdParagraph')), 'Thirdparagraph');
});

test('Links', function () {
    ok($('#target #firstPage turn').length === 1);
    equal($('#target #firstPage turn').attr('to'), 'secondPage');
    equal(mergeText($('#target #firstPage turn')), 'secondpage');
    ok($('#target #secondPage turn[to="thirdPage"]').length === 1);
    equal(mergeText($('#target #secondPage turn[to="thirdPage"]')), 'thirdpage');
    ok($('#target #secondPage show[paragraph="firstParagraph"]').length === 1);
    equal(mergeText($('#target #secondPage show[paragraph="firstParagraph"]')), 'firstparagraph');
    ok($('#target #thirdPage interact[with="firstObject"]').length === 1);
    equal(mergeText($('#target #thirdPage interact[with="firstObject"]')), 'firstobject');
    ok($('#target #thirdPage interact[with="secondObject"]').length === 1);
    equal(mergeText($('#target #thirdPage interact[with="secondObject"]')), 'secondobject');
    equal($('#target #thirdPage interact[with="secondObject"]').attr('id'), 'withId');
    ok($('#target #thirdPage interact[with="secondObject"]').hasClass('withClass'));
});
