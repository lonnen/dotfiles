### PyEnv
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init --path)"

### virtualenvwrapper
if [ "$(type -P virtualenvwrapper.sh)" ]; then
  export WORKON_HOME=$HOME/.virtualenvs
  export PROJECT_HOME=$HOME/Devel
  source virtualenvwrapper.sh
fi
