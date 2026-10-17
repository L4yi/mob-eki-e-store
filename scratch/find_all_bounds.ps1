Add-Type -AssemblyName System.Drawing

$files = @(
    "WhatsApp Image 2026-10-09 at 11.18.34 AM.jpeg",
    "WhatsApp Image 2026-10-09 at 11.18.35 AM (1).jpeg",
    "WhatsApp Image 2026-10-09 at 11.18.35 AM (2).jpeg",
    "WhatsApp Image 2026-10-09 at 11.18.35 AM.jpeg"
)

foreach ($f in $files) {
    $path = "C:\Users\LAM\Pictures\mob products\$f"
    $bmp = [System.Drawing.Bitmap]::FromFile($path)
    $w = $bmp.Width
    $h = $bmp.Height
    
    $top = 0
    for ($y = 0; $y -lt $h; $y++) {
        $c = $bmp.GetPixel([int]($w/2), $y)
        if ($c.R -gt 25 -or $c.G -gt 25 -or $c.B -gt 25) {
            $top = $y
            break
        }
    }
    
    $bottom = 0
    for ($y = 880; $y -gt 500; $y--) {
        $c = $bmp.GetPixel([int]($w/2), $y)
        if ($c.R -gt 25 -or $c.G -gt 25 -or $c.B -gt 25) {
            $bottom = $y
            break
        }
    }
    
    Write-Output "$f : Top=$top, Bottom=$bottom, Height=$($bottom - $top)"
    $bmp.Dispose()
}
