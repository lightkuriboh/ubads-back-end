$ npm install
$ sudo apt-get install mongodb
$ sudo systemctl status mongodb
$ mongo --eval 'db.runCommand({ connectionStatus: 1 })'
$ sudo systemctl start mongodb
$ unzip ubadsDB.MD
$ mongoimport -d ubadsDB -c games -f games.json
$ mongoimport -d ubadsDB -c users -f users.json
$ npm start
