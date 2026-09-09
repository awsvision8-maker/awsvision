#!/bin/bash
# Keep cPanel PostgreSQL tunnel alive via bore.pub
HOME_DIR="/home/awsvision"
BIN="$HOME_DIR/bin/bore"
LOG="$HOME_DIR/tmp/bore.log"
PIDFILE="$HOME_DIR/tmp/bore.pid"
PORT=35542

if [ ! -x "$BIN" ]; then
  exit 0
fi

if [ -f "$PIDFILE" ]; then
  PID=$(cat "$PIDFILE")
  if kill -0 "$PID" 2>/dev/null; then
    exit 0
  fi
fi

$BIN local 5432 --to bore.pub --port $PORT >> "$LOG" 2>&1 &
echo $! > "$PIDFILE"
