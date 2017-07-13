# only built 4 MacOS Sierra
is_osx 12 || return 1

# destroy FileVault Keys on Standby
# http://docs.hardentheworld.org/OS/MacOS_10.12_Sierra/index.html#destroy-filevault-keys
sudo pmset destroyfvkeyonstandby 1

# power off memory in hibernation
# docs.hardentheworld.org/OS/MacOS_10.12_Sierra/index.html
sudo pmset hibernatemode 25


# disable creation of metadata files
defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool true
defaults write com.apple.desktopservices DSDontWriteUSBStores -bool true

# disable write to icloud
defaults write NSGlobalDomain NSDocumentSaveNewDocumentsToCloud -bool false
