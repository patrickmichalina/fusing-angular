# Stolen from here: http://stackoverflow.com/a/20703594/850326
#!/bin/sh
export POSIXLY_CORRECT=1

if [ -z "${1}" -o -z "${2}" ]
then
    echo "Usage: ${0} <name> <original-png-location>"
fi

name=$1
location=$2

rm -rf ${1}.iconset
mkdir ${1}.iconset
sips -z 16 16     "${2}" --out "${1}.iconset/icon_16x16.png"
sips -z 32 32     "${2}" --out "${1}.iconset/icon_16x16@2x.png"
sips -z 32 32     "${2}" --out "${1}.iconset/icon_32x32.png"
sips -z 64 64     "${2}" --out "${1}.iconset/icon_32x32@2x.png"
sips -z 128 128   "${2}" --out "${1}.iconset/icon_128x128.png"
sips -z 256 256   "${2}" --out "${1}.iconset/icon_128x128@2x.png"
sips -z 256 256   "${2}" --out "${1}.iconset/icon_256x256.png"
sips -z 512 512   "${2}" --out "${1}.iconset/icon_256x256@2x.png"
sips -z 512 512   "${2}" --out "${1}.iconset/icon_512x512.png"
cp "${2}" "${1}.iconset/icon_512x512@2x.png"
iconutil -c icns "${1}.iconset"
rm -R "${1}.iconset"