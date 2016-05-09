# Lonesome Empty Room

![Empty Room on Wikimedia][MainImage]

There's not much in this room. If you're bored you can
[step back into the hallway](Hallway.md) or keep going to the
[next room](Room2.md).

Or you can stay a bit and learn about how to use images in DHTML
Adventure.  A room does not **need** to have pictures, but it can have
one, or more than one. The first image is **always** put in the upper
left box. All other images will stay where you have them in the
text. For example, this room is rather bare. Here's a sofa for it:

![Antique Sofa on Wikimedia][FancySofa]

To add that image, I wrote two things. First, where I wanted the image
to go, I wrote:

```
   ![Antique Sofa on Wikimedia][FancySofa]
```

All parts are needed; The basic format is
`![Credit text][ImageID]`. The credit text is to acknowledge where you
found the image. If it is your own image, you can put your name there,
or just "My own work". ImageID is going to be important for the second
part, which you can put at the bottom of the room file. It looks like
this (all on one line):

```
   [FancySofa]: https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Antikes_Sofa_Diwan_1880_furniert.jpg/320px-Antikes_Sofa_Diwan_1880_furniert.jpg "https://commons.wikimedia.org/wiki/File:Antikes_Sofa_Diwan_1880_furniert.jpg"
```

At first that might look like a horrible jumble of text, but the basic
format of the second part is pretty simple. It is:

`[ImageID]: imageLocationInGame "whereYouFoundTheImage"`

So our image is set up in two places with four parts. The parts are:

1. `ImageID` can be most anything you want, but you need a different
   one for each image, and the ID used at the bottom of the page needs
   to match the ID used in the first line the placed the image on the
   page.
1. `imageLocationInGame` - this is where the game should look to find
   the image. In the example above, I am pulling the image directly
   from the internet (`http://blah.blah.org/...`). That's ok,
   but it might mean that the image gets "broken" if blah.blah.org
   stops hosting it. So it is often a good idea to have a copy of the
   image "locally". This means you have saved it in the same place as
   your Room files. For example, in the case of the empty room, I made
   a folder called "image" in my game directory, and then saved the
   picture as "EmptyRoom.jpg". The image location for the game is then
   just `image/EmptyRoom.jpg`.
1. `whereYouFoundTheImage` - this is not required, but it is a very,
   very good thing to include. Use it when you the image you're using
   was made by someone else. Providing the path to the image shows
   proper credit for it.
1. `Credit text` - Not required, but very good to add for other
   people's images. The credit text lets your player know the **name**
   of the person or organization that created the image, and
   optionally the title of the image. For example,
   `[Angry Orc by Sally Smith]` or `[Sunset on Calisto by NASA]`

Please also bear in mind that the majority of images on the internet
are **not** "free" - they're generally covered by copyright. In fact,
if a website does not say one way or the other, you need to assume
that the image is copyrighted and the creator does not want you to
download a copy. However, that does not mean that there aren't many
freely usable images out there. Google makes it easy to find images
where the owner has licensed them as "CreativeCommons", allowing them
to be copied freely:

* [Google image search for freely usable puppy images][PuppySearch] -
  The search setting here is "Labeled for reuse", which means the
  person who put the image on the web has specifically noted that the
  image may be used by other people.
* [Google search for castles on WikiMedia][CastleSearch] - Wikimedia
  is where Wikipedia keeps its images. All images on wikipedia are
  licensed for open usage.

You can use those links to help set up searches, and then just change
"puppy" or "castle" to the kind of picture you want to search for.

Again, when you use an image from the internet, be sure to make note
of the original page you found it on, and the creator's name, if you
can find it.

[MainImage]: image/EmptyRoom.jpg "https://commons.wikimedia.org/wiki/File:Rank_10_Biltmore_Tower_Q1611_Living_Room.jpg"
[FancySofa]: https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Antikes_Sofa_Diwan_1880_furniert.jpg/320px-Antikes_Sofa_Diwan_1880_furniert.jpg "https://commons.wikimedia.org/wiki/File:Antikes_Sofa_Diwan_1880_furniert.jpg"

[PuppySearch]: https://www.google.com/search?tbs=sur:fc&tbm=isch&q=puppy&emsg=NCSR&noj=1
[CastleSearch]: https://www.google.com/search?tbs=sur:fc&tbm=isch&q=castle+site:wikimedia.org&emsg=NCSR&noj=1
