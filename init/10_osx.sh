# OSX-only stuff. Abort if not OSX.
[[ "$OSTYPE" =~ ^darwin ]] || return 1

if [[ "$(type -P brew)" ]]; then
  e_header "Updating Homebrew"
  brew update

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
    boost
    cairo
    ccache
    cloog
    cmake
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
    sl
    speex
    sqlite
    taglib
    terraform
    texi2html
    theora
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

  list="$(to_install "${recipes[*]}" "$(brew list)")"
  if [[ "$list" ]]; then
    e_header "Installing Homebrew recipes: $list"
    brew install $list
  fi
fi
