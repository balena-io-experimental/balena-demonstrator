# #Set the root password as root if not set as an ENV variable
# export PASSWD=${PASSWD:=root}
# #Set the root password
# echo "root:$PASSWD" | chpasswd
# TODO: clean up paths where slave repo is stored

if [ ! -z "$RESIN" ]; then
	# check if this is a resin device
	echo "starting ssh agent"
	eval "$(ssh-agent -s)"
	echo $KEY | base64 -d > /root/.ssh/id_rsa

	chmod 400 /root/.ssh/id_rsa

	ssh-add /root/.ssh/id_rsa

	git config --global user.email $EMAIL
	git config --global user.name $NAME

	if [ "$ERASE" == "TRUE" ]; then
		echo "Erasing project"
		cd /data
		rm -rf applause-o-meter
	fi

	echo "git clone"

	DIRECTORY="../simple-beast-fork"
	  # /   (root directory)
	if [ -d "$DIRECTORY" ]; then
		echo "Project exists"
		cd /data/applause-o-meter
		git pull
	else
		echo "Project doesnt exist, cloning"
		cd /data
		git clone https://github.com/shaunmulligan/applause-o-meter.git
		cd /data/applause-o-meter
		git remote add resin $REMOTE
		echo $REMOTE
	fi

	echo "starting x-server"
	# cd /data/applause-o-meter && git push resin master --force
	xinit /usr/src/app/start-app.sh --kiosk -- -nocursor
else
	DIRECTORY="../simple-beast-fork"
	if [ -d "$DIRECTORY" ]; then
		echo "starting app"
	else
		npm install
		REMOTE='unicorn@git.resin.io:unicorn/microbeast.git'
		cd ../ && git clone git@github.com:craig-mulligan/simple-beast-fork.git && cd simple-beast-fork && git remote add resin $REMOTE; cd -; cd ces-demo
		echo "repo setup"
	fi
	./start-app.sh
fi
