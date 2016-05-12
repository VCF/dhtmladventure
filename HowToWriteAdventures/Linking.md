# Making Links From Rooms

![Broad Chain on Wikipedia][MainImage]

The core concept of making your own adventure is that you have choices
of what to do, and those choices take you to different places in the
story. The most basic way to do that is through links.

Links are very easy to make in Markdown: Using brackets and
parentheses, you define
`[the text you want to show](plusTheFileYouWantToGoTo.md)`. For
example, maybe you want to
[go back to the hallway](AboutMarkdown.md).

For files within the adventure, you just need the file name, not any
folders or directories that contain them. For external links, you
should include the 'http' part at the front, for example
[Wikipedia's article on Markdown](https://en.wikipedia.org/wiki/Markdown).
External pages will look different, and be automatically be configured
to open a new window, so you don't disrupt an adventure in progress.

There is a second way to add links. It is a bit more complicated, but
lets you keep your Markdown tidy by sticking long hyperlinks at the
end of the document. It comes in two parts; The first is similar to
the `[]()` method, but instead uses `[shown text][linkBookmark]`.

The "linkBookmark" is then used again at the end of the document as
`[linkBookmark]: http://example.com/whereYouWantedToGo`, which defines
where the link should actually go.

For example:

* [The original Markdown page][MDfireball]
* [Wikipedia article for Gamebook][WP_Gamebook]
* [Go back to Basic Markdown room][BasMD]
* [A red panda][redpanda]

You can now [return to the Markdown overview room](AboutMarkdown.md),
or continue to [Using Images](Images.md).

[MDfireball]: https://daringfireball.net/projects/markdown/syntax
[WP_Gamebook]: https://en.wikipedia.org/wiki/Gamebook
[redpanda]: https://upload.wikimedia.org/wikipedia/commons/f/fe/Ailurus_fulgens_RoterPanda_LesserPanda.jpg
[BasMD]: BasicMarkdown.md
[MainImage]: image/Chain.jpg "https://commons.wikimedia.org/wiki/File:Broad_chain_closeup.jpg"
