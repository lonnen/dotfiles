# OSX-only stuff. Abort if not OSX.
is_osx || return 1

# Exit if Homebrew is not installed.
[[ ! "$(type -P brew)" ]] && e_error "Brew casks need Homebrew to install." && return 1

# Ensure the cask keg and recipe are installed.
kegs=(
  homebrew/cask-drivers
  homebrew/cask-fonts
  homebrew/cask-versions
)
brew_tap_kegs

# Hack to show the first-run brew-cask password prompt immediately.
brew cask info this-is-somewhat-annoying 2>/dev/null

# Homebrew casks
casks=(
  # Applications
  cloak
  chromium
  #datagrip
  docker
  firefox
  google-chrome
  iterm2
  keybase
  little-snitch
  minecraft
  moom
  osxfuse
  sketch
  skype
  slack
  sonos
  spotify
  steam
  sublime-text
  suspicious-package
  the-unarchiver
  transmission-remote-gui
  viscosity
  visual-studio-code
  vlc
  vmware-fusion

  # Quick Look plugins
  betterzipql
  qlcolorcode
  qlmarkdown
  qlprettypatch
  quicklook-csv
  quicklook-json
  quicknfo
  suspicious-package
  webpquicklook
)

# Install Homebrew casks.
casks=($(setdiff "${casks[*]}" "$(brew cask list 2>/dev/null)"))
if (( ${#casks[@]} > 0 )); then
  e_header "Installing Homebrew casks: ${casks[*]}"
  for cask in "${casks[@]}"; do
    brew install --cask $cask
  done
  brew cleanup
fi
