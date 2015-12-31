if [ ! -z "$RESIN" ]; then
    cd ../simple-beast-fork && git commit --allow-empty -a -m "new image" && git push resin master --force
else
    cd ../simple-beast-fork && git commit --allow-empty -a -m "new image" && git push resin master --force && sleep 5s
fi
