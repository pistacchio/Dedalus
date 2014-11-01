![Dedalus logo](http://pistacchio.github.io/Dedalus/static/logo.png)

Dedalus is an authoring system for generating *Choose Your Own Adventure* (CYOA) narrative. It is similar to other creation tools like [Twine](http://www.gimcrackd.com/etc/src/), [Undum](http://undum.com/) or [Varytale](http://varytale.com/books/).

Games created with Dedalus can run in the browser, so they are very easy to deliver to potential players.

A sample game can be played [here](http://pistacchio.github.com/Dedalus/cloak/cloak.html). It is an implementation of [Cloak of Darkess](http://www.firthworks.com/roger/cloak/), a very simple story meant just to showcase how different authoring systems implement the same game. Mind that the original Cloak of Darkess is thought for *Interactive Fiction* (IF), while Dedalus generates CYOAs, a different, but related, kind of interactive narrative.
You can read the source code of Cloak of Darkess in the example directory.

You may want to read about the [technical details](#technicalDetails) or just keep reading the tutorial and start creating amazing adventures!

**Note:** The tutorial illustrates how to write Dedalus stories in the most "canonical" way, but there an alternative syntax for writig Dedalus narrative called [Dedlee](#dedlee). It doesn't make use of HTML-like syntax, and you might prefer it. However, you should really follow the tutorial closely, it is short, easy and fun, and *then* have a look at Dedlee and decide what system you prefer.

## Table of contents

*  [Getting started](#gettingStarted)
    *  [Theaming Dedalus](#theamingDeadalus)
*  [Setting Up](#settingUp)
    *  [30 Seconds setup](thirtySecondsSetup)
    *  [Setup for the not faint of heart](#realSetup)
*  [Writing your story](#writingYourStory)
    *  [First things first](#firstThingsFirst)
    *  [Enters some Javascript](#entersSomeJavascript)
    *  [Linking to other pages](#linkingToOtherPages)
    *  [Paragraphs](#paragraphs)
    *  [Template engine](#templateEngine)
    *  [Objects](#objects)
        *  [Characters](#characters)
        *  [Combination actions (use with...)](#combinationActions)
    *  [Inventory](#inventory)
    *  [Optional actions](#optionalActions)
    *  [Before and after actions](#beforeAndAfterActions)
    *  [Disabling links](#disablingLinks)
    *  [Counters](#counters)
    *  [Managing large projects](#managingLargeProjects)
    *  [Further customization](#furtherCustomization)
    *  [Utility functions recap and good luck](#utilityFunctionsRecapAndGoodLuck)
*  [Dedlee](#dedlee)
    * [Syntax](#dedleeSyntax)
    * [Setup](#dedleeSetup)
*  [Technical details](#technicalDetails)
*  [Tools](#tools)
*  [Contacts](#contacts)

<a name="gettingStarted"></a>

## Getting started

Setting up a web page that runs Dedalus is very easy, but the simplest way is just to grab the skeleton story found in `src/html` and start customizing it to create your game. If you do so, you can just skip the Setting Up section and rely on the functioning default that's been prepared for you.

Dedalus doesn't try to hide away from you HTML, CSS and Javascript, the technologies behind it, so, if you have any experience in creating web pages, you are ready to customize the appearance of the game you are creating to suit the mood of the story, and basic Javascipt skill can lead you to author stories with more complex logic; the unleashable possibilities are limitless.

<a name="themingDedalus"></a>

### Theming Dedalus

Dedalus comes with ten themes, you can see them in the [theme showcase](http://pistacchio.github.com/Dedalus/themeshowcase/story.html). It cannot be stressed enough that they are in *no way* to be intended as "the ten themes of Dedalus", but quite the opposite. They want to show you want can be accomplished with a bit of CSS tweaking and inspire **you** to come up with something very unique for your own unique stories, dressing your novels with a fresh and surprising robe that helps setting the mood and fits the theme.

Mind that these themes (like Dedalus) require a recent version of a modern browser to work. In other words: no IE8, go for Chrome (Safari, or Firefox)!

![Theme showcase](http://pistacchio.github.io/Dedalus/static/showcase.jpg)


<a name="settingUp"></a>

## Setting Up

<a name="thirtySecondsSetup"></a>

### 30 Seconds setup

1. Download the starter pack of [Dedalus](http://pistacchio.github.com/Dedalus/downloads/Dedalus.zip) and unzip it
1. Write your extraordinary story in the `<div id="story">` tag of `story.html` (or `<div id="dedleeSource">` in `story-dedlee.html` if you use Dedlee)
1. Upload everything to your site or zip it back and distribute it
1. Receive compliments
1. Celebrate with a glass of mango juice!

If you want, you can now skip the next section and jump to [Writing your story](#writingYourStory)

<a name="realSetup"></a>

### Setup for the not faint of heart

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

The DedalusWeb constructor needs the following options to be set, each of which is a jQuery element (for instance, `$('#story')` refers to the div `<div id="#story"></div>`).

| Option            | Meaning                                                                                                                                                                                                                                                                |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| domSource         | element containng the story. You don't want the player to read the story source, so you want it to be hidden (for example adding display: none)                                                                                                                        |
| domTarget         | this is the element where the output of the story will be shown. Everytime you present a new piece of the story to the user, it will be displayed here.                                                                                                                |
| titleTarget       | this, unsurprisingly, contains the title of the story                                                                                                                                                                                                                  |
| inventoryTarget   | if your story needs an inventory (like in most IF games), define an element that is always visible to the user. If you don't need it, just pass a hidden div                                                                                                           |
| interactionTarget | as you should have seen the example (The Cloak of Darkness), whenever you click on an active object (also in the inventory), a floating popup is show featuring all the actions that the player can perform with the object. This is a div with position:absolute set. |
| undoTarget        | an element that, when clicked, undoes the last action                                                                                                                                                                                                                  |
| saveTarget        | an element that, when clicked, saves the current story state                                                                                                                                                                                                           |
| restoreTarget     | an element that, when clicked, restores the story to the last saved point                                                                                                                                                                                              |
| restartTarget     | an element that, when clicked, restarts the story from the beginning                                                                                                                                                                                                   |
| undoStageTarget   | this is a hidden div used internally by the system to store undo informations                                                                                                                                                                                          |
| onPrint           | optional, see [Further customization](#furtherCustomization)                                                                                                                                                                                                           |

<a name="writingYourStory"></a>

## Writing your story

You write Dedalus stories withing a hidden `div` with custom tags and optionally some Javascript. You should start from the empty story found in `html/story` to make sure that all the needed tags are in place, even when empty and unused.

<a name="firstThingsFirst"></a>

### First things first

To start off, you want you story to have a title, an introduction and a first page to print.

A note before proceding: unlike other similar tools, Dedalus tries to be very story oriented, as opposed to world oriented. You are not going to generate the simulation of a virtual world with various locations to explore, but you're writing pages and paragraphs. Of course, you can map every page to a room (like in classic IFs and like shown in the sample game and, for simplicity, in this tutorial), but this is only a possibility.

``` xml
<div id="story">
    <title>Captain Matsushima and the rainbow spitting Fungi</title>
    <page id="intro">
        As the vessel approaches the third moon of Bellerophon, suddenly the lights in the control room go down. Something is not right here, and you, as captain Jonah Matsushima, are about to start an amazing journey to find out what it is!
    </page>
    <page id="controlRoom" class="first">
        A room full of monitors, beeping machines and other archetypal sci-fi things.
    </page>
</div>
```

Here we are calling our story *"Captain Matsushima and the rainbow spitting Fungi"*. A page called `"intro"` is a special block of text that is only shown to the player once, as the first thing she or he reads. Then, the current page is displayed. Adding the class `"first"` to a page makes sure that it is shown right after the introduction.

<a name="entersSomeJavascript"></a>

### Enters some Javascript

Before everything, you might want to set up some custom variables and functions and whatsoever using Javascript, and that's what the `initscript` tag is used for. You want to attach all your custom code to the global `story` object. Its content is executed like regular Javascript code before everything else once the story starts. Let's revise our code to include some initialization.

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

<a name="linkingToOtherPages"></a>

### Linking to other pages

Being stuck in the control room is surely boring and uninteresting. Add a way for Matsushima to reach another room.

``` xml
<page id="controlRoom" class="first">
    <p>A room full of monitors, beeping machines and other archetipal sci-fi things.</p>
    <p>A candid automatic <turn to="weaponRoom">door</turn> leads to where the fun really is.</p>
</page>

<page id="weaponRoom">
    Blasters, laser guns, sonic screwdrivers... Everything you ever wanted (but a lightsaber) is here for you.
</page>
```

We just made "door" a link, and clicking it clears the screen of its current content and shows the "Blaster, laser guns..." text.

Notice that you can use any regular HTML withing pages, paragraphs, actions and so on.

<a name="paragraphs"></a>

### Paragraphs

It's time to add some action.

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

<a name="templateEngine"></a>

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

<a name="objects"></a>

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

<a name="characters"></a>

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

<a name="combinationActions"></a>

#### Combination actions (use with...)

Some actions require to specify an argument, think of "talk about", "use with" and the like. They are called *combination actions* in Dedalus and rely on defining `<with>` tags. When you click on a combination action, the interaction menu populates with all the possible candidates for the action to be executed upon. This the list of all objects available in the inventory and on the current text (without the object triggering the action, of course!).

Captain Mastushima finally found the "Key of the  Neutronmancer", a legendary artifact of an ancient civilization. He can try *using* it on various doors and objects.

```xml
<obj id="neutronmancerKey" inventoryName="Key of the Neutronmancer">
    <action id="Examine">
        Seems like a normal 21st century schizoid key.
    </action>
    <action id="Use with">
        <with id="morrisonDoor">
            You hear a distant voice chanting: "This is the end, my only friend, the end...". But nothing happens.
        </with>
        <with id="blueDoor">
            The door unlocks silently.
        </with>

        You try, and try again, but without any appreciable result.
    </action>
</obj>

<page id="doorRoom">
    You are in a room poorly described. You can see three doors: a <interact with="morrisonDoor">Morrison Door</interact>,
    a <interact with="blueDoor">blue door</interact> and a <interact with="redDoor">red door</interact>
</page>
```

Selecting the "Use with" action makes "Morrison Door", "blue door", "red door" and any item eventually in the inventory a possible candidate as object for the "Use with" action. Clicking on "Morrison door" prints "You hear a distant voice...", selecting the blue door yields "The door unlocks silently" and clicking on any other object prints the default text "You try, and try again...".

<a name="inventory"></a>

### Inventory

Ok, you licked the blaster. How about taking it now?

``` xml
<obj id="vintageBlaster" inventoryName="Vintage blaster">
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

Where the hell `putInInventory` comes from? You didn't define it! Turns out that there are some utility functions already defined for you in `story`. We'll see them all later. Inventory-wise, you have:

* `story.putInInventory(<ID OF THE OBJECT>)`
* `story.removeFromInventory(<ID OF THE OBJECT>)`
* `story.isInInventory(<ID OF THE OBJECT>)`

Their usage is pretty obvious, isn't it? Just take note of the attribute `inventoryName`: it is optional, you must specify it only for those object that can eventually be stored in the inventory and represents the name they're presented with.

<a name="optionalActions"></a>

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

<a name="beforeAndAfterActions"></a>

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

<a name="disablingLinks"></a>

### Disabling links

Captain Mastsushima's ship has an additional artificial intelligence system just to manage weapons. It consists of a human brain in suspended animation that is in charge of taking the decisions Anna cannot take with her synthetic mind. Matsushima knows that he shouldn't enter the brain's room for it is very, very delicate and nothing there must be touched. But, you know, he's there searching for the *rainbow blaster*, a weapon that he knows is on board but nobody could remember where exactly.

``` xml
<page id="brainRoom">
    <p>
        A bright lighted room, almost empty. The white walls and candid floor are immaculate.
        The silence is deafening, you can almost hear the veins
        of the <interact with="brain">brain</interact> palpitate.
    </p>

    <p>
        The brain lies on a short white metal column. A couple of thin red tubes leave
        from the cerebellum and disappear in a little hole on the back side of the base.
        A yellow post-it is attached to the pedestal.
        It reads: <em>"Captain, please, do not EVER touch this again!"</em>.
    </p>

    <object id="brain">
        <action id="Touch">
            Something aweful and irreparable happens.
        </action>
    </object>
</page>
```

No need to explain what is going on here, right? Well, what if, for example, the brain explodes? What if you want the "Touch" event to only happen once? Leaving things like they are now, the reader is able to repatedly click on "Touch", but we obviously want to allow this only once. We already know how to disable the action (`<when>!story.brainTouched</when>`) but what if we wanted to prevent `brain` to be clicked at all? Sure, we can make the exploding action happen in another page, a different description of the room with the brain not available and a gory representation of the once-white walls all covered with splatters of grey matter.

But Dedalus provides option of disabling and enabling a links at will. Just add ad to refer to it and use `story.disable(LINK_ID)` and `story.enable(LINK_ID)`.

``` xml
<page id="brainRoom">
    <p>
        A bright lighted room, almost empty. The white walls and candid floor are immaculate.
        The silence is deafening, you can almost hear the veins
        of the <interact with="brain" id="brainInteraction">brain</interact> palpitate.
    </p>

    <p>
        The brain lies on a short white metal column. A couple of thin red tubes leave
        from the cerebellum and disappear in a little hole on the back side of the base.
        A yellow post-it is attached to the pedestal.
        It reads: <em>"Captain, please, do not EVER touch this again!"</em>.
    </p>

    <object id="brain">
        <action id="Touch">
            Something aweful and irreparable happens.
            {{ story.disable('brainInteraction'); }}
        </action>
    </object>
</page>
```

After the paragraph is printed, `brain` ceases to be a link and becomes a normal text until you *enable* it back. You can also start with a disabled link and activate it as a result of an action, just add `class="disabled"` to the link.

``` xml
<page id="brainRoom">
    <p>This is just a <turn to="somePage" id="disabledLink" class="disabled">normal word</turn></p>

    <p><show paragraph="activatingParagraph">Activate it</show></p>

    <paragraph id="activatingParagraph">
        {{ story.enable('disabledLink'); }}
    </paragraph>
</page>
```

This mechanism works for `turn`, `interact` and `show` links.

<a name="counters"></a>

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

<a name="managingLargeProjects"></a>

### Managing large projects

Sooner or later, your stories are going to be very large and `<initscript>` can become pretty crowded with variables and custom functions. It is essential here not to forget that, in the end, we are really just writing Javascript and everything we use day by day to keep or scripting organized can be applied. For example, what if you end up having dozens of different weapons that Matsushima can use? It might make sense to group them in a module like this:

``` xml
<initscript>
    story.weapons          = {};
    story.weapons.laserGun = {
        power:   10,
        bullets: 20,
        shoot:   function () {
            return "Zoooop! Zaaaaap";
        };
    };
    story.weapons.rocketLauncher = { /* ... */ };
</initscript>
```

Also, if you are really going for something massive, it might make sense to split the code in multiple files:

``` xml
<!-- content of weapon.js -->
function makeWeapons () {
    story.weapons                = {};
    story.weapons.laserGun       = { /* laser gun code */ };
    story.weapons.rocketLauncher = { /* rocket launcher code */ }
    [..]
}

<head>
    <script src="weapons.js"></script>
    [..]
</head>

[..]

<initscript>
    makeWeapons();
    makeCharacters();
    makeShipEvents();
    makeBeetlegeuseDesperationMazeEvents();
    [..]
</initscript>
```

<a name="furtherCustomization"></a>

### Further customization

**<span style="color:#780000">Warning: Advanced topic</span>**

As already stressed multiple times, having control on the HTML structure and CSS of your story allows you to tailor how the novel looks like and you can strenghten the communicative power of your text dressing it with an appropriate robe.

Another point of customization (maybe for more advanced users) is the abilty to change how the text appears. If you've tried the sample story Cloak of Darkness or already made some experimentation with Dedalus by yourself, you may have noticed how a "page turn" clears the current page and fills it with the new content. In case of a paragraph, it just gets appends to the current text being shown.

You might want to change this default behavior to make it prettier or more appropriate for your story.

The options dictonary that is passed to DedalusWeb to initialize it contains a `onPrint` parameter. It is optional, but can be overwritten.

`onPrint` must be a function that returns true or false and accepts two arguments: `content` and `turn`.

* `content`: The text about to be printed (a new page, a paragraph, the result of clicking on an action...)
* `turn`: A boolean value telling if `content` is about to added to the displayed text (*false*) or if this is a new page taking the place of what's being shown (*true*)
* `return`: A boolean value telling Dedalus if, after your custom `onPrint` function, it should execute the printing like it would do (*true*) or if your function completely overwrites the default (*false*)

Two example functions are provided that can serve as a model if you want to come up with your own display function.

* `src/html/plugins/fade.js`: Makes new text appear with a nice fade-in effect
* `src/html/plugins/no-turn.js`: Whatever the value of `turn`, it never hides the content of the page but keeps adding to it

To use them, just include the script in the page

``` html
<head>
    <script src="fade.js"></script>
    [..]
```

and set the `onPrint` option

``` javascript
    $(function () {
        new DedalusWeb({
            onPrint : onPrintFade,
            [..]

```

In a similar way, you may want to customize the inventory. Just hook the `onInventoryUpdate` function to the initialization of DedalusWeb:

``` javascript
    $(function () {
        new DedalusWeb({
            onInventoryUpdate : function (items) { /* */ },
            [..]

```

`onInventoryUpdate` is passed the list of *jQuery* links about to be added to the inventory container. The default behavior is to just pass it back, but you might want to customize the output, for example sorting the items in a certain order, replacing the text with images or everything. Note that the items have already attached the proper `onClick` event, so you should limit yourself to extend them without replacing them, unless you want some special action to be triggered when clicked.

Here is an example function that makes the "Vintage blaster" item to appear with color purple instead of the default one (yeah, this can be achived with just CSS, but you know, examples :-) !)

``` javascript
    $(function () {
        new DedalusWeb({
            onInventoryUpdate : function (items) {
                var i, item,
                    newItems = [];
                for (i = 0; i < items.length; i += 1) {
                    item = items[i];
                    if (item.text() === 'Vintage Blaster') {
                        item.css('color', '#800080');
                    }
                    newItems.push(item);
                }
                return newItems;
            },
            [..]

```


<a name="utilityFunctionsRecapAndGoodLuck"></a>

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
* `story.enable()`
* `story.disable()`
* `story.endGame()`

The only one we didn't encounter in our tutorial is `story.currentPageIs()`, but its usage is as useful as banal: `story.currentPageIs(<ID_OF_A_PAGE>)` and returns true or false based on the page currently being visualized.

This is it. Dedalus is a powerful tool to express your creativity and with it open integration with HTML, CSS and Javascript, the possibilities to customize and extend it to suit the needs of your sories are endless.

If you feel like something is missing (or find a bug!), please contribute to the project. It is released as Free and Open Source Software, so, really, as you use it it yours :)

<a name="dedlee"></a>

## Dedlee

If you're not fency of writing HTML or you think it would interfear with the stream of your creativity, you can adopt a different, more light-weight syntax to write Dedalus narrative. It is called *Dedlee*.

Under the hood, everything we said so far stands true. ULtimately Dedalus will turn your source code written in Dadlee in the HTML-like syntax seen so far.

That being said, I encourage you to use the main syntax described in the tutorial. When possible, relying in tested and proved technologies is always better, and HTML has been around for the last 20 or so years, a bit more than Dedlee, so it puts in your hands much more flexibility and tools to write and check it.

<a name="dedleeSetup"></a>

### Setup

To use Dedlee you need to add an additional tag to your document to host your code and make the system aware of this.

``` xml
<script>
    $(function () {
        new DedalusWeb({
            dedleeSource      : $('#dedleeSource'), <!-- NOTE! -->
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
You need to add a new configuration option, `dedleeSource`. This is where your code resides and hence this should an invisible tag just like `domSource`. Leave the element defined in `domSource` empty because it will be automatically filled with the ouput of parsing Dadlee. You can then write your story within `dedleeSource` like normal text. For example, this is how the beginning of "Captain Matsushima..." would look like in Dedlee within the page.

``` xml
<div id="dedleeSource" style="display:none">
    Captain Matsushima and the rainbow spitting Fungi

    p.intro
        As the vessel approaches the third moon of Bellerophon, suddenly the lights in the control room go down. Something is not right here, and you, as captain Jonah Matsushima, are about to start an amazing journey to find out what it is!

    p.controlRoom (first)
        A room full of monitors, beeping machines and other archetypal sci-fi things.
</div>
```

<a name="dedleeSyntax"></a>

### Syntax

We are not going to rewalk the tutorial. Dedlee doesn't add any new concept and a seasoned Dedalus author like you surely won't have any problem grasping it all.

Before presenting a side by side comparison of how to write the same things both in straight Dedalus and in Dedlee, let's focus on the single important feature of Dedlee you must never ignore:

**In Dedlee indentation is relevant and it defines blocks**

Read it aloud ten times, now! Since we decided to leave the world of XML syntaxes, we got rid of `</closing> </tags>`, so we need a way to tell a page or a paragraph or an action when its content is over. Dedlee relies on meaningful *indentation*. This means that when you define a block (for example a page) everything after it that is more indented is considered to belog to it. Example:

```
    p.firstPage
        <div>Inside page</div>

    <div>Outside page</div>
```

This allowes us to declare visually what belongs to what. Since "Outside page" is at the *same level* of the page (`p.PAGE_ID` is Dedlee syntax to define a new page, as we'll see in a short while) it does not belong it it, while "Inside page", having a deeper indentation, does.

The following table, also useful as a brief cheatsheet for Dedalus, compares the two syntaxes and should be all you need to know to write Dedlee.

<table>
    <tr>
        <th>Dedalus</th>
        <th>Dedlee</th>
    </tr>
    <tr>
        <td>&lt;title&gt;My Story&lt;/tilte&gt;</td>
        <td>The *very first* line of Dedlee source is treated like the title of the story</td>
    </tr>
    <tr>
        <td>
            &lt;initscript&gt;<br>
            &nbsp;&nbsp;&nbsp;&nbsp;story.newVar = 1;<br>
            &lt;/initscript&gt;
        </td>
        <td style="vertical-align: top">
            initscript<br>
            &nbsp;&nbsp;&nbsp;&nbsp;story.newVar = 1;
        </td>
    </tr>
    <tr>
        <td>
            Before/After actions<br><br>
            &lt;beforeEverything&gt;<br>
            &nbsp;&nbsp;&nbsp;&nbsp;doSomething();<br>
            &lt;/beforeEverything&gt;<br>
            [..]
        </td>
        <td style="vertical-align: top">
            beforeEverything<br>
            &nbsp;&nbsp;&nbsp;&nbsp;doSomething();<br>
        </td>
    </tr>
    <tr>
        <td>
            &lt;page id="intro"&gt;<br>
            &nbsp;&nbsp;&nbsp;&nbsp;Page description<br>
            &lt;/page&gt;<br><br>
            &lt;page id="firstPage" class="first"&gt;<br>
            &nbsp;&nbsp;&nbsp;&nbsp;Page description 2<br>
            &lt;/page&gt;
        </td>
        <td style="vertical-align: top">
            p.intro<br>
            &nbsp;&nbsp;&nbsp;&nbsp;Page description<br><br>
            p.intro.first<br>
            &nbsp;&nbsp;&nbsp;&nbsp;Page description 2
        </td>
    </tr>
    <tr>
        <td>
            &lt;object id="firstObject" inventoryName="First Object" class="objectClass"&gt;<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;when&gt;story.isExaminable()&lt;when&gt;<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;action id="Examine"&gt;<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is the first object<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;/action&gt;<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;action id="Take"&gt;<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Taken<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ story.putInInventory('firstObject'); }}<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;/action&gt;<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;action id="Combine with..."&gt;<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;with id="otherObject"&gt;<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Perfectly combined!<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/with&gt;<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default text<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;/action&gt;<br>
            &lt;/object&gt;
        </td>
        <td style="vertical-align: top">
            o.firstObject.objectClass "First Object"<br>
            &nbsp;&nbsp;&nbsp;&nbsp;when story.isExaminable()<br>
            &nbsp;&nbsp;&nbsp;&nbsp;"Examine"<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is the first object<br>
            &nbsp;&nbsp;&nbsp;&nbsp;"Take"<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Taken<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ story.putInInventory('firstObject'); }}<br>
            &nbsp;&nbsp;&nbsp;&nbsp;"Combine with..."<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;with.otherObject<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Perfectly combined!<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default text
        </td>
    </tr>
    <tr>
        <td>
            &lt;character id="firstCharacter" class="characterClass"&gt;<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;action id="Examine"&gt;<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is the first character<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;/action&gt;<br>
            &lt;/character&gt;
        </td>
        <td style="vertical-align: top">
            c.firstCharacter.characterClass<br>
            &nbsp;&nbsp;&nbsp;&nbsp;"Examine"<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is the first character<br>
        </td>
    </tr>
    <tr>
        <td>
            &lt;paragraph id="firstParagraph" class="paragraphClass"&gt;<br>
            &nbsp;&nbsp;&nbsp;&nbsp;First paragraph<br>
            &lt;/paragraph&gt;
        </td>
        <td style="vertical-align: top">
            pg.firstParagraph.paragraphClass<br>
            &nbsp;&nbsp;&nbsp;&nbsp;First paragraph
        </td>
    </tr>
    <tr>
        <td>
            &lt;page id="secondPage"&gt;<br>
            &nbsp;&nbsp;&nbsp;&nbsp;Link to the &lt;turn to="firstPage" id="linkId" class="linkClass"&gt;first page&lt;/turn&gt;<br>
            &lt;/page&gt;
        </td>
        <td style="vertical-align: top">
            p.secondPage<br>
            &nbsp;&nbsp;&nbsp;&nbsp;Link to the [[firstPage.linkId.]]first page[[]]<br>
        </td>
    </tr>
    <tr>
        <td>
            &lt;page id="thirdPage"&gt;<br>
            &nbsp;&nbsp;&nbsp;&nbsp;Show the &lt;show paragraph="secondParagraph"&gt;second paragraph&lt;/show&gt;<br><br>
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;paragraph id="secondParagraph"&gt;<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Second paragraph<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;/paragraph&gt;<br>
            &lt;/page&gt;
        </td>
        <td style="vertical-align: top">
            p.thirdPage<br>
            &nbsp;&nbsp;&nbsp;&nbsp;Show the ((secondParagraph))second paragraph(())<br><br>
            &nbsp;&nbsp;&nbsp;&nbsp;pg.secondParagraph <br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Second paragraph<br>
        </td>
    </tr>
    <tr>
        <td>
            &lt;page id="fourthPage"&gt;<br>
            &nbsp;&nbsp;&nbsp;&nbsp;Interact with the &lt;interact with="firstObject"&gt;first object&lt;/interact&gt;<br>
            &lt;/page&gt;
        </td>
        <td style="vertical-align: top">
            p.fourthPage<br>
            &nbsp;&nbsp;&nbsp;&nbsp;Interact with the {[firstObject]}first object{[]}<br>
        </td>
    </tr>
    <tr>
        <td>
            &lt;!-- Comment --&gt;
        </td>
        <td style="vertical-align: top">
            # Comment
        </td>
    </tr>
</table>

For a complete example, compare the implementation of Clock of Darkess in Dedalus standard format (`/example/cloak.html`) with the source in Dedlee format (`/example/dedlee/cloak.dedlee`)

<a name="technicalDetails"></a>

## Technical details

Dedalus is written in Javascript. It currently consists of two classes: `Dedalus` and `DedalusWeb`. Dedalus contains the core functionalities, while DedalusWeb is an implementation of Dedalus that makes the story run in the browser. The core engine and its implementation have been detached so that, in the future, one might work on a different system that runs, for example, in iOS or Android, or in a command line shell.

In these scenarios, Dedalus would still provide the core engine, but it's up to the concrete implementation to manage user interaction, get the player's input and respond with an output that fits the medium. For example, DedalusWeb relies quite obviously on mouse clicks, but running Dedalus in a command shell should require a different handling of inputs.

Dedalus depends on [jQuery](http://jquery.com/) and [doT.js](http://olado.github.io/doT/index.html), a simple but powerful template engine. DedalusWeb doesn't add any additional dependence.

<a name="tools"></a>

## Tools

If your main editor is [Sublime Text 2](http://www.sublimetext.com/), you want to copy the content of the `sublime` directory in your Sublime Packages folder. This will give you access to a new language, *Dedalus*, that comes with handy snippets and syntax highlight for Dedlee!

![Dedlee syntax highlight](http://pistacchio.github.io/Dedalus/static/dedlee-highlight.png)

<a name="contacts"></a>

## Contacts

Feel free to contact me at *pistacchio* at *gmail* dot *com*

Gustavo Di Pietro
