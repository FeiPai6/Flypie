@echo off
echo Convert SPHERE to CUBE droplet
echo.

IF "%~1" == "" GOTO ERROR
IF NOT EXIST "%~1" GOTO ERROR

set KRPANOTOOLSEXE=krpanotools64.exe
if "%PROCESSOR_ARCHITECTURE%" == "x86" set KRPANOTOOLSEXE=krpanotools32.exe

FOR %%V in (%*) do "%~dp0\%KRPANOTOOLSEXE%" sphere2cube -config=templates\convertdroplets.config "%%~V"

GOTO DONE

:ERROR
echo.
echo Usage:
echo.
echo - Drag and drop spherical panorama images on this droplet
echo   to convert them to cubical panorama images.
echo.
echo.
echo Settings:
echo.
echo - See the "convertdroplets.config" file for settings 
echo   regarding output imageformat or compression.
echo.
echo.

:DONE
echo.
pause
