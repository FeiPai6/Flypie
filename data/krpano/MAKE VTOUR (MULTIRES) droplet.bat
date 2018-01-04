@echo off
echo MAKE VTOUR (MULTIRES) droplet

IF "%~1" == "" GOTO ERROR
IF NOT EXIST "%~1" GOTO ERROR

set KRPANOTOOLSEXE=krpanotools64.exe
if "%PROCESSOR_ARCHITECTURE%" == "x86" set KRPANOTOOLSEXE=krpanotools32.exe

"%~dp0\%KRPANOTOOLSEXE%" makepano "%~dp0\templates\vtour-multires.config" %*
GOTO DONE

:ERROR
echo.
echo Drag and drop several panoramic images on this droplet to create 
echo automatically a simple virtual tour with multires panos from it.

:DONE
echo.
pause
