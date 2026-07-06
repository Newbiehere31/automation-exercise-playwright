@echo off
setlocal

set "NODE_BIN=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
set "PNPM=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd"

if not exist "%PNPM%" (
  echo pnpm was not found at "%PNPM%".
  echo Install pnpm globally or run this project from the Codex environment.
  exit /b 1
)

set "PATH=%NODE_BIN%;%PATH%"
call "%PNPM%" exec playwright install
