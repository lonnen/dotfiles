# My zsh replicaiton of Cowboy's bash prompt
# see https://github.com/cowboy/dotfiles#prompt for a screenshot
#
#
# Example:
# [master:!?][cowboy@CowBook:~/.dotfiles]
# [11:14:45] $
#
# First bracketed section appears iff current director is a git repo
# using the form [branch:flags] where flags are:
#
# ? untracked files
# ! changed files
# + staged files

autoload -Uz vcs_info
autoload -U colors && colors

setopt PROMPT_SUBST

precmd() {
  vcs_info
}

# ANSI CODES - SEPARATE MULTIPLE VALUES WITH ;
#
#  0  reset          4  underline
#  1  bold           7  inverse
#
# FG  BG  COLOR     FG  BG  COLOR
# 30  40  black     34  44  blue
# 31  41  red       35  45  magenta
# 32  42  green     36  46  cyan
# 33  43  yellow    37  47  white

if [[ ! "${__prompt_colors[@]}" ]]; then
  __prompt_colors=(
    "36" # information color cyan foreground
    "37" # bracket color white foreground
    "31" # error color red foreground
    "34" # secondary info color blue foreground
  )

  if [[ "$SSH_TTY" ]]; then
    # connected via ssh
    __prompt_colors[0]="32"
  elif [[ "$USER" == "root" ]]; then
    # logged in as root
    __prompt_colors[0]="35"
  fi
fi

# Inside a prompt function, run this alias to setup local $c0-$c9 color vars.
alias __prompt_get_colors='  __prompt_colors[9]=; local i; for i in ${(@)__prompt_colors}; do local c$i="\[\e[0;${__prompt_colors[$i]}m\]"; done'

# Git status.
function __prompt_git() {
  __prompt_get_colors
  local git_status branch flags
  git_status="$(git status 2>/dev/null)"
  [[ $? != 0 ]] && return 1;
  branch="$(echo "$status" | awk '/# Initial commit/ {print "(init)"}')"
  [[ "$branch" ]] || branch="$(echo "$git_status" | awk '/# On branch/ {print $4}')"
  [[ "$branch" ]] || branch="$(git branch | perl -ne '/^\* \(detached from (.*)\)$/ ? print "($1)" : /^\* (.*)/ && print $1')"
  flags="$(
    echo "$git_status" | awk 'BEGIN {r=""} \
        /^(# )?Changes to be committed:$/        {r=r "+"}\
        /^(# )?Changes not staged for commit:$/  {r=r "!"}\
        /^(# )?Untracked files:$/                {r=r "?"}\
      END {print r}'
  )"
  __prompt_vcs_info=("$branch" "$flags")
}

# hg status.
function __prompt_hg() {
  __prompt_get_colors
  local summary branch bookmark flags
  summary="$(hg summary 2>/dev/null)"
  [[ $? != 0 ]] && return 1;
  branch="$(echo "$summary" | awk '/branch:/ {print $2}')"
  bookmark="$(echo "$summary" | awk '/bookmarks:/ {print $2}')"
  flags="$(
    echo "$summary" | awk 'BEGIN {r="";a=""} \
      /(modified)/     {r= "+"}\
      /(unknown)/      {a= "?"}\
      END {print r a}'
  )"
  __prompt_vcs_info=("$branch" "$bookmark" "$flags")
}

# SVN info.
function __prompt_svn() {
  __prompt_get_colors
  local info last current
  info="$(svn info . 2> /dev/null)"
  [[ ! "$info" ]] && return 1
  last="$(echo "$info" | awk '/Last Changed Rev:/ {print $4}')"
  current="$(echo "$info" | awk '/Revision:/ {print $2}')"
  __prompt_vcs_info=("$last" "$current")
}

# Maintain a per-execution call stack.
__prompt_stack=()
trap '__prompt_stack=("${__prompt_stack[@]}" "$BASH_COMMAND")' DEBUG

function __prompt_command() {
  local i=0 exit_code=$?
  # If the first command in the stack is __prompt_command, no command was run.
  # Set exit_code to 0 and reset the stack.
  [[ "${__prompt_stack[0]}" == "__prompt_command" ]] && exit_code=0
  __prompt_stack=()

  __prompt_get_colors

  __prompt_vcs_info=()
  # git: [branch:flags]
  __prompt_git || \
  # hg:  [branch:bookmark:flags]
  __prompt_hg || \
  # svn: [repo:lastchanged]
  __prompt_svn
  # Iterate over all vcs info parts, outputting an escaped var name that will
  # be interpolated automatically. This ensures that malicious branch names
  # can't execute arbitrary commands. For more info, see this PR:
  # https://github.com/cowboy/dotfiles/pull/68
  if [[ "${#__prompt_vcs_info[@]}" != 0 ]]; then
    PS1="$PS1 $c3"
    for i in "${(@)__prompt_vcs_info[@]}"; do
      if [[ "${__prompt_vcs_info[i]}" ]]; then
        [[ $i != 0 ]] && PS1="$PS1$c1:$c3"
        PS1="$PS1 $__prompt_vcs_info[$i]"
      fi
    done
    PS1="$PS1 $c9"
  fi

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
PS1="$PS1"$'['"%F{cyan}%*%f"$']'
# exit code: 127
PS1="$PS1%F{red}%(?.. %B%?%b)%f \$ "