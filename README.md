# Starswirl

Starswirl is a game engine for creating *Choose Your Own Adventure* (CYOA) games. It is similar to other creation tools like [Twine](http://www.gimcrackd.com/etc/src/), [Undum](http://undum.com/) or [Varytale](http://varytale.com/books/). It is based upon the [Dedalus](https://github.com/pistacchio/Dedalus) engine

Games created with Starswirl can run in the browser, so they are very easy to deliver to potential players. However Starswirl can also be ran nativly on desktops and mobiles using proejcts like [NW.js](http://nwjs.io/) and [PhoneGap](http://phonegap.com/)

## Technical details

Starswirl is written in Javascript. It currently consists of two classes: `Starswirl` and `StarswirlWeb`. Starswirl contains the core functionalities, while StarswirlWeb is an implementation of Starswirl that makes the story run in the browser. The core engine and its implementation have been detached so that, in the future, one might work on a different system that runs, for example, in iOS or Android, or in a command line shell.

In these scenarios, Starswirl would still provide the core engine, but it's up to the concrete implementation to manage user interaction, get the player's input and respond with an output that fits the medium. For example, StarswirlWeb relies quite obviously on mouse clicks, but running Starswirl in a command shell should require a different handling of inputs.

Starswirl depends on [jQuery](http://jquery.com/) and [doT.js](http://olado.github.io/doT/index.html), a simple but powerful template engine. StarswirlWeb doesn't add any additional dependence.
