# hardentheworld :: homebrew
export HOMEBREW_NO_ANALYTICS=1
export HOMEBREW_NO_AUTO_UPDATE=1
export HOMEBREW_NO_GITHUB_API=1
export HOMEBREW_NO_INSECURE_REDIRECT=1

# Homebrew Brewfile
export HOMEBREW_BREWFILE=~/.brewfile

# Let homebrew export what it needs to function well
# note: this line implicity messes with the PATH
eval "$(brew shellenv)"