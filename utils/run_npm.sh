#!/bin/sh

if ! curl --retry 0 --max-time 2 https://google.com > /dev/null 2>&1; then
    # bullet-proof for Chinese developers
    if npm config list | grep registry > /dev/null 2>&1; then
        npm $@
    elif which cnpm > /dev/null 2>&1; then
        cnpm $@
    else
        echo 'Warning: No accel method (registry, cnpm) was detected. Proceed with npm anyway.'
        npm $@
    fi
else
    npm $@
fi
