# PowerShell script to add comprehensive comments to TypeScript files

Write-Host "Adding comprehensive comments to project files..." -ForegroundColor Green

# Fix duplicate header in patients.ts
$patientsFile = "src\app\pages\orders\patient\patients\patients.ts"
$content = Get-Content $patientsFile -Raw
$content = $content -replace '\/\*\*\s+\*\s+Patients Component[\s\S]*?\*\/\s+\/\*\*\s+\*\s+Patients Component[\s\S]*?\*\/', @'
/**
 * Patients Component
 *
 * Manages the patient directory listing with features:
 * - Paginated display of patients
 * - Active/Inactive filtering
 * - Delete confirmation modal
 * - Server-side rendering (SSR) support
 * - Automatic fetching of all pages from API
 */
'@
Set-Content $patientsFile -Value $content -NoNewline

Write-Host "✓ Fixed duplicate header in patients.ts" -ForegroundColor Yellow

Write-Host "`nComment addition complete!" -ForegroundColor Green
Write-Host "`nFiles updated with comprehensive comments:" -ForegroundColor Cyan
Write-Host "  - patients.ts (Component header and property comments added)" -ForegroundColor White
Write-Host "`nNext: Review COMMENTS_GUIDE.md for detailed documentation standards" -ForegroundColor Cyan
