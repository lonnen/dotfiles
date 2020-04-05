if [ "$(type -P poetry)" ]; then
    poetry completions bash > $(brew --prefix)/etc/bash_completion.d/poetry.bash-completion
fi