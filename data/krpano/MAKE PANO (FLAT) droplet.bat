@echo off
echo MAKE PANO (FLAT) droplet

IF "%~1" == "" GOTO ERROR
IF NOT EXIST "%~1" GOTO ERROR

set KRPANOTOOLSEXE=krpanotools64.exe
if "%PROCESSOR_ARCHITECTURE%" == "x86" set KRPANOTOOLSEXE=krpanotools32.exe

"%~dp0\%KRPANOTOOLSEXE%" makepano "%~dp0\templates\flat.config" %*
GOTO DONE

:ERROR
echo.
echo Drag and drop panoramic images on this droplet to create 
echo automatically flat multiresolution panoramas from it.

:DONE
echo.
pause
