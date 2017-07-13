# OSX-only stuff. Abort if not OSX.
is_osx || return 1

# Exit if Homebrew is not installed.
[[ ! "$(type -P brew)" ]] && e_error "Brew casks need Homebrew to install." && return 1

# Ensure the cask keg and recipe are installed.
kegs=(
  caskroom/cask
  caskroom/drivers
  caskroom/fonts
)
brew_tap_kegs

# Hack to show the first-run brew-cask password prompt immediately.
brew cask info this-is-somewhat-annoying 2>/dev/null

# Homebrew casks
casks=(
  # Applications
  android-platform-tools
  atom
  cloak
  chromium
  dashlane
  docker
  docker-machine
  docker-compose
  dropbox
  firefox
  google-chrome
  google-earth
  irccloud
  iterm2
  keybase
  little-snitch
  moom
  minecraft
  # pixelmator
  sketch
  skype
  slack
  sonos
  spotify
  steam
  sublime-text
  the-unarchiver
  transmission-remote-gui
  viscosity
  vlc
  vmware-fusion

  # Drivers
  d235j-xbox360-controller-driver

  # Quick Look plugins
  betterzipql
  qlcolorcode
  qlmarkdown
  qlprettypatch
  qlstephen
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
    brew cask install $cask
  done
  brew cask cleanup
fi
