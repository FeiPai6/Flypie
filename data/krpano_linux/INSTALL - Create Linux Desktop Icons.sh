#!/bin/bash

#### Create Linux Desktop Icons... (.desktop files with absolute paths)

cd $(dirname "$0")

APPNAME=krpano\ Tools
echo "[Desktop Entry]" > "$APPNAME.desktop"
echo "Name=krpano Tools" >> "$APPNAME.desktop"
echo "Exec=\"$PWD/krpano Tools.sh\" %F" >> "$APPNAME.desktop"
echo "Icon=$PWD/.krpanotoolsicon" >> "$APPNAME.desktop"
echo "Terminal=false" >> "$APPNAME.desktop"
echo "Type=Application" >> "$APPNAME.desktop"
echo "Categories=Application;Graphics;" >> "$APPNAME.desktop"
echo "StartupNotify=false" >> "$APPNAME.desktop"

APPNAME=Convert\ SPHERE\ to\ CUBE\ droplet
echo "[Desktop Entry]" > "$APPNAME.desktop"
echo "Name=Convert SPHERE to CUBE droplet" >> "$APPNAME.desktop"
echo "Exec=\"$PWD/krpanotools\" sphere2cube -config=templates/convertdroplets.config %F" >> "$APPNAME.desktop"
echo "Path=$PWD/" >> "$APPNAME.desktop"
echo "Icon=$PWD/.converticon" >> "$APPNAME.desktop"
echo "Terminal=true" >> "$APPNAME.desktop"
echo "Type=Application" >> "$APPNAME.desktop"
echo "Categories=Application;Graphics;" >> "$APPNAME.desktop"
echo "StartupNotify=false" >> "$APPNAME.desktop"

APPNAME=Convert\ CUBE\ to\ SPHERE\ droplet
echo "[Desktop Entry]" > "$APPNAME.desktop"
echo "Name=Convert CUBE to SPHERE droplet" >> "$APPNAME.desktop"
echo "Exec=\"$PWD/krpanotools\" cube2sphere -config=templates/convertdroplets.config %F" >> "$APPNAME.desktop"
echo "Path=$PWD/" >> "$APPNAME.desktop"
echo "Icon=$PWD/.converticon" >> "$APPNAME.desktop"
echo "Terminal=true" >> "$APPNAME.desktop"
echo "Type=Application" >> "$APPNAME.desktop"
echo "Categories=Application;Graphics;" >> "$APPNAME.desktop"
echo "StartupNotify=false" >> "$APPNAME.desktop"

APPNAME=MAKE\ VTOUR\ \(NORMAL\)\ droplet
echo "[Desktop Entry]" > "$APPNAME.desktop"
echo "Name=MAKE VTOUR (NORMAL) droplet" >> "$APPNAME.desktop"
echo "Exec=\"$PWD/krpanotools\" makepano -config=templates/vtour-normal.config %F" >> "$APPNAME.desktop"
echo "Path=$PWD/" >> "$APPNAME.desktop"
echo "Icon=$PWD/.makepanoicon" >> "$APPNAME.desktop"
echo "Terminal=true" >> "$APPNAME.desktop"
echo "Type=Application" >> "$APPNAME.desktop"
echo "Categories=Application;Graphics;" >> "$APPNAME.desktop"
echo "StartupNotify=false" >> "$APPNAME.desktop"

APPNAME=MAKE\ VTOUR\ \(MULTIRES\)\ droplet
echo "[Desktop Entry]" > "$APPNAME.desktop"
echo "Name=MAKE VTOUR (MULTIRES) droplet" >> "$APPNAME.desktop"
echo "Exec=\"$PWD/krpanotools\" makepano -config=templates/vtour-multires.config %F" >> "$APPNAME.desktop"
echo "Path=$PWD/" >> "$APPNAME.desktop"
echo "Icon=$PWD/.makepanoicon" >> "$APPNAME.desktop"
echo "Terminal=true" >> "$APPNAME.desktop"
echo "Type=Application" >> "$APPNAME.desktop"
echo "Categories=Application;Graphics;" >> "$APPNAME.desktop"
echo "StartupNotify=false" >> "$APPNAME.desktop"

APPNAME=MAKE\ OBJECT\ droplet
echo "[Desktop Entry]" > "$APPNAME.desktop"
echo "Name=MAKE OBJECT droplet" >> "$APPNAME.desktop"
echo "Exec=\"$PWD/krpanotools\" makepano -config=templates/object.config %F" >> "$APPNAME.desktop"
echo "Path=$PWD/" >> "$APPNAME.desktop"
echo "Icon=$PWD/.makepanoicon" >> "$APPNAME.desktop"
echo "Terminal=true" >> "$APPNAME.desktop"
echo "Type=Application" >> "$APPNAME.desktop"
echo "Categories=Application;Graphics;" >> "$APPNAME.desktop"
echo "StartupNotify=false" >> "$APPNAME.desktop"

APPNAME=MAKE\ PANO\ \(FLAT\)\ droplet
echo "[Desktop Entry]" > "$APPNAME.desktop"
echo "Name=MAKE PANO (FLAT) droplet" >> "$APPNAME.desktop"
echo "Exec=\"$PWD/krpanotools\" makepano -config=templates/flat.config %F" >> "$APPNAME.desktop"
echo "Path=$PWD/" >> "$APPNAME.desktop"
echo "Icon=$PWD/.makepanoicon" >> "$APPNAME.desktop"
echo "Terminal=true" >> "$APPNAME.desktop"
echo "Type=Application" >> "$APPNAME.desktop"
echo "Categories=Application;Graphics;" >> "$APPNAME.desktop"
echo "StartupNotify=false" >> "$APPNAME.desktop"

APPNAME=MAKE\ PANO\ \(MULTIRES\)\ droplet
echo "[Desktop Entry]" > "$APPNAME.desktop"
echo "Name=MAKE PANO (MULTIRES) droplet" >> "$APPNAME.desktop"
echo "Exec=\"$PWD/krpanotools\" makepano -config=templates/multires.config %F" >> "$APPNAME.desktop"
echo "Path=$PWD/" >> "$APPNAME.desktop"
echo "Icon=$PWD/.makepanoicon" >> "$APPNAME.desktop"
echo "Terminal=true" >> "$APPNAME.desktop"
echo "Type=Application" >> "$APPNAME.desktop"
echo "Categories=Application;Graphics;" >> "$APPNAME.desktop"
echo "StartupNotify=false" >> "$APPNAME.desktop"

APPNAME=MAKE\ PANO\ \(NORMAL\)\ droplet
echo "[Desktop Entry]" > "$APPNAME.desktop"
echo "Name=MAKE PANO (NORMAL) droplet" >> "$APPNAME.desktop"
echo "Exec=\"$PWD/krpanotools\" makepano -config=templates/normal.config %F" >> "$APPNAME.desktop"
echo "Path=$PWD/" >> "$APPNAME.desktop"
echo "Icon=$PWD/.makepanoicon" >> "$APPNAME.desktop"
echo "Terminal=true" >> "$APPNAME.desktop"
echo "Type=Application" >> "$APPNAME.desktop"
echo "Categories=Application;Graphics;" >> "$APPNAME.desktop"
echo "StartupNotify=false" >> "$APPNAME.desktop"

APPNAME=MAKE\ PANO\ \(SINGLE-SWF\)\ droplet
echo "[Desktop Entry]" > "$APPNAME.desktop"
echo "Name=MAKE PANO (SINGLE-SWF) droplet" >> "$APPNAME.desktop"
echo "Exec=\"$PWD/krpanotools\" makepano -config=templates/singleswf.config %F" >> "$APPNAME.desktop"
echo "Path=$PWD/" >> "$APPNAME.desktop"
echo "Icon=$PWD/.makepanoicon" >> "$APPNAME.desktop"
echo "Terminal=true" >> "$APPNAME.desktop"
echo "Type=Application" >> "$APPNAME.desktop"
echo "Categories=Application;Graphics;" >> "$APPNAME.desktop"
echo "StartupNotify=false" >> "$APPNAME.desktop"

APPNAME=ENCRYPT\ XML\ droplet
echo "[Desktop Entry]" > "$APPNAME.desktop"
echo "Name=ENCRYPT XML droplet" >> "$APPNAME.desktop"
echo "Exec=\"$PWD/krpanotools\" encrypt -h5 -z %F" >> "$APPNAME.desktop"
echo "Path=$PWD/" >> "$APPNAME.desktop"
echo "Icon=$PWD/.encrypticon" >> "$APPNAME.desktop"
echo "Terminal=true" >> "$APPNAME.desktop"
echo "Type=Application" >> "$APPNAME.desktop"
echo "Categories=Application;Graphics;" >> "$APPNAME.desktop"
echo "StartupNotify=false" >> "$APPNAME.desktop"

chmod 755 *.desktop


#### create link to libudev.so.0

paths=(
  "/lib/x86_64-linux-gnu/libudev.so.1"
  "/lib/x86_64-linux-gnu/libudev.so.0"
  "/usr/lib64/libudev.so.1"
  "/usr/lib64/libudev.so.0"
  "/usr/lib/libudev.so.1"
  "/usr/lib/libudev.so.0"
  "/lib/i386-linux-gnu/libudev.so.1"
  "/lib/i386-linux-gnu/libudev.so.0"
)
for i in "${paths[@]}"
do
  if [ -f $i ]
  then
    ln -sf "$i" ./libudev.so.0
    break
  fi
done
