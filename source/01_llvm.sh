# Fix for LLVM that ships with Xcode 5.1
if [[ $CLT_VERSION =~ ^5\.1\.0\.0\.1\.1396320587 ]]; then
  export ARCHFLAGS=-Wno-error=unused-command-line-argument-hard-error-in-future
fi
