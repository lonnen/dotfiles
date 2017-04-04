if [ -f ~/.bashrc ]; then
  source ~/.bashrc
fi

export PATH="$HOME/.cargo/bin:$PATH"
export HOMEBREW_NO_ANALYTICS=1

export PATH=/usr/local/Cellar/openssl/1.0.2k/bin:$PATH
