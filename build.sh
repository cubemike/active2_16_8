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

zip active2.zpk app-side.zip device.zip

url=$(pyupload --host catbox $tmpdir/active2.zpk | grep -o http.*)

url=$(echo $url | sed 's/https/zpkd1/')

echo $tmpdir
echo $url

qrcode-terminal "$url"
