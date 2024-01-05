# loads git completion
# taken from https://stackoverflow.com/questions/28028740/git-tab-completion-in-zsh-throwing-errors
# this relies on having ~/.zsh/_git on the fpath, generated by github's CLI tool and copied into place

zstyle ':completion:*:*:git:*' script ~/.git-completion.bash
# `compinit` scans $fpath, so do this before calling it.
fpath=(~/.zsh/functions $fpath)
autoload -Uz compinit && compinit