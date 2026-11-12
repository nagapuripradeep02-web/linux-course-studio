"""Lab recording choreography for Lesson 1.2: one continuous terminal clip (segments s12-s16).

Each clip is a bash snippet run inside the lab (helpers in lab/record.py): prep is NOT recorded, `start_rec`
begins the recording, `mark <name>` drops a named marker the editor syncs narration to, `stop_rec` ends it.
Record with:   python lab/record.py            (or: python lab/record.py terminal)

Command groups (a `clear` between groups keeps every output on screen, row 0 = first prompt line):
  s12  cat /etc/os-release                  (13 lines)
  s13  uname -r ; uname -o                  (kernel release, then GNU/Linux)
  s14  bash --version                       (first line: GNU bash)
  s15  ls /boot                             (EMPTY in the lab: it is a container; narration says so)
  s16  man man | head -20
"""

CLIPS = {
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
mark type_osr
typeh "cat /etc/os-release"; sleep 0.35
mark enter_osr
xdotool key Return; sleep 3.0
mark clear1
xdotool key ctrl+l; sleep 0.8
mark type_unr
typeh "uname -r"; sleep 0.35
mark enter_unr
xdotool key Return; sleep 2.5
mark type_uno
typeh "uname -o"; sleep 0.35
mark enter_uno
xdotool key Return; sleep 3.0
mark clear2
xdotool key ctrl+l; sleep 0.8
mark type_bash
typeh "bash --version"; sleep 0.35
mark enter_bash
xdotool key Return; sleep 3.0
mark clear3
xdotool key ctrl+l; sleep 0.8
mark type_boot
typeh "ls /boot"; sleep 0.35
mark enter_boot
xdotool key Return; sleep 4.0
mark clear4
xdotool key ctrl+l; sleep 0.8
mark type_man
typeh "man man | head -20"; sleep 0.35
mark enter_man
xdotool key Return; sleep 3.0
mark man_out
sleep 24
mark end
stop_rec 1
''',
}
