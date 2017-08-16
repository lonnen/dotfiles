# only built 4 MacOS Sierra
is_osx 12 || return 1

# power off memory in hibernation
# docs.hardentheworld.org/OS/MacOS_10.12_Sierra/index.html
# + some settings to avoid power naps
sudo pmset -a darkwakes 0
sudo pmset -a standby 0
sudo pmset -a standbydelay 0
sudo pmset -a destroyfvkeyonstandby 1 hibernatemode 25

# disable creation of metadata files
defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool true
defaults write com.apple.desktopservices DSDontWriteUSBStores -bool true

# disable write to icloud
defaults write NSGlobalDomain NSDocumentSaveNewDocumentsToCloud -bool false
