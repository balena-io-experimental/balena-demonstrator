
if [ ! -z "$RESIN" ]; then
    cd ../simple-beast-demo && git commit --allow-empty -a -m "new image" && git push resin master --force
    echo "pushing"
else
    cd ../simple-beast-demo && git commit --allow-empty -a -m "new image" && git push resin master --force
fi
