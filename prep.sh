#!/bin/bash

clang -E -nostdinc -xc -std=c89 -I./include WQ-master.unp.js | grep -xv "#.*" > WQ-master.js
