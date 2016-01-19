APP_NAME=$1
COMMIT=$2
cd ../$APP_NAME && git commit --allow-empty -a -m $COMMIT && git push resin master --force && sleep 5s
