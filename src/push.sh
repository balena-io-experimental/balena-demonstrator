if cd ../simple-beast-fork && git remote -v *resin* > /dev/null 2>&1
then
  echo "pushing to resin.io builder"
else
    cd ../simple-beast-fork && git remote add resin unicorn@git.resin.io:unicorn/microbeast.git
fi

if [ ! -z "$RESIN" ]; then
    cd ../simple-beast-fork && git commit --allow-empty -a -m "new image" && git push resin master --force
else
    cd ../simple-beast-fork && git commit --allow-empty -a -m "new image" && git push resin master --force
fi
