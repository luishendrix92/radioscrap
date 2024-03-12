#!/bin/bash

# Step 1: Delete the directory /opt/rscrap if it exists
sudo rm -rf /opt/radioscrap

# Step 2: Run flutter build linux --release
flutter build linux --release

# Step 3: Move build/linux/x64/release/rscrap to /opt/ with sudo
sudo mv build/linux/x64/release/bundle /opt/radioscrap

# Step 4: Print a "done" message
echo "Done"
