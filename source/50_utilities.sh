# Always use color output for `ls`
alias ls="command ls -G"

# Recursively delete `.DS_Store` files
alias dsstore="find . -name '*.DS_Store' -type f -ls -delete"

# easier git
alias g='git'

# IP addresses
alias wanip="dig +short myip.opendns.com @resolver1.opendns.com"
alias whois="whois -h whois-servers.net"

# JSON Parser
alias json='python -m json.tool'

# yokes
alias please='sudo'
#alias yolo='git commit -am "yolo" && git push -f origin master'

# hub
eval "$(hub alias -s)"
