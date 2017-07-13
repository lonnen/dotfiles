if [[ ! "$(type -P cargo)" ]]; then
  e_header "Installing Rust"
  true | curl https://sh.rustup.rs -sSf | sh -s -- -y
fi
