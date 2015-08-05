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
      source "$file"
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

# added by travis gem
[ -f /Users/lonnen/.travis/travis.sh ] && source /Users/lonnen/.travis/travis.sh

### Added by the Heroku Toolbelt
export PATH="/usr/local/heroku/bin:$PATH"
