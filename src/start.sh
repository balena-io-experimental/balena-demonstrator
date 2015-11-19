if [ ! -z "$RESIN" ]; then
    cd /data/applause-o-meter && git commit --allow-empty -m "new commit" && git push resin master --force
    echo "pushing"
else
    cd ~/work/cron-example && git commit --allow-empty -m "empty" && git push resin master --force
fi
