#!/usr/bin/env zsh

# Where the magic happens.
export DOTFILES=~/.dotfiles

# Add binaries into the path
PATH=$DOTFILES/bin:$PATH
# Add brew sbin to the path
PATH=$PATH:/usr/local/sbin
export PATH

# Source all files in "source"
function src() {
  local file
  if [[ "$1" ]]; then
    if [ -f "$DOTFILES/private-source/$1.sh"]; then
      source "$DOTFILES/private-source/$1.sh"
    else
      source "$DOTFILES/source/$1.sh"
    fi
  else
    for file in $DOTFILES/source/*; do
      if "$IS_ZSH" && [[ $file == *.zsh ]]; then
        source "$file"
      fi
      if [[ $file == *.sh ]]; then
        source "$file"
      fi
    done
    if [ -d "$DOTFILES/private-source" ]; then
      for file in $DOTFILES/private-source/*; do
        source "$file"
      done
    fi
  fi
}

# Run dotfiles script, then source.
function dotfiles() {
  $DOTFILES/bin/dotfiles "$@" && src
}

src

# ZSH-specific content

# add homebrew-managed completions
if type brew &>/dev/null
then
  FPATH="$(brew --prefix)/share/zsh/site-functions:${FPATH}"

  autoload -Uz compinit
  compinit
fi

# .zsh is a linked directory of functions
fpath=(~/.zsh $fpath)

# MacOS is case-insensitive, so lets make globbing
set -o NO_CASE_GLOB

# save history
HISTFILE=${ZDOTDIR:-$HOME}/.zsh_history

# keep all the history
setopt EXTENDED_HISTORY
setopt SHARE_HISTORY
setopt APPEND_HISTORY
setopt INC_APPEND_HISTORY

# do not store duplications
setopt HIST_IGNORE_DUPS
#ignore duplicates when searching
setopt HIST_FIND_NO_DUPS
# removes blank lines from history
setopt HIST_REDUCE_BLANKS

alias history="history 1"
HISTSIZE=99999
SAVEHIST=$HISTSIZE

setopt CORRECT
setopt CORRECT_ALL