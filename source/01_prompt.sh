# My zsh replicaiton of Cowboy's bash prompt
# see https://github.com/cowboy/dotfiles#prompt for a screenshot
#
#
# Example:
# [lonnen@corey:~/.dotfiles][master:!?]
# [11:14:45] $
#
# First bracketed section appears iff current director is a git repo
# using the form [branch:flags] where flags are:
#
# + staged files
# ! changed but unstaged files

autoload -Uz vcs_info
autoload -U colors && colors

setopt PROMPT_SUBST

precmd() {
  vcs_info
}

# newline to get started
PS1=$'\n'

# misc: [cmd#:hist#]
# PS1="$PS1$c1[$c0#\#$c1:$c0!\!$c1]$c9"

# path: [user@host:path]
PS1="$PS1"$'['"%F{cyan}%n%f@%F{cyan}%m%f:%F{cyan}%~%f"$']'

# source control:
# git: [branch:flags]
# hg:  [branch:bookmark:flags]
# svn: [repo:lastchanged]
# flags:
# + Changes to be committed
# ! Changes not staged for commit
zstyle ':vcs_info:*' enable git svn hg
zstyle ':vcs_info:*' check-for-changes true
zstyle ':vcs_info:*' check-for-staged-changes true
zstyle ':vcs_info:*' stagedstr '+'
zstyle ':vcs_info:*' unstagedstr '!'
zstyle ':vcs_info:*:*' formats "[%F{cyan}%b%f:%F{cyan}%c%u%f]"
PS1="$PS1"'${vcs_info_msg_0_}'

PS1=$PS1$'\n'
# date: [HH:MM:SS]
PS1="$PS1"$'['"%F{cyan}%D{%H}%f:%F{cyan}%D{%M}%f:%F{cyan}%D{%S}%f"$']'
# exit code: 127
PS1="$PS1%F{red}%(?.. %B%?%b)%f \$ "