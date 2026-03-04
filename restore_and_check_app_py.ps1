# PowerShell script to restore backend/app.py from a known-good source and verify null bytes
# 1. Download the file from GitHub raw URL
# 2. Check for null bytes immediately after download
# 3. Output result

$repoUrl = "https://raw.githubusercontent.com/Parik-2006/shamirsecurity/main/backend/app.py"
$localPath = "backend/app.py"

Invoke-WebRequest -Uri $repoUrl -OutFile $localPath

# Check for null bytes
if ((Get-Content -Encoding Byte $localPath) -contains 0) {
    Write-Host "NULL BYTE FOUND after download"
} else {
    Write-Host "NO NULL BYTES after download"
}
