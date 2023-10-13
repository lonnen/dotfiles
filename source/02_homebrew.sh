# hardentheworld :: homebrew
export HOMEBREW_NO_ANALYTICS=1
export HOMEBREW_NO_AUTO_UPDATE=1
export HOMEBREW_NO_GITHUB_API=1
export HOMEBREW_NO_INSECURE_REDIRECT=1

# Homebrew Brewfile
export HOMEBREW_BREWFILE=~/.brewfile

# Let homebrew export what it needs to function well
# this implicity messes with the PATH
# location of brew varies by hardware
# see: https://docs.brew.sh/FAQ#why-is-the-default-installation-prefix-opthomebrew-on-apple-silicon
if [[ "$(uname -m)" == "arm64" ]]; then
  # Apple Silicon
  eval "$(/opt/homebrew/brew shellenv)"
else
  # Intel
  eval "$(/usr/local/bin/brew shellenv)"
fi