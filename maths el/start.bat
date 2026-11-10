@echo off
title ExamSlot - Automated Examination Timetabler
echo ========================================================
echo    Launching ExamSlot Web Application...
echo ========================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
pause

