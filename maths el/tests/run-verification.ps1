# ExamSlot - Automated Verification Script
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Running ExamSlot Automated System Verification...       " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

$root = $PSScriptRoot | Split-Path -Parent

# Test 1: Verify all required files exist
$requiredFiles = @(
    "index.html",
    "css\styles.css",
    "js\bundle.js",
    "js\sampleData.js",
    "js\conflictDetector.js",
    "js\graphAlgorithms.js",
    "js\timetableGenerator.js",
    "js\csvHelper.js",
    "js\pdfExport.js",
    "sample-data\sample_students.csv",
    "sample-data\google_forms_sample.csv",
    "tests\test-runner.html",
    "serve.ps1",
    "start.bat"
)

$missing = 0
foreach ($file in $requiredFiles) {
    $fullPath = Join-Path $root $file
    if (Test-Path $fullPath) {
        Write-Host " [PASS] Found: $file" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] Missing: $file" -ForegroundColor Red
        $missing++
    }
}

# Test 2: Verify sample CSV content
$csvSample = Join-Path $root "sample-data\sample_students.csv"
if (Test-Path $csvSample) {
    $lines = Get-Content $csvSample
    if ($lines.Count -ge 5) {
        Write-Host " [PASS] sample_students.csv verified ($($lines.Count) rows)" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] sample_students.csv has insufficient rows" -ForegroundColor Red
        $missing++
    }
}

# Test 3: Verify Google Forms CSV format
$gfSample = Join-Path $root "sample-data\google_forms_sample.csv"
if (Test-Path $gfSample) {
    $lines = Get-Content $gfSample
    if ($lines[0] -match "Timestamp" -and $lines[0] -match "Student ID") {
        Write-Host " [PASS] google_forms_sample.csv headers verified" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] google_forms_sample.csv missing required headers" -ForegroundColor Red
        $missing++
    }
}

# Test 4: Verify bundle size and non-emptiness
$bundle = Join-Path $root "js\bundle.js"
if (Test-Path $bundle) {
    $size = (Get-Item $bundle).Length
    if ($size -gt 15000) {
        Write-Host " [PASS] js\bundle.js compiled ($([Math]::Round($size / 1KB, 1)) KB)" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] js\bundle.js appears truncated ($size bytes)" -ForegroundColor Red
        $missing++
    }
}

Write-Host "==========================================================" -ForegroundColor Cyan
if ($missing -eq 0) {
    Write-Host "   ALL VERIFICATION CHECKS PASSED (100% HEALTHY)         " -ForegroundColor Green
} else {
    Write-Host "   $missing CHECKS FAILED                                " -ForegroundColor Red
}
Write-Host "==========================================================" -ForegroundColor Cyan

