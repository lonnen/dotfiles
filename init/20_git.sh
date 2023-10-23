# Exit if, for any reason, `gh` is not installed and available
[[ ! "$(which gh)" ]] && e_error "Github CLI failed to install." && return 1

# Auth
if [[ ! "$(gh auth status)" ]]; then
  e_header "Authenticating Github - this may generate a new SSH key"
  gh auth login -p ssh --hostname github.com --web
fi

# tell the user to set their stuff
e_header "Remember: set your git username!"
echo "    $ git config --global user.name \"$(who am i | cut -d ' ' -f 1)\""
echo "    $ git config --global user.email \"$(who am i | cut -d ' ' -f 1)@email.com\""