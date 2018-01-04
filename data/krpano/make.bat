@echo off
echo MAKE VTOUR (NORMAL) droplet

IF "%~1" == "" GOTO ERROR
IF NOT EXIST "%~1" GOTO ERROR

set KRPANOTOOLSEXE=krpanotools64.exe
if "%PROCESSOR_ARCHITECTURE%" == "x86" set KRPANOTOOLSEXE=krpanotools32.exe

"%~dp0\%KRPANOTOOLSEXE%" makepano "%~dp0\templates\vtour-normal.config" %*
GOTO DONE

:ERROR
echo.
echo error
exit

:DONE
echo.
echo success
exit