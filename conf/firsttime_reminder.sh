# This file is sourced at the end of a first-time dotfiles install.

cat <<EOF
Remember!
* Sync your private dotifles
* Sign into all your apps and sync everything those can sync
* $ scp -r old_machine:~/* new_machine:~/
* be careful with ~/Library/Preferences/com.apple.*
  $ cp -r ~/Library/Preferences ~/Library/Preferences-Backup
  $ cp -ir ~/Desktoper/Prefs/* ~/Library/Preferences/
EOF

cat <<EOF
Check the following:
  * Finder ⇒ Preferences ⇒ Advanced ⇒ Show all Filename extensions
  * Finder ⇒ Preferences ⇒ Sidebar ⇒ Configure your Favorites
  * System Preferences ⇒ Printers & Scanners ⇒ Add your Printer
  * System Preferences ⇒ Trackpad
    ⇒ Point & Click ⇒ Disable "Look up & data detectors"
    ⇒ Scroll & Zoom ⇒ Disable "Natural Scrolling", "Smart Zoom"
    ⇒ More Gestures ⇒ Disable "Scroll between pages", "Swipe between full-screen applications"
  * System Preferences ⇒ Lock Screen
    ⇒ set "Start Screen Saver when inactive", "Turn display off *", to "Never"
    ⇒ set "Require password after screen saver begins..." to "after 5 seconds"
    ⇒ disable "show password hints"
  * System Preferences ⇒ Screen Saver ⇒ Disable All
  * System Preferences ⇒ Wallpaper ⇒ Set Custom Color to "#191919"
  * System Preferences ⇒ Displays ⇒ Set resolution to "More Space"
  * System Preferences ⇒ Desktop & Dock
    ⇒ Adjust dock size and magnification (both low)
    ⇒ Position on Screen to "right"
    ⇒ Automatically hide and show the Dock to "disabled"
    ⇒ Animate opening applications to "disabled"
    ⇒ Show suggested and recent apps in Dock to "disabled"
    ⇒ Disable all thigns related to Stage Manager
    ⇒ Disable Widgets
    ⇒ Default web browser to "Firefox"
    ⇒ Prefer tabs when opening documents to "Never"
    ⇒ Ask to keep changes when closing documents to "enabled"
    ⇒ Close windows when quitting an application to "disabled"
  * System Preferences ⇒ Sound ⇒ Alert Sound to "Funky"
  * System Preferences ⇒ Keyboard
    ⇒ Spelling and prediction ⇒ Disable Inline Predictive Text
    ⇒ Modifier Keys ⇒ "Caps Lock key" to "Option"
EOF