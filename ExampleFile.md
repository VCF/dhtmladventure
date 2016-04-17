# Example Room File

You find yourself in an example "Room File" for DHTML Adventure. This
file is like a single page in a "[Gamebook][WP_Gamebook]". Each room
file describes a place, event or situation where the player may make
one or more choices, or win or lose the adventure. For simplicity, the
"place, event or situation" will just be called a "room" here.

Each room is described as a [Markdown][WP_Markdown] file. Markdown is
a flexible shorthand file format that is reasonably readable to a
human as just "raw" text, but can also be rendered as HTML by a
variety of tools, including GitHub, where this project is hosted (to
see this file on GitHub, visit [this link][GH_Example]. The file
format will be designed to allow "manual" exploration of the adventure
just by following links in the rendered Markdown. However, as the
format matures we will be adding more complex logic that will be
interpreted by a Javascript software framework run in a web browser.

Connections between rooms will be through relative links. For example:

You see before you two levers: Do you wish to
[pull the red lever](./ExampleRedRoom.md) or
[pull the green lever](./ExampleGreenRoom.md)?

In markdown, those links are written as
`[what the player sees](./RoomFileName.md)` - The player would see a
link "what the player sees", and clicking on it would load the room
file named "RoomFileName.md". The name of the files are not important,
except that you need to make sure that the name matches the spelling
(and capitalization) that you use in the links inside your room
files. It will be best to avoid spaces and unusual letters in your
room file names - that is, stick to letters, numbers and underscores.

The "title" of the room file is written at the very top, as a "Level 1
Heading" - it is placed on a single line that starts with a single
number sign (#). It is the heading the player will see when they
arrive in the room, for example:

Empty warehouse

Limestone Cavern

Parachute Failure!

Combat! Orc scouting party!

You win!

The title does not need to match the file name in any way, though it
will likely make your life easier if you name it something memorable
to help you build the game.

The text following the title (what you are reading now) is the
detailed description of the room. For example:

The boat creaks as you step aboard, and the sailors eye you
suspiciously. The parrot shouts 'Hey! Get...

You begin to seriously question your decision to leave the laser rifle
in the landing craft. The creature surges toward you swinging its...

Your manager leans in closer, whispering soothingly 'But *anything* is
possible in SharePoint if only you'd...'

Markdown has, intentionally, a very limited set of formatting
options. If you put text inside `*one set of asterisks*` you get
italics, *like this*. If you put text inside `**two sets of
asterisks**` you get bold, **like this**. 

- - - - -

To Do - the sections below are work that needs to be defined.

### Inventory

Need to come up with a way to specify that items been added, removed
or altered in the players inventory.

### State

Like inventory, but refers to things like player health, happy/angry
disposition of other creatures, time left on bomb, etc.

### Conditional outcomes

Tie in to State and Inventory. For example, allow "Open door" only if
key is in inventory, or different outcomes when "Talk to guard"
depending on how friendly she is to the player.

### Images

I want to allow at least one image for the room, plus a way to store a
credit for the image.

[WP_Gamebook]: https://en.wikipedia.org/wiki/Gamebook
[WP_Markdown]: https://en.wikipedia.org/wiki/Markdown
[GH_Example]: https://github.com/cherrypi/dhtmladventure/blob/master/ExampleFile.md
