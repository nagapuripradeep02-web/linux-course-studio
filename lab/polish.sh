#!/bin/bash
# Run inside the container as uid 1000: makes the desktop look like a tidy instructor machine.
export DISPLAY=:1
PID=$(pgrep -u 1000 -x xfce4-session | head -1)
export $(tr '\0' '\n' < /proc/$PID/environ | grep ^DBUS_SESSION_BUS_ADDRESS=)
q() { xfconf-query "$@"; }

# Wallpaper on every monitor/workspace property that exists
for p in $(q -c xfce4-desktop -l | grep -E "last-image$"); do q -c xfce4-desktop -p "$p" -s /usr/share/backgrounds/course-wall.png; done
for p in $(q -c xfce4-desktop -l | grep -E "image-style$"); do q -c xfce4-desktop -p "$p" -s 5; done
q -c xfce4-desktop -p /backdrop/screen0/monitorscreen/workspace0/last-image -n -t string -s /usr/share/backgrounds/course-wall.png
q -c xfce4-desktop -p /backdrop/screen0/monitorscreen/workspace0/image-style -n -t int -s 5
xfdesktop --reload >/dev/null 2>&1 &

# Desktop font / UI scaling a bit larger for video legibility
q -c xsettings -p /Gtk/FontName -n -t string -s "Sans 12"
q -c xsettings -p /Net/ThemeName -n -t string -s "Greybird-dark"
q -c xfwm4 -p /general/theme -n -t string -s "Greybird-dark"

# Terminal: big mono font, no menubar/toolbar/scrollbar, steady cursor, calm dark palette
q -c xfce4-terminal -p /font-name -n -t string -s "JetBrains Mono 14"
q -c xfce4-terminal -p /font-use-system -n -t bool -s false
q -c xfce4-terminal -p /misc-menubar-default -n -t bool -s false
q -c xfce4-terminal -p /misc-toolbar-default -n -t bool -s false
q -c xfce4-terminal -p /scrolling-bar -n -t string -s TERMINAL_SCROLLBAR_NONE
q -c xfce4-terminal -p /misc-cursor-blinks -n -t bool -s false
q -c xfce4-terminal -p /color-use-theme -n -t bool -s false
q -c xfce4-terminal -p /color-background -n -t string -s "#0D1220"
q -c xfce4-terminal -p /color-foreground -n -t string -s "#E6E9F0"
q -c xfce4-terminal -p /color-cursor -n -t string -s "#F5A524"
q -c xfce4-terminal -p /color-cursor-use-default -n -t bool -s false
q -c xfce4-terminal -p /color-palette -n -t string -s "#1B2236;#FF6B6B;#5BD48A;#F5C451;#6EA8FE;#C792EA;#3DD6C6;#C9D1E0;#5B6684;#FF8A8A;#7BE3A2;#FFD27A;#91BDFF;#D7A9F5;#6FE8DA;#FFFFFF"
q -c xfce4-terminal -p /misc-default-geometry -n -t string -s "100x26"
q -c xfce4-terminal -p /misc-show-unsafe-paste-dialog -n -t bool -s false
q -c xfce4-terminal -p /misc-confirm-close -n -t bool -s false
echo polished
# breathing room around terminal text
mkdir -p ~/.config/gtk-3.0
printf 'vte-terminal, VteTerminal { padding: 14px 22px; }\n' > ~/.config/gtk-3.0/gtk.css
