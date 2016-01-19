cd ../$1 && echo $PWD && git commit --allow-empty -a -m $2 && git push resin master --force && sleep 5s
