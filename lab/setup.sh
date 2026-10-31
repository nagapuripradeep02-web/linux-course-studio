#!/bin/bash
# Rebuilds the recording lab from scratch: a real Ubuntu desktop (XFCE) in Docker, styled for video.
# Run from Git Bash (Windows) or a terminal (macOS/Linux):  bash lab/setup.sh
# Takes ~5 minutes the first time (downloads the ~2 GB desktop image).
set -euo pipefail
export MSYS_NO_PATHCONV=1
HERE="$(cd "$(dirname "$0")" && pwd -W 2>/dev/null || pwd)"
NAME=linux-lab
IMAGE=lscr.io/linuxserver/webtop:ubuntu-xfce

docker rm -f "$NAME" >/dev/null 2>&1 || true

# Pass through a realistic set of host (WSL2 VM) devices so /dev looks like a real machine,
# without giving the container --privileged.
# Only devices that exist on this Docker host are passed (WSL2 on Windows, a LinuxKit VM on macOS).
HOSTDEV=$(docker run --rm --privileged busybox ls /dev 2>/dev/null || true)
DEVICES=""
for d in sda sdb sdc sdd sde loop0 loop1 loop2 loop3 rtc0 hwrng kmsg tty0 tty1 tty2 tty3 tty4 tty5 tty6 tty7 ttyS0 ttyS1 ttyS2 ttyS3 vcs vcs1 vcsa vcsa1 hvc0 vsock; do
  if echo "$HOSTDEV" | grep -qx "$d"; then DEVICES="$DEVICES --device /dev/$d"; fi
done

docker run -d --name "$NAME" --hostname linux-lab --shm-size=1g \
  -e PUID=1000 -e PGID=1000 -e TZ=Etc/UTC \
  -p 127.0.0.1:3000:3000 $DEVICES "$IMAGE" >/dev/null

echo "waiting for desktop..."
for i in $(seq 1 60); do
  if docker exec "$NAME" pgrep -u 1000 -x xfce4-session >/dev/null 2>&1; then break; fi
  sleep 2
done
sleep 5

docker exec "$NAME" bash -c '
set -e
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq ffmpeg gnome-system-monitor fonts-jetbrains-mono x11-utils wmctrl >/dev/null
# The image ships user "abc"; present it as "student" (same uid) so prompts and panels read naturally.
sed -i "s/^abc:/student:/" /etc/passwd /etc/shadow /etc/group
sed -i "s/^\(sudo:.*\)abc/\1student/" /etc/group
echo "student ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/student
cp /etc/skel/.bashrc /config/.bashrc; cp /etc/skel/.profile /config/.profile
chown 1000:1000 /config/.bashrc /config/.profile
# Hide image-specific folders in the file manager view of / (they are Docker-image artefacts, not Ubuntu).
printf "%s\n" app command config defaults de-pid docker-mods init lsiopy package proot-apps steam.sh > /.hidden
# GTK4 apps: follow the dark scheme
sed -i "s|^Exec=gnome-system-monitor|Exec=env ADW_DEBUG_COLOR_SCHEME=prefer-dark gnome-system-monitor|" /usr/share/applications/org.gnome.SystemMonitor.desktop || true
mkdir -p /tmp/rec && chmod 777 /tmp/rec
'

docker cp "$HERE/wallpaper.png" "$NAME":/usr/share/backgrounds/course-wall.png
docker cp "$HERE/polish.sh" "$NAME":/tmp/polish.sh
docker exec -u 1000 "$NAME" bash -c '
export DISPLAY=:1
xrandr --newmode "1920x1080_60.00" 173.00 1920 2048 2248 2576 1080 1083 1088 1120 -hsync +vsync 2>/dev/null || true
xrandr --addmode screen "1920x1080_60.00" 2>/dev/null || true
xrandr --output screen --mode "1920x1080_60.00"
bash /tmp/polish.sh
PID=$(pgrep -u 1000 -x xfce4-session | head -1)
export $(tr "\0" "\n" < /proc/$PID/environ | grep ^DBUS_SESSION_BUS_ADDRESS=)
gsettings set org.gnome.desktop.interface color-scheme prefer-dark
xfce4-panel -r
sleep 2
'
echo "lab ready"
