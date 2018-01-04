@echo off
echo MAKE OBJECT droplet

IF "%~1" == "" GOTO ERROR
IF NOT EXIST "%~1" GOTO ERROR

set KRPANOTOOLSEXE=krpanotools64.exe
if "%PROCESSOR_ARCHITECTURE%" == "x86" set KRPANOTOOLSEXE=krpanotools32.exe

"%~dp0\%KRPANOTOOLSEXE%" makepano "%~dp0\templates\object.config" %*
GOTO DONE

:ERROR
echo.
echo Drag and drop all object images on thie droplet to create 
echo automatically a multiresolution object movie from it.

:DONE
echo.
pause
