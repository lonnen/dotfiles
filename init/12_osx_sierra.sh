# only built 4 MacOS Sierra
is_osx 12 || return 1

# preset some power management stuff
sudo pmset -a darkwakes 0
sudo pmset -a standby 0
sudo pmset -a standbydelay 0

# disable creation of metadata files
defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool true
defaults write com.apple.desktopservices DSDontWriteUSBStores -bool true

# disable write to icloud
defaults write NSGlobalDomain NSDocumentSaveNewDocumentsToCloud -bool false
