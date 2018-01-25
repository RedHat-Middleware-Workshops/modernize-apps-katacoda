#!/usr/bin/env bash

cd ${HOME}/projects/cart
git pull --quiet
clear; echo; echo -e "\033[0;32mYour ip-address for this cluster is $(hostname -i), please record this so that the instructor can reboot your machine if needed.\033[0m";echo

