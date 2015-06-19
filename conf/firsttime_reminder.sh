# This file is sourced at the end of a first-time dotfiles install.
shopt -s expand_aliases
source ~/.bashrc

cat <<EOF
Remember!
* Sync your private dotifles
* Manually load all your app store purchases
* Sign into all your apps and sync everything those can sink
* scp -r old_machine:~/* new_machine:~/
* be careful with ~/Library/Preferences/com.apple.*
** cp -r ~/Library/Preferences ~/Library/Preferences-Backup
** cp -ir ~/Desktoper/Prefs/* ~/Library/Preferences/
EOF
