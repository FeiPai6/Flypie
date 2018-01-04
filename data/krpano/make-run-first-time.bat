@echo off
echo MAKE VTOUR (NORMAL) droplet

IF "%~1" == "" GOTO ERROR
IF NOT EXIST "%~1" GOTO ERROR

set KRPANOTOOLSEXE=krpanotools64.exe
if "%PROCESSOR_ARCHITECTURE%" == "x86" set KRPANOTOOLSEXE=krpanotools32.exe

"%~dp0\%KRPANOTOOLSEXE%" register "ruza4tk2X4MdHuE7djJQGr9QTftMFHiSH2ac5jkIlFgGqG0K0IVQnh5vF/cicLpwedsURI0QTg+UluEgysRLUytpeVFyBTxdwREEIGquRh1Hp2BY2EtZ8kdO2r6CHLJAFlzY5w6au1rnHwRhJXgaK8J75RwK1DYb/OEZ4tD2pniUrnMrpFwGWwcKnxGyNSmMktsU6qadFjKbMH3HUKNXa7Y59lEzbDZJbsTuP+UynwwBhogv8K+byjs2LDvU48sx4/CNHWi26g==" makepano "%~dp0\templates\vtour-normal.config" %*
GOTO DONE

:ERROR
echo.
echo error
exit

:DONE
echo.
echo success
exit