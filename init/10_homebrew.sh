# Install Homebrew
if [[ ! "$(which brew)" ]]; then
  e_header "Installing Homebrew"
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi


# Get the apropriate homebrew settings in the environment
# note: do this after we're sure homebrew has been installed
source $DOTFILES/source/02_homebrew.sh

# Exit if, for some reason, Homebrew is not installed
[[ ! "$(which brew)" ]] && e_error "Homebrew failed to install." && return 1

e_header "Updating Homebrew"
brew doctor
brew update
brew install mas # ensure mac app store CLI is installed before we read the

# install everything from the Brewfile
brew bundle --file=$DOTFILES/conf/Brewfile