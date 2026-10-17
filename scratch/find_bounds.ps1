Add-Type -AssemblyName System.Drawing

$file = "C:\Users\LAM\Pictures\mob products\WhatsApp Image 2026-10-09 at 11.18.34 AM.jpeg"
$bmp = [System.Drawing.Bitmap]::FromFile($file)
$w = $bmp.Width
$h = $bmp.Height

Write-Output "Image size: ${w}x${h}"

# Scan from top
$top = 0
for ($y = 0; $y -lt $h; $y++) {
    $nonBlack = 0
    for ($x = 0; $x -lt $w; $x += 10) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -gt 30 -or $c.G -gt 30 -or $c.B -gt 30) {
            $nonBlack++
        }
    }
    if ($nonBlack -gt ($w / 30)) {
        $top = $y
        break
    }
}

# Scan from bottom
$bottom = $h - 1
for ($y = $h - 1; $y -ge 0; $y--) {
    $nonBlack = 0
    for ($x = 0; $x -lt $w; $x += 10) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -gt 30 -or $c.G -gt 30 -or $c.B -gt 30) {
            $nonBlack++
        }
    }
    # Check if this row is part of status bar (status bar might have white icons or text)
    # The actual photo has floor / baseboard
}

Write-Output "First non-black row from top: $top"

# Also check for row 800 to 1080
for ($y = 850; $y -lt $h; $y += 20) {
    $sample = $bmp.GetPixel([int]($w/2), $y)
    Write-Output "Row $y center pixel: R=$($sample.R), G=$($sample.G), B=$($sample.B)"
}

$bmp.Dispose()
