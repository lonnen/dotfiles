# OSX-only stuff. Abort if not OSX.
is_osx || return 1

# Exit if Homebrew is not installed.
[[ ! "$(type -P brew)" ]] && e_error "Brew recipes need Homebrew to install." && return 1

# Install Homebrew recipes.
recipes=(
  ack
  android-platform-tools
  apple-gcc42
  atk
  autoconf
  autoconf213
  automake
  autossh
  awscli
  bash-completion
  bazaar
  bash
  boost
  cairo
  ccache
  cloog
  cmake
  cmatrix
  cowsay
  curl
  dnsmasq
  dos2unix
  doxygen
  emacs
  erlang
  faac
  faad2
  ffmpeg
  findutils
  flac
  fluid-synth
  fontconfig
  freetype
  fribidi
  gawk
  gcc
  gdbm
  gdk-pixbuf
  gettext
  ghc
  git
  git-extras
  glew
  glib
  glm
  gmp
  gnu-tar
  gnupg
  gnutls
  go
  gobject-introspection
  haskell-platform
  htop-osx
  hub
  icu4c
  id3tool
  isl
  jpeg
  lame
  lesspipe
  libffi
  libgcrypt
  libgpg-error
  libid3tag
  libidl
  libmpc
  libmpdclient
  libogg
  libpng
  libsamplerate
  libshout
  libtasn1
  libtiff
  libtool
  libvorbis
  llvm
  makedepend
  man2html
  mercurial
  mpd
  mpfr
  mysql
  nettle
  nginx
  nmap
  node
  openssl
  ossp-uuid
  p11-kit
  pcre
  pixman
  pkg-config
  python
  rabbitmq
  readline
  redis
  s-lang
  sdl
  sdl2
  sdl2_image
  sdl_image
  shellcheck
  sl
  ssh-copy-id
  speex
  sqlite
  taglib
  terminal-notifier
  terraform
  texi2html
  theora
  the_silver_searcher
  tree
  ttyrec
  webp
  weechat
  wget
  wry
  wxmac
  x264
  xvid
  xz
  yajl
  yasm
)


brew_install_recipes

# Misc cleanup!

# This is where brew stores its binary symlinks
local binroot="$(brew --config | awk '/HOMEBREW_PREFIX/ {print $2}')"/bin

# htop
if [[ "$(type -P $binroot/htop)" ]] && [[ "$(stat -L -f "%Su:%Sg" "$binroot/htop")" != "root:wheel" || ! "$(($(stat -L -f "%DMp" "$binroot/htop") & 4))" ]]; then
  e_header "Updating htop permissions"
  sudo chown root:wheel "$binroot/htop"
  sudo chmod u+s "$binroot/htop"
fi

# bash
if [[ "$(type -P $binroot/bash)" && "$(cat /etc/shells | grep -q "$binroot/bash")" ]]; then
  e_header "Adding $binroot/bash to the list of acceptable shells"
  echo "$binroot/bash" | sudo tee -a /etc/shells >/dev/null
fi
if [[ "$(dscl . -read ~ UserShell | awk '{print $2}')" != "$binroot/bash" ]]; then
  e_header "Making $binroot/bash your default shell"
  sudo chsh -s "$binroot/bash" "$USER" >/dev/null 2>&1
  e_arrow "Please exit and restart all your shells."
fi
