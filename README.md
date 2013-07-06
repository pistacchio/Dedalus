# Dedalus

Dedalus is an authoring system for generating *Choose Your Own Adventure* (CYOA) narrative. It is similar to other creation tools like [Twine](http://www.gimcrackd.com/etc/src/), [Undum](http://undum.com/) or [Varytale](http://varytale.com/books/).

Games created with Dedalus can run in the browser, so they are very easy to deliver to potential player.

A sample game can be played [here](TODO). It is an implementation of [Cloak of Darkess](http://www.firthworks.com/roger/cloak/), a very simple story meant just to showcase how different authoring systems implement the same game. Mind that the original Cloak of Darkess is thought for *Interactive Fiction* (IF), while Dedalus generates CYOAs, a different, but related, kind of interactive narrative.
You can read the source code of Cloak of Darkess in the example directory.

You may want to read about the [tecnical details] [Technical details] or just keep reading the tutorial and start creating amazing adventures!

## Getting started

Setting up a web page that runs Dedalus is very easy, but the simplest way is just to grab the skeleton story found in `src/html` and start customizing it to create your game. If you do so, you can just skip the Setting Up section and rely on the functioning default that's been prepared for you.

Dedalus doesn't try to hide away from you HTML, CSS and Javascript, the technologies behind it, so, if you have any experience in creating web pages, you are ready to customize the appearance of the game you are creating to suit the mood of the story, and basic Javascipt skill can lead you to author stories with more complex logic; the unleashable possibilities are limitless.

## Setting Up

Your HTML5 page must include, in order:

* doT.js template engine
* jQuery
* dedalus.js
* dedalus-web.js

The central part of the page defines the story (more on this later).

You then need a bunch of HTML elements to host the output of the story and handle user interaction.

Once you've written them you can run the game by instantiating a new DedalusWeb instance, for example:

``` xml
<script>
    $(function () {
        new DedalusWeb({
            domSource         : $('#story'),
            domTarget         : $('#host'),
            titleTarget       : $('#title'),
            inventoryTarget   : $('#inventoryHost'),
            interactionTarget : $('#interactionHost'),
            undoTarget        : $('#undoHost'),
            undoStageTarget   : $('#undoStageHost'),
            saveTarget        : $('#saveHost'),
            restoreTarget     : $('#restoreHost'),
            resetTarget       : $('#reseteHost'),
        });
    });
</script>
```

The DedalusWeb constructor needs the following options to be set, each of which is a jQuery element (for instance, `$('#story')¡ refers to the div `<div id="#story"></div>`).

| domSource | element containng the story. You don't want the player to read the story source, so you want it to be hidden (for example adding display: none) |
| domTarget | this is the element where the output of the story will be shown. Everytime you present a new piece of the story to the user, it will be displayed here. |
| titleTarget | this, unsurprisingly, contains the title of the story |
| inventoryTarget | if your story needs an inventory (like in most IF games), define an element that is always visible to the user. If you don't need it, just pass a hidden div |
| interactionTarget | as you should have seen the example (The Cloak of Darkness), whenever you click on an active object (also in the inventory), a floating popup is show featuring all the actions that the player can perform with the object. This is a div with position:absolute set. |
| undoTarget | an element that, when clicked, undoes the last action |
| saveTarget | an element that, when clicked, saves the current story state |
| restoreTarget | an element that, when clicked, restores the story to the last saved point |
| restartTarget | an element that, when clicked, restarts the story from the beginning |
| undoStageTarget | this is a hidden div used internally by the system to store undo informations |

## Writing your story

You write Dedalus stories withing a hidden `div` with custom tags and optionally some Javascript. You should start from the empty story found in `html/story` to make sure that all the needed tags are in place, even when empty and unused.

### First things first

To start off, you want you story to have a title, an introduction and a first page to print.

A note before proceding: unlike other similar tools, Dedalus tries to be very story oriented, as opposed to world oriented. You are not going to generate the simulation of a virtual world with various locations to explore, but you're writing pages and paragraphs. Of course, you can map every page to a room (like in classic IFs and like shown in the sample game and, for simplicity, in this tutorial), but this is only a possibility.

``` xml
<div id="story">
    <title>Captain Matsushima and the rainbow spitting Fungi</title>
    <page id="intro">
        As the vessel approaches the third moon of Bellerophon, suddenly the lights in the control room go down. Something is not right here, and you, as captain Jonah Matsushima, are about to start an amazing journey to find out what it is!
    </page>
    <page id="controlRoom", class="first">
        A room full of monitors, beeping machines and other archetypal sci-fi things.
    </page>
</div>
```

Here we are calling our story *"Captain Matsushima and the rainbow spitting Fungi"*. A page called `"intro"` is a special block of text that is only shown to the player once, as the first thing she or he reads. Then, the current page is displayed. Adding the class `"first"` to a page makes sure that it is shown right after the introduction.

### Enters some Javascript

Before everything, you might want to set up some custom variables and functions and whatsoever using Javascript, and that's what the ´initscript` tag is used for. You want to attach all your custom code to the global `story` object. Its content is executed like regular Javascript code before everything else once the story starts. Let's revise our code to include some initialization.

``` xml
<div id="story">
    <initscript>
        story.numberOfKills = 0;
        story.isMatsushimaASickSerialKiller = function () {
            return story.numberOfKills > 10;
        };
        story.triedToTakeTheScrewDriver = false;
    </initscript>
    <title>Captain Matsushima and the rainbow spitting Fungi</title>
    <page id="intro">
    [..]
</div>
```

### Linking to other pages

Being stuck in the control room is surely boring and uninteresting. Add a way for Matsushima to reach another room.

``` xml
<page id="controlRoom", class="first">
    <p>A room full of monitors, beeping machines and other archetipal sci-fi things.</p>
    <p>A candid automatic <turn to="weaponRoom">door</turn> leads to where the fun really is.</p>
</page>

<page id="weaponRoom">
    Blasters, laser guns, sonic screwdrivers... Everything you ever wanted (but a lightsaber) is here for you.
</page>
```

We just made "door" a link, and clicking it clears the screen of its current content and shows the "Blaster, laser guns..." text.

Notice that you can use any regular HTML withing pages, paragraphs, actions and so on.

### Paragraphs

It's time to add some action.

``` xml
``` xml
<page id="weaponRoom">
    Blasters, <show paragraph="notGoodIdea">laser guns</show>, <show paragraph="doctorScrewDriver">sonic screwdrivers</show>... Everything you ever want (but a lightsaber) is here for you.

    <paragraph id="doctorScrewDriver">
        You'd better leave it off, or the Doctor might get angry.
    </paragraph>
</page>

<paragraph id="notGoodIdea">
    Hmm... It doesn't seem like a very good idea to do... Well, you whatever you wanted to do!
</paragraph>
```

`laser guns` and `sonic screwdrivers` are now links. They show the text of the paragraphs they're linked to, but, unlike `<turn>`, `<show>` doesn't change the page. Mind that we defined `<paragraph id="doctorScrewDriver">` within the `weaponRoom` (because it is a chuck of text only relevant to this context), but a more general paragraph (`notGoodIdea`) is outside the scope of the page, and hence callable by any other page in the story. This is a neat way to organize your code.

### Template engine

The true power of Dedalus relies on the possibilities offered by the template engine it adopted, [doT.js](http://olado.github.io/doT/index.html). Everywhere we present a text (within pages, paragraphs, or objects actions) we can make this text dynamic. Let's add an example:

``` xml
<paragraph id="doctorScrewDriver">
    {{? story.isMatsushitaASickSerialKiller() }}
        You already killed too many people! Remember? {{= story.numberOfKills;}} of those poor souls!
    {??}
        You'd better leave it off, or the Doctor might get angry.
        {{story.triedToTakeTheScrewDriver = true;}}
    {{?}}
</paragraph>
```

The curly syntax is that of our template engine. The question mark and double question marks define a *if-then-else* block. Here we are using our custom fuction to check if the captain is a maniac (for example he killed 12 aliens), and if so print *"You already killed too many people! Remember? 12 of those poor souls!"*, else print *"You'd better leave it off, or the Doctor might get angry."*.

An *if* block is one of the most useful construc you can use, but you'd better teach yourself the whole sytax of doT.js. It is really simple and can help you write amazing stories. Here we are also using `{{= }}` that prints a variable and simply executing Javascript code with `{{}}` (we change the value of the variable `story.triedToTakeTheScrewDriver`).

### Objects

A curious person like you cannot stand a story where he can't touch things! Objects come to the rescue. We can "almost" interact with the scredriver and the laser gun, but let's make the interaction with the blaster even more interesting.

``` xml
<page id="weaponRoom">
    <show paragraph="blasters">Blasters</show>, <show paragraph="notGoodIdea">laser guns</show>, <show paragraph="doctorScrewDriver">sonic screwdrivers</show>... Everything you ever want (but a lightsaber) is here for you.

    <paragraph id="doctorScrewDriver">
        You'd better leave it off, or the Doctor might get angry.
    </paragraph>

    <paragraph id="blasters">
        A red, plastic blaster (seems to be a toy) and real, massive one, a true <interact with="vintageBlaster">vintage blaster</interact> from 2242 made of titanium steel.
    </paragraph>
</page>

<obj id="vintageBlaster">
    <action id="Examine">
        It seems in good conditions, considering the age.
    </action>
    <action id="Lick">
        There's nothing better than the taste of titanium steel!
    </action>
</obj>
```

At this point, it should be pretty clear what is going on here. `Blasters` is now clickable, it prints a new paragraph making the player aware of the presence of two blasters. One of them is clickable, and clicking on it shows a popup with two possible actions that the player can perform on it, *Examine* and *Lick*. Clicking on any of them prints another text in response to the action. You can use doT.js templating in the actions, as well, to provide dynamic content, set variables and so on. Just like paragraphs, if an object is only available in a page, you can define it within the page itself.

#### Characters

Everything we said and we'll say on objects stands true for `characters`. Defining a character is just a semantic nuance for defining an object that we like to think of as animate:

``` xml
<character id="lieutenantKrakroz">
    <action id="Ask about the venusian wine">
        <p>Krakroz looks at you with its typical dull expression:</p>
        <p>What.. hic.. youuu meeeean...? Hic!</p>
    </action>
</character>
```

### Inventory

Ok, you licked the blaster. How about taking it now?

``` xml
<obj id="vintageBlaster">
    <action id="Examine">
        It seems in good condition, considering the age.
    </action>
    <action id="Lick">
        There's nothing better than the taste of titanium steel!
    </action>
    <action id="Get">
        Wow, it's heavier than you thought!
        {{ story.putInInventory('vintageBlaster'); }}
    </action>
</obj>
```

Where the hell `putInInventory` comes from? You didn't define it! Turns out that there are some utility functions already defined for you in `story`. We'll see them all later. Inventory-wise, you can:

story.putInInventory(<ID OF THE OBJECT>);
story.removeFromInventory(<ID OF THE OBJECT>);
story.isInInventory(<ID OF THE OBJECT>);

Their usage is pretty obvious, isn't it?

#### Optional actions

Sometimes you can perform some actions on an object, and sometimes you can't. For example, if you've already taken the blaster, why would you want to "Get" it again? And how could you drop it before taking it?

``` xml
<obj id="vintageBlaster">
    <action id="Examine">
        It seems in good condition, considering the age.
    </action>
    <action id="Lick">
        There's nothing better than the taste of titanium steel!
    </action>
    <action id="Get">
        <when>!story.isInInventory('vintageBlaster')</when>
        Wow, it's heavier than you thought!
        {{ story.putInInventory('vintageBlaster'); }}
    </action>
    <action id="Drop">
        <when>story.isInInventory('vintageBlaster')</when>
        You feel lighter now... But also harmless!
        {{ story.removeFromInventory('vintageBlaster'); }}
    </action>
</obj>
```

`<when>` must be any valid Javascript code than, when executed, returns true or false and the action is only available if the return value us true.

### Before and after actions

If you looked at the source code of the example story, you might have noticed *before*something and *after*something tags lying around. After/Before actions are a flexible tool to provide dynamism outside the bounding scopes of pages and paragraphs.

Matsushima's sworn enemy Lord Evilord has hit our hero's spaceship with a photon rocket and, to add color to our story, every once in a while the on-board computer repeats worrisome alerts. We could implement this by calling an action (within `{{}}`) everytime the hero enters any room of the intergalactic vessel (read: everytime the player "turns a page"), but this would become boring very soon. Let's write our more cleaver solution by extending initscript and adding some code in `<afterEveryPageTurn>`:

``` xml
<initscript>
    story.numberOfKills = 0;
    story.isMatsushitaASickSerialKiller = function () {
        return story.numberOfKills > 10;
    };
    story.triedToTakeTheScrewDriver = false;

    // new stuff here!
    story.spaceshipHit = false;
    story.maybeAlert = function () {
        if (story.spaceshipHit) {
            var randomNumber = Math.floor((Math.random()*5));
            if (randomNumber === 0) {
                story.showParagraph('hitAlert');
            }
        }
    };
</initscript>

<afterEveryPageTurn>
    story.maybeAlert();
</afterEveryPageTurn>

<paragraph id="hitAlert">
    <p>The on-board computer, Anna, announces with her silk smooth robotic voice:<p>
    <p class="computerAlter">
        To all the living beings on the ship. I'm afraid you are about to die. All of you. The air reserve has been compromised. Pity those who rely on hoxigen to live. I mean, everyone here. But me.
    </p>
</paragraph>
```

Least important things first: notice how we defined the message in a `<p>` with the class *"computerAlert"*. This is just to show once more how you can really use all the HTML tricks you are accustomed to, like showing computer messages with a particular font or whatever.

The content of `afterEveryPageTurn` is executed like regular Javascript, you guessed it, after every page has been turned. Here, every time the reader "turns a page" there is a chance out of 5 for the computer to dispatch her alert to the crew. Dedalus also provides:

* `beforeEveryThing`
* `beforeEveryPageTurn`
* `afterEveryThing`
* `afterEveryPageTurn`
* `afterEveryParagraphShown`

that work in the very same fashion. The content of `beforeEveryThing` and `afterEveryThing` is executed whenever an action takes place (a page turns, paragraphs show, object actions are performed...).

Two more things to notice here. We used the function `story.showParagraph` here. It is another predefined utiliy function that lets you print a paragraph from Javascript. Similar to it is `story.TurnPage(<ID_OF_THE_PAGE>`).

Also, note that we could have written the alter function right within afterEveryPageTurn:

``` xml
<afterEveryPageTurn>
    if (story.spaceshipHit) {
        var randomNumber = Math.floor((Math.random()*5));
        if (randomNumber === 0) {
            story.showParagraph('hitAlert');
        }
    }
</afterEveryPageTurn>
```

### Counters

Supposing that Anna the computer is not lying, sooner or later the air will really go away from the ship at some point. If we want to put pressure on the reader, we can implement a real-time event to happen sometime in the future (for example 2 minutes after the detonation of the rocket), but to stay true to the narrative context, a within-story counter would probably make more sense. As an aside, notice that also the alerts in the previous example could have been written with Javascript's `setInterval` and happen with a real-time cadence.

Dedalus provides the following counters:

* `story.getNumTotalActions()`
* `story.getNumActionsPerformedInPage()`
* `story.getNumPagesTurned()`
* `story.getNumParagraphsShown()`
* `story.getNumParagraphsShownInPage()`

When the story starts, they're all set to *0*, but as soon as the reader starts to interact with the story, they're automatically updated. Their meaning should be pretty obvious, only take note that `getNumActionsPerformedInPage()` and `getNumParagraphsShownInPage()` are reset every time a new page is shown and keep track of how many actions the reader performs in the page and how many paragraphs are shown in the page context.

Now, suppose that when the space vessel is hit by the rocket we set a variable

``` xml
<paragraph id="ohMyGoodSpaceshipHit">
    Lord Evilord's rocket finally reaches the ship and hit it with a rumbling roar.
    {{ story.whenSpaceHit = story.getNumTotalActions(); }}
</paragraph>
```

We take note of the current value of the counter `getNumTotalActions()`. Now our hero has only 20 actions before the crew dies suffocated!

``` xml
<afterEveryThing>
    if (story.getNumTotalActions() - story.whenSpaceHit >= 20) {
        story.turnTo('theEnd');
    }
</afterEveryThing>

<page id="theEnd">
    You are eaten by a grue.
    {{ story.endGame(); }}
</page>
```

Omitting the fact that when the air goes away the hero dies eaten by a grue without much more explained (!), we see here how before/after actions and counters are a powerful combination that let us add dynamic behaviour that is not bound to pages and paragraphs but that has a global scope, eventually linked with in-game pace.

`story.endGame()` is yet another utility function that the system provides and without surprice puts a halt to the story.

### Utility functions recap and good luck

Here is a recap of all the functions that you can use in writing your games:

* `story.currentPageIs()`
* `story.removeFromInventory()`
* `story.putInInventory()`
* `story.isInInventory()`
* `story.getNumTotalActions()`
* `story.getNumActionsPerformedInPage()`
* `story.getNumPagesTurned()`
* `story.getNumParagraphsShown()`
* `story.getNumParagraphsShownInPage()`
* `story.turnTo()`
* `story.showParagraph()`
* `story.endGame()`

The only one we didn't encounter in our tutorial is `story.currentPageIs()`, but its usage is as useful as banal: `story.currentPageIs(<ID_OF_A_PAGE>)` and returns true or false based on the page currently being visualized.

This is it. Dedalus is a powerful tool to express your creativity and with it open integration with HTML, CSS and Javascript, the possibilities to customize and extend it to suit the needs of your sories are endless.

If you feel like something is missing (or find a bug!), please contribute to the project. It is released as Free and Open Source Software, so, really, as you use it it yours :)

## Technical details

Dedalus is written in Javascript. It currently consists of two classes: `Dedalus` and `DedalusWeb`. Dedalus contains the core functionalities, while DedalusWeb is an implementation of Dedalus that makes the story run in the browser. The core engine and its implementation have been detached so that, in the future, one might work on a different system that runs, for example, in iOS or Android, or in a command line shell.

In these scenarios, Dedalus would still provide the core engine, but it's up to the concrete implementation to manage user interaction, get the player's input and respond with an output that fits the medium. For example, DedalusWeb relies quite obviously on mouse clicks, but running Dedalus in a command shell should require a different handling of inputs.

Dedalus depends on [jQuery](http://jquery.com/) and [doT.js](http://olado.github.io/doT/index.html), a simple but powerful template engine. DedalusWeb doesn't add any additional dependence.

## Contact

Feel free to contact me at *pistacchio* at *gmail* dot *com*

Gustavo Di Pietro