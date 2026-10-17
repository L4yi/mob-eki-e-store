Add-Type -AssemblyName System.Drawing

$srcDir = "C:\Users\LAM\Pictures\mob products"
$dstDir = "c:\Users\LAM\Desktop\personal\personal\m.o.b-website\client\public\products"

$doors = @(
    @{
        File = "WhatsApp Image 2026-10-09 at 11.18.34 AM.jpeg"
        Dest = "luxury-mahogany-flush-door-silver-inlays.jpg"
        Top = 216
        Height = 648
    },
    @{
        File = "WhatsApp Image 2026-10-09 at 11.18.35 AM (1).jpeg"
        Dest = "executive-white-paneled-double-door-frosted-glass.jpg"
        Top = 211
        Height = 658
    },
    @{
        File = "WhatsApp Image 2026-10-09 at 11.18.35 AM (2).jpeg"
        Dest = "contemporary-natural-oak-interior-door-grooves.jpg"
        Top = 229
        Height = 622
    },
    @{
        File = "WhatsApp Image 2026-10-09 at 11.18.35 AM.jpeg"
        Dest = "architectural-matte-anthracite-flush-door-chrome-strips.jpg"
        Top = 197
        Height = 684
    },
    @{
        File = "WhatsApp Image 2026-10-09 at 11.18.36 AM.jpeg"
        Dest = "classic-deep-walnut-flush-door-4-silver-inlays.jpg"
        Top = 0
        Height = 0
    },
    @{
        File = "WhatsApp Image 2026-10-09 at 11.18.36 AM (1).jpeg"
        Dest = "golden-honey-beech-flush-door-silver-inlays.jpg"
        Top = 0
        Height = 0
    },
    @{
        File = "WhatsApp Image 2026-10-09 at 11.18.36 AM (2).jpeg"
        Dest = "deep-walnut-rosewood-door-with-casing-frame.jpg"
        Top = 0
        Height = 0
    },
    @{
        File = "WhatsApp Image 2026-10-09 at 11.18.37 AM (1).jpeg"
        Dest = "modern-warm-teak-flush-door-dual-silver-inlays.jpg"
        Top = 0
        Height = 0
    },
    @{
        File = "WhatsApp Image 2026-10-09 at 11.18.37 AM.jpeg"
        Dest = "modern-ebony-black-flush-door-dual-silver-inlays.jpg"
        Top = 0
        Height = 0
    }
)

foreach ($d in $doors) {
    $srcPath = Join-Path $srcDir $d.File
    $dstPath = Join-Path $dstDir $d.Dest
    
    if (Test-Path $srcPath) {
        $img = [System.Drawing.Image]::FromFile($srcPath)
        $w = $img.Width
        $h = $img.Height
        
        $top = $d.Top
        $cropH = $d.Height
        
        if ($cropH -gt 0) {
            $rect = New-Object System.Drawing.Rectangle(0, $top, $w, $cropH)
            $bmp = New-Object System.Drawing.Bitmap($w, $cropH)
            $g = [System.Drawing.Graphics]::FromImage($bmp)
            $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $g.DrawImage($img, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
            $g.Dispose()
            
            $bmp.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
            $bmp.Dispose()
            Write-Output "Cropped and saved: $($d.Dest) (${w}x${cropH})"
        } else {
            $img.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
            Write-Output "Copied without cropping: $($d.Dest) (${w}x${h})"
        }
        $img.Dispose()
    } else {
        Write-Warning "Source not found: $srcPath"
    }
}
Write-Output "Done!"
