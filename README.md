# Dotfiles

My OS X dotfiles.

## Why is this a git repo?

Lonnen forked this repo from [Ben "cowboy" Alman](https://github.com/cowboy/dotfiles) and customized it. It's probably safe to assume any first person writing was done by Ben.

Reducing the amount of manual work to set up and maintain machines is the goal.  Cowboy said it well:

> I finally decided that I wanted to be able to execute a single command to "bootstrap" a new system to pull down all of my dotfiles and configs, as well as install all the tools I commonly use. In addition, I wanted to be able to re-execute that command at any time to synchronize anything that might have changed. Finally, I wanted to make it easy to re-integrate changes back in, so that other machines could be updated.

> That command is [~/bin/dotfiles][dotfiles]

[dotfiles]: https://github.com/lonnen/dotfiles/blob/master/bin/dotfiles
[bin]: https://github.com/lonnen/dotfiles/tree/master/bin

## What, exactly, does the "dotfiles" command do?

When [dotfiles][dotfiles] is run, it does a few things:

1. Verifies Xcode, Git and Homebrew are installed
2. This repo is cloned into the `~/.dotfiles` directory (or updated if it already exists).
2. Files in `init` are executed (in alphanumeric order).
3. Files in `copy` are copied into `~/`.
4. Files in `link` are linked into `~/`.
5. Files in `private` are linked into `~/`, iff `private` exists.

Note:

* The `backups` folder only gets created when necessary. Any files in `~/` that would have been overwritten by `copy` or `link` get backed up there.
* Files in `bin` are executable shell scripts ([~/.dotfiles/bin][bin] is added into the path).
* Files in `source` or `private-source` get sourced whenever a new shell is opened (in alphanumeric order, source folder first, then private-source).
* Files in `conf` just sit there. If a config file doesn't _need_ to go in `~/`, put it in there.
* Files in `caches` are cached files, only used by some scripts. This folder will only be created if necessary.
* The `private` folder is not tracked, and must be added manually.

## Installation
Notes:

* You need to be an administrator (for `sudo`).
* You need to have installed [XCode Command Line Tools](https://developer.apple.com/downloads/index.action?=command%20line%20tools), which are available as a separate, optional (and _much smaller_) download from XCode.

```sh
bash -c "$(curl -fsSL https://raw.github.com/lonnen/dotfiles/master/bin/dotfiles)" && source ~/.bashrc
```

## The "init" step

Handles installation of homebrew and some packages iff it doesn't already exist. Handles custom linking of some conf files. Look into the init folder for specifics.

## The ~/ "copy" step
Any file in the `copy` subdirectory will be copied into `~/`. Files that need to be overwritten with personal or private info should go in here. Copying them makes it less likely to accidentally commit public dotfiles.

## The ~/ "link" step
Any file in the `link` subdirectory gets symbolically linked with `ln -s` into `~/`. Edit these, and you change the file in the repo. Don't link files containing sensitive data, or you might accidentally commit that data!

## The ~/ "private" step
If the `private` subdirectory exists, any file in it gets symbolically linked with `ln -s` into `~/`. This dir and all files in it will be ignored by git, so put your sensisitive data here. You can sync it between installs manually, or via a third party tool like BT Sync, or Dropbox and encFs.

## Aliases and Functions
To keep things easy, the `~/.profile`, `~/.bashrc` and `~/.bash_profile` files are extremely simple, and should never need to be modified. Instead, add your aliases, functions, settings, etc into one of the files in the `source` subdirectory, or add a new file. They're all automatically sourced when a new shell is opened. If you're using boxen these will backup and replace files boxen creates on installation, but `/source/20_boxen` will keep things working.

## Scripts
In addition to the aforementioned [dotfiles][dotfiles] script, there are a few other [bash scripts][bin].

* [dotfiles][dotfiles] - (re)initialize dotfiles. It might ask for your password (for `sudo`).
* [src](https://github.com/lonnen/dotfiles/blob/master/link/.bashrc#L6-15) - (re)source all files in `source` directory
* Look through the [bin][bin] subdirectory for a few more.

## Inspiration
<https://github.com/cowboy/dotfiles>
