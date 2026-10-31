"""Lab recording choreography for Lesson 1.1: four clips of the real Ubuntu desktop.

Each clip is a bash snippet run inside the lab (helpers in lab/record.py): prep is NOT recorded, `start_rec`
begins the recording, `mark <name>` drops a named marker the editor syncs narration to, `stop_rec` ends it.
Record with:   python lab/record.py            (or just some: python lab/record.py sysmon terminal)

Lessons learned here, worth keeping for every lesson:
- System Monitor's graphs are empty when it opens: let it sit ~45 s (prep, unrecorded) before filming Resources.
- GTK4 windows re-apply their saved size after mapping, so `place` re-asserts the geometry a few times.
- Tab clicks in System Monitor need real mouse motion first (two mousemoves, then click), or they are ignored.
- Thunar draws a folder's icons ~3 s after the double-click: the editor's beats compensate (see index.tsx).
- `closeall` waits until old windows are gone, otherwise `place` can grab a dying window.
"""

SYSMON_RECT = "160 70 1600 960"
THUNAR_RECT = "160 70 1600 960"

CLIPS = {
    # s02: a living desktop; open a file manager, a terminal, a system monitor
    "desktop": r'''
closeall
xdotool mousemove 980 620
start_rec
mark start
glide 1150 520 1.6; sleep 0.6; glide 900 470 1.2; sleep 0.5
mark open_files
glide 65 182 0.9; sleep 0.15
place "File System - Thunar" 40 66 900 520 &
xdotool click --repeat 2 --delay 120 1
sleep 1.6
mark open_term
glide 60 13 0.9; xdotool click 1; sleep 0.5
glide 96 77 0.45; sleep 0.15
place "Terminal" 40 630 900 400 &
xdotool click 1
sleep 1.6
mark open_sysmon
glide 60 13 0.9; xdotool click 1; sleep 0.45
glide 54 389 0.6; sleep 0.35; glide 230 392 0.3; glide 279 513 0.4; sleep 0.2
place "System Monitor" 980 66 900 964 &
xdotool click 1
sleep 2.5
mark all_open
glide 960 700 1.2; sleep 6
mark end
stop_rec 1
''',
    # s05/s06: processes, then the resources (memory) view
    "sysmon": r'''
closeall
(setsid env ADW_DEBUG_COLOR_SCHEME=prefer-dark gnome-system-monitor >/dev/null 2>&1 &)
place "System Monitor" ''' + SYSMON_RECT + r'''
sleep 2
xdotool mousemove 800 95; sleep 0.3; xdotool mousemove 812 98; sleep 0.3; xdotool click 1
sleep 45   # let the resource graphs collect real history before we film them
xdotool mousemove 950 95; sleep 0.3; xdotool mousemove 960 98; sleep 0.3; xdotool click 1
sleep 1
xdotool mousemove 1200 600
start_rec
mark start
sleep 1.5
mark procs
glide 700 300 1.4; sleep 0.8; glide 700 560 1.6; sleep 0.6
xdotool click 4 click 4; sleep 0.1
for i in 1 2 3 4 5 6; do xdotool click 5; sleep 0.12; done
sleep 1.2
for i in 1 2 3 4 5 6; do xdotool click 4; sleep 0.12; done
sleep 1.0; glide 1180 260 1.2; sleep 3
mark to_resources
glide 812 108 0.9; sleep 0.2; xdotool click 1
mark resources
sleep 1.0; glide 900 600 1.0; sleep 2.5
mark memory
glide 380 540 1.2; sleep 9
mark end
stop_rec 1
''',
    # s07/s08: the file tree at /, peek into /etc, back, then /dev
    "files": r'''
closeall
(setsid thunar / >/dev/null 2>&1 &)
place "File System - Thunar" ''' + THUNAR_RECT + r'''
sleep 2
xdotool mousemove 1300 760
start_rec
mark start
sleep 1.2
mark tour
glide 400 215 1.2; sleep 0.4; glide 1630 215 2.4; sleep 0.3; glide 1490 315 0.9; sleep 0.3; glide 420 315 2.2; sleep 0.8
mark open_etc
glide 808 205 1.0; sleep 0.2; xdotool click --repeat 2 --delay 110 1
sleep 3.2
glide 1100 600 1.0; sleep 1.2
mark back
xdotool key alt+Up
sleep 2.4
mark top
glide 1000 700 1.0; sleep 4
mark open_dev
glide 672 205 1.1; sleep 0.2; xdotool click --repeat 2 --delay 110 1
sleep 1.2; glide 1300 750 1.2; sleep 9
mark end
stop_rec 1
''',
    # s11-s15: open a terminal, maximise it, run the five demo commands
    "terminal": r'''
closeall
xdotool mousemove 1100 600
start_rec
mark start
sleep 1.2
mark open_term
glide 60 13 1.0; xdotool click 1; sleep 0.5
glide 96 77 0.45; sleep 0.15
place "Terminal" 260 160 1400 760 &
xdotool click 1
sleep 1.4
w=$(xdotool search --onlyvisible --name "Terminal" | head -1)
sleep 0.4
wmctrl -i -r $w -b add,maximized_vert,maximized_horz
sleep 0.6
glide 1880 1050 0.8
sleep 1.0
mark type_uname_a
typeh "uname -a"; sleep 0.35
mark enter_uname_a
xdotool key Return; sleep 2.0
mark type_uname_r
typeh "uname -r"; sleep 0.35
mark enter_uname_r
xdotool key Return; sleep 2.0
mark type_shell
typeh 'echo $SHELL'; sleep 0.35
mark enter_shell
xdotool key Return; sleep 2.0
mark clear
xdotool key ctrl+l; sleep 0.8
mark type_ps
typeh "ps aux | head -5"; sleep 0.35
mark enter_ps
xdotool key Return; sleep 2.5
mark type_free
typeh "free -h"; sleep 0.35
mark enter_free
xdotool key Return; sleep 3.0
mark end
stop_rec 1
''',
}
