# ExamSlot - Zero-Dependency Local Web Server
# Uses Windows built-in .NET HttpListener (no node or python required!)

$port = 3000
$url = "http://localhost:$port/"
$root = $PSScriptRoot

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)

try {
    $listener.Start()
} catch {
    Write-Host "Port $port may be occupied, trying port 3001..." -ForegroundColor Yellow
    $port = 3001
    $url = "http://localhost:$port/"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($url)
    $listener.Start()
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   ExamSlot – Automated Timetabling System Running!       " -ForegroundColor Green
Write-Host "   URL: $url                                              " -ForegroundColor Yellow
Write-Host "   Press Ctrl+C in this terminal window to stop server.   " -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

# Open default browser
Start-Process $url

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $path = $request.Url.LocalPath.TrimStart('/')
    if ([string]::IsNullOrEmpty($path)) {
        $path = "index.html"
    }

    $filePath = Join-Path $root $path

    if (Test-Path $filePath -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $contentType = "text/plain"
        switch ($ext) {
            ".html" { $contentType = "text/html; charset=utf-8" }
            ".js"   { $contentType = "application/javascript; charset=utf-8" }
            ".css"  { $contentType = "text/css; charset=utf-8" }
            ".csv"  { $contentType = "text/csv; charset=utf-8" }
            ".json" { $contentType = "application/json; charset=utf-8" }
            ".png"  { $contentType = "image/png" }
            ".svg"  { $contentType = "image/svg+xml" }
            ".ico"  { $contentType = "image/x-icon" }
        }

        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentType = $contentType
        $response.ContentLength64 = $bytes.Length
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $response.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found: $path")
        $response.OutputStream.Write($msg, 0, $msg.Length)
    }
    $response.Close()
}

