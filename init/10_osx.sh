# OSX-only stuff. Abort if not OSX.
[[ "$OSTYPE" =~ ^darwin ]] || return 1

if [[ "$(type -P brew)" ]]; then
  e_header "Updating Homebrew"
  brew update

  # Install Homebrew recipes.
  recipes=(
    git tree sl lesspipe id3tool nmap git-extras htop-osx man2html
    atk   emacs   glm   jpeg    libvpx    objective-caml  python    subversion
    faac    gmp   lame    libyaml   oniguruma python3   swig
    autossh   ffmpeg    gnupg   libass    little-cms  opencore-amr  readline
    bash-completion fribidi   gource   mongodb   pango   redis   wget
    bazaar    gdbm    graphviz  libidl    mosh    pcre    rtmpdump  x264
    boost   gdk-pixbuf  gtk+    libmpc    mpfr    pcre++    ruby    xvid
    cairo   gettext   hub   libogg    mysql   pidof   sdl   xz   theora
    ccache    git   imagemagick libtiff   neon    pixman    sdl_image yasm
    cmake   glew    imagesnap libvo-aacenc  nmap    pkg-config  sphinx
    dos2unix  glib    jasper    libvorbis node    pypy    sqlite
  )

  list="$(to_install "${recipes[*]}" "$(brew list)")"
  if [[ "$list" ]]; then
    e_header "Installing Homebrew recipes: $list"
    brew install $list
  fi
fi
