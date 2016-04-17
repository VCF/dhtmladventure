[git](https://en.wikipedia.org/wiki/Git_%28software%29) is a powerful
"version control system" - software designed to help you store files
in a way that lets you track the history of changes made to those
files, and to allow easy collaboration with other people who edit the
files with you.

git stores files in "repositories", each of which you can think of as
a "project"

## Starting out

1. Create a project on GitHub. The project on github.com is called the
   "remote". In the examples below, we will be using this project,
   'dhtmladventure', as an example.
2. Copy the SSH URL for the project, eg
   `git@github.com:cherrypi/dhtmladventure.git`
3. Find a place on your computer where you would like to work. For
   example, you can make a directory in your home, say `~/GitHubWork`
4. cd to that directory and clone the project you just made:
   `git clone git@github.com:cherrypi/dhtmladventure.git`
5. That will make a new directory, 'dhtmladventure', in your working
   directory. We call this your "local" project. You can now cd to
   that directory to begin work.

If this is your very first time using git, you should also set a few
parameters:

```sh
# Your email address and name - these are used by GitHub to help
# associate your work with your account
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
# Not required, but git will make irritated noises otherwise:
git config --global push.default simple

```

## Creating files and folders

#### git status

Inside the local directory you can create as many files and folders as
you like. Until you tell git about them, they will not be properly
stored within git. But you can check which files are recognized with
`git status`. For example, saving this fill and running that command I
see:

```
shrew 527% git status
On branch master
Your branch is up-to-date with 'origin/master'.

Untracked files:
  (use "git add <file>..." to include in what will be committed)

	TreasureHunt/
	UsingGit.md

nothing added to commit but untracked files present (use "git add" to track)
```

That tells me that this file (UsingGit.md) and the directory
TreasureHunt are seen to be in the project, but are not yet registered
with git.

#### git add

We use `git add` to tell git to register a file. Let's add the
TreasureHunt folder and then check git with status. (In the examples
below, the start of lines like "shrew 549%" is my terminal prompt - it
highlights the commands I am entering, but should not be entered into
your own terminal).

```
shrew 549% git add TreasureHunt/
shrew 550% git status
On branch master
Your branch is up-to-date with 'origin/master'.

Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

	new file:   TreasureHunt/Start.md

Untracked files:
  (use "git add <file>..." to include in what will be committed)

	UsingGit.md
```

git is still not doing anything with UsingGit.md, but it has
registered the "TreasureHunt" folder, and has found a file in it,
"Start.md" (you actually can't add an empty folder in git - only files
can be added, but git will automatically include any folders needed to
include the files).

You can add two ore more files at once, eg "git add ThisFile.txt
ThatPicture.jpg". If you want to add **ALL** new or changed files in
your directory, you can use `git add .`, with a period used instead of
a file name. You should always run `git status` first, to make sure
you remember all the files that are about to be added.

#### git commit

We are not quite done yet, though - we need to "commit" the files to
truly add them to the local git repository. When you commit, you also
provide a short message that summarizes what the files are, or what
changes you've made to them. This is to help other people understand
what you're doing, but also helps you later if you need to go back to
an earlier version of the file.


```
shrew 556% git commit -m "Begining a new adventure file"
[master 0e2b3fc] new .gitignore
 1 file changed, 32 insertions(+)
 create mode 100644 TreasureHunt/Start.md
```

git has now stored your file in the local repository. You can continue
working on the file, but if you ever need to "back up" and go to an
earlier version, you can do so now.

## Working remotely with git

Once you have added and comitted files to your local repository, you
can also store them remotely. This is an excellent way to backup your
files, but it also allows other people to work on your files with you.

#### git push

"push" is the standard way to send your local files to the remote
repository (in this case github.com). You simply call `git push`:


```
shrew 562% git push
Counting objects: 6, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (4/4), done.
Writing objects: 100% (5/5), 1.37 KiB | 0 bytes/s, done.
Total 5 (delta 0), reused 0 (delta 0)
To git@github.com:cherrypi/dhtmladventure.git
   26ced66..0e2b3fc  master -> master
```

Your files (any that you have run add + commit on) are now stored remotely.

In many cases, the push will occur without incident. However, if
someone else has made changes to a file that you have also changed,
you may need to do "conflict resolution". This is a process where you
decide how to alter the file so that both your work can be merged
together properly.
