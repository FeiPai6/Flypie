@echo off
echo ENCRYPT XML droplet
echo.

set KRPANOTOOLSEXE=krpanotools64.exe
if "%PROCESSOR_ARCHITECTURE%" == "x86" set KRPANOTOOLSEXE=krpanotools32.exe

"%~dp0\%KRPANOTOOLSEXE%" encrypt -h5 -z -bk %*

echo.
pause
