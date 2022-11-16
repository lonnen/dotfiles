#!/usr/bin/env zsh

# add homebrew-managed completions
if type brew &>/dev/null
then
  FPATH="$(brew --prefix)/share/zsh/site-functions:${FPATH}"

  autoload -Uz compinit
  compinit
fi

# save histroy
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