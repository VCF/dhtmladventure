# Adding images to your story

You don't *need* images for a good adventure - in fact, some of the
best stories lack any images at all. However, a good picture can help
set the mood for your story, or could be part of a puzzle for the
reader to solve. The system has a special window in the upper left
corner to display the 'main' image. The first image found in any room will
**always** be put there.

[//]: # (This is the 'main' image that will go in the upper left window)
![Empty Room on Wikimedia][MainImage]

Every other image will be placed where it is found in the text. For
example, let's get a nice sofa for this empty room:

[//]: # (This image will 'stay' in this part of the page)
![Antique Sofa on Wikimedia][FancySofa]

Each image is defined by four parts, put in two places. First, where
you want the image to go you add:

`![Credit text][ImageID]`

Second, at the end of the document, you define where the image is
stored, and where you found it:

`[ImageID]: imageLocationInGame "whereYouFoundTheImage"`

The parts are:

1. `ImageID` can be most anything you want, but you need a different
   one for each image, and the ID used at the bottom of the page needs
   to match the ID used in the first line the placed the image on the
   page.
1. `imageLocationInGame` - this is where the game should look to find
   the image. You could link directly to an image on the internet
   (`http://blah.blah.org/...`). That's ok, but it might mean that the
   image gets "broken" if blah.blah.org stops hosting it. So it is
   often a good idea to have a copy of the image "locally". This means
   you have saved it in the same place as your Room files. For
   example, in the case of the empty room, I made a folder called
   "image" in my game directory, and then saved the picture as
   "EmptyRoom.jpg". The image location for the game is then just
   `image/EmptyRoom.jpg`.
1. `whereYouFoundTheImage` - this is not required, but it is a very,
   very good thing to include. Use it when you the image you're using
   was made by someone else. Providing the path to the image shows
   proper credit for it.
1. `Credit text` - Not required, but very good to add for other
   people's images. The credit text lets your player know the **name**
   of the person or organization that created the image, and
   optionally the title of the image. For example,
   `[Angry Orc by Sally Smith]` or `[Sunset on Calisto by NASA]`

You can read more on [making your own pictures](CreatingImages.md) or
[finding images on the web](FindingImages.md). Or you can
[go back to the hallway](AboutMarkdown.md).


[//]: # (The main image is stored locally in the 'image' folder)
[MainImage]: image/EmptyRoom.jpg "https://commons.wikimedia.org/wiki/File:Rank_10_Biltmore_Tower_Q1611_Living_Room.jpg"

[//]: # (I am linking directly to the sofa image on wikimedia.org)
[FancySofa]: https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Antikes_Sofa_Diwan_1880_furniert.jpg/320px-Antikes_Sofa_Diwan_1880_furniert.jpg "https://commons.wikimedia.org/wiki/File:Antikes_Sofa_Diwan_1880_furniert.jpg"

