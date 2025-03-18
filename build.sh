#!/bin/bash

set -e

tmpdir=$(mktemp -d)
currdir=$(pwd)

(
	cd assets/active2
	#python3 labels.py
	python3 clock.py
)

zeus build

cp dist/*.zab $tmpdir

cd $tmpdir
unzip *.zab
unzip *.zpk
unzip device.zip -d device

(
	cd device
	sed -i 's/production/development/' app.json
	zip -r ../device.zip *
)

date_now=$(date "+%Y_%m_%d_%H_%M_%S")
filename=active2_$date_now.zpk
zip $filename app-side.zip device.zip

#url=$(pyupload --host catbox $tmpdir/active2.zpk | grep -o http.*)

cp $filename ~/mpzie/data/watchfaces/
cd
rm -r $tmpdir

cd ~/mpzie
git add data/watchfaces
git commit -m "New active2 zpk"
git push

#url=$(echo $url | sed 's/https/zpkd1/')
url="mzielinski.info/watchfaces/$filename"

echo https://$url

while true; do
	if curl --output /dev/null --silent --head --fail "https://$url"; then
		break
	fi
	echo "Waiting..."
	sleep 1
done

qrcode-terminal "zpkd1://$url"
