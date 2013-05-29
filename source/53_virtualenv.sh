if [ "$(type -P virtualenvwrapper.sh)" ]; then
  export WORKON_HOME=$HOME/.virtualenvs
  export PROJECT_HOME=$HOME/Devel
  source virtualenvwrapper.sh
fi
