# This file is sourced at the end of a first-time dotfiles install.
setopt ALIASES
source ~/.bashrc

cat <<EOF
Remember!
* Sync your private dotifles
* Manually load all your app store purchases
* Sign into all your apps and sync everything those can sync
* scp -r old_machine:~/* new_machine:~/
* be careful with ~/Library/Preferences/com.apple.*
** cp -r ~/Library/Preferences ~/Library/Preferences-Backup
** cp -ir ~/Desktoper/Prefs/* ~/Library/Preferences/
EOF

# docs.hardentheworld.org/OS/MacOS_10.12_Sierra/index.html
cat <<EOF
Check the following:
  * Finder ⇒ Preferences ⇒ Advanced
  * Finder ⇒ Preferences ⇒ Sidebar
  * System Preferences ⇒ General -> Handoff
  * System Preferences ⇒ General -> Recent Items
  * System Preferences ⇒ Security & Privacy ⇒ Advanced -> Require Admin
  * System Preferences ⇒ Security & Privacy ⇒ FileVault
  * System Preferences ⇒ Security & Privacy ⇒ Firewall
  * System Preferences ⇒ Security & Privacy ⇒ General -> Require Pass
  * System Preferences ⇒ Security & Privacy ⇒ Privacy
  * System Preferences ⇒ Security & Privacy ⇒ Privacy ⇒ Diagnostics & Usage
  * System Preferences ⇒ Security & Privacy ⇒ Privacy ⇒ Location Services
  * System Preferences ⇒ Spotlight
  * System Preferences ⇒ Users & Groups ⇒ Guest User
  * System Preferences ⇒ Users & Groups ⇒ Login Options -> Password Hints
EOF
