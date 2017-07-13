
# Git shortcuts

alias g='git'

# OSX-specific Git shortcuts
if [[ is_osx ]]; then
  alias gdk='git ksdiff'
  alias gdkc='gdk --cached'
  if [[ ! "$SSH_TTY" ]]; then
    alias gd='gdk'
  fi
fi
