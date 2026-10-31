@echo off
rem CounterApp - one-step dev launcher
rem Double-click this, or run:  dev.cmd
rem It calls dev.ps1 with a per-run Bypass so no system policy change is needed.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0dev.ps1"
echo.
pause
