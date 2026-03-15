# ProToolHub dev server — bypasses PSSecurityException when script execution is restricted.
# Run: .\scripts\start-dev.ps1   OR   powershell -ExecutionPolicy Bypass -File scripts\start-dev.ps1

Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
Write-Host "ExecutionPolicy set for this process. Starting dev server..." -ForegroundColor Green
Set-Location $PSScriptRoot\..
& npm run dev
