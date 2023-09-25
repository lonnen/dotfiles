# OSX-only stuff. Abort if not OSX.
is_osx || return 1

source ../source/02_homebrew.sh

# Homebrew wants sbin
if [ ! -d "/usr/local/sbin" ]; then
  sudo mkdir -p /usr/local/sbin
  sudo chown -R $(whoami) /usr/local/sbin
fi

# Install Homebrew.
if [[ ! "$(type -p brew)" ]]; then
  e_header "Installing Homebrew"
  true | "/bin/zsh -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)""
fi

# Exit if, for some reason, Homebrew is not installed.
[[ ! "$(type -p brew)" ]] && e_error "Homebrew failed to install." && return 1

e_header "Updating Homebrew"
brew doctor
brew update
brew install mas # ensure mac app store CLI is installed before we read the
brew bundle --file=$DOTFILES/conf/Brewfile