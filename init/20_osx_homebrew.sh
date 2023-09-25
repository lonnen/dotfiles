# OSX-only stuff. Abort if not OSX.
is_osx || return 1

# hardentheworld :: homebrew
# also set these in /source/ in case homebrew is run directly
export HOMEBREW_NO_ANALYTICS=1
export HOMEBREW_NO_AUTO_UPDATE=1
export HOMEBREW_NO_GITHUB_API=1
export HOMEBREW_NO_INSECURE_REDIRECT=1

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