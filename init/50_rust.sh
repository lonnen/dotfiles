e_header "Initializing Rust from rustup"
if ! (( $+commands[cargo] )); then
  e_header "Installing Rust"
  true | curl https://sh.rustup.rs -sSf | sh -s -- -y
fi