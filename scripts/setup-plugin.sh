#!/usr/bin/env bash

# Fancy info
function info {
  echo -e "\e[32mo $1\e[0m"
}

# Fancy error
function error {
  echo -e "\e[31mx $1\e[0m"
}

# Check command installed
function is_install {
  if ! [ -x "$(command -v $1)" ]; then
    error "Please install $1 to continue"
    exit 1
  fi
}

# Check dependencies
is_install "git"
is_install "zip"

# Setup base repository
info "Repository: (default: https://github.com/amannocci/kibana-plugin-metric-percent)"
read -p "> " URL
URL=${URL:-https://github.com/amannocci/kibana-plugin-metric-percent}
info "Repository setup to: $URL"

# Setup plugin version
info "Kibana version: (default: master)"
read -p "> " VERSION
VERSION=${VERSION:-master}

# Clone plugin
info "Cloning plugin in current directory"
git clone $URL /tmp/kibana-plugin-metric-percent
if [ $? -ne 0 ]; then
  error "The repository can't be used"
  exit 1
else
  info "Cloning plugin in current directory"
fi

if [ "$VERSION" != "master" ]; then
  cd /tmp/kibana-plugin-metric-percent
  git checkout tags/$VERSION

  if [ $? -ne 0 ]; then
    error "This plugin isn't supported for Kibana $VERSION"
    exit 1
  else
    info "Checkout to the right version of plugin for Kibana $VERSION"
  fi
fi
cd /tmp

# Repacking plugin
info "Repacking plugin..."
mkdir -p /tmp/kibana/metric_percent_vis
mv ./kibana-plugin-metric-percent/* /tmp/kibana/metric_percent_vis/
zip -r metric_percent_vis.zip /tmp/kibana

# Cleanup
info "Cleanup..."
rm -rf /tmp/kibana-plugin-metric-percent
rm -rf /tmp/kibana

# If detected
if [ -x "$(command -v kibana-plugin)" ]; then
  info "Kibana plugin manager detected"
  info "Do you want to install plugin ? [y/n] (default: n)"
  read -p "> " ANSWER
  if [ "$ANSWER" == "y" ]; then
    kibana-plugin install file://$PWD/metric_percent_vis.zip
  fi 
fi