e_header "Initializing Rust from rustup"

if [[ ! "$(type -p cargo)" ]]; then
  e_header "Installing Rust"
  true | curl https://sh.rustup.rs -sSf | sh -s -- -y
fi
