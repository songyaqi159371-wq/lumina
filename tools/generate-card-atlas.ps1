param(
    [string]$SourceDirectory = (Join-Path $PSScriptRoot '..\public\cards'),
    [string]$OutputFile = (Join-Path $PSScriptRoot '..\assets\card-atlas.jpg')
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$columns = 13
$rows = 6
$tileWidth = 240
$tileHeight = 400
$atlas = New-Object System.Drawing.Bitmap ($columns * $tileWidth), ($rows * $tileHeight)
$graphics = [System.Drawing.Graphics]::FromImage($atlas)

try {
    $graphics.Clear([System.Drawing.Color]::Black)
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    function Get-CardFileName([int]$id) {
        function Get-Suffix([int]$number) {
            if ($number -eq 1) { return 'ac' }
            if ($number -eq 11) { return 'pa' }
            if ($number -eq 12) { return 'kn' }
            if ($number -eq 13) { return 'qu' }
            if ($number -eq 14) { return 'ki' }
            return $number.ToString('00')
        }

        if ($id -le 21) { return "ar$($id.ToString('00')).jpg" }
        if ($id -le 35) { return "wa$(Get-Suffix ($id - 21)).jpg" }
        if ($id -le 49) { return "cu$(Get-Suffix ($id - 35)).jpg" }
        if ($id -le 63) { return "sw$(Get-Suffix ($id - 49)).jpg" }
        return "pe$(Get-Suffix ($id - 63)).jpg"
    }

    for ($id = 0; $id -lt 78; $id++) {
        $sourcePath = Join-Path $SourceDirectory (Get-CardFileName $id)
        if (-not (Test-Path -LiteralPath $sourcePath)) {
            throw "Missing card image: $sourcePath"
        }

        $image = [System.Drawing.Image]::FromFile($sourcePath)
        try {
            $column = $id % $columns
            $row = [Math]::Floor($id / $columns)
            $scale = [Math]::Max($tileWidth / $image.Width, $tileHeight / $image.Height)
            $drawWidth = $image.Width * $scale
            $drawHeight = $image.Height * $scale
            $drawX = ($column * $tileWidth) + (($tileWidth - $drawWidth) / 2)
            $drawY = ($row * $tileHeight) + (($tileHeight - $drawHeight) / 2)
            $tile = New-Object System.Drawing.Rectangle ($column * $tileWidth), ($row * $tileHeight), $tileWidth, $tileHeight

            $graphics.SetClip($tile)
            $graphics.DrawImage($image, $drawX, $drawY, $drawWidth, $drawHeight)
            $graphics.ResetClip()
        }
        finally {
            $image.Dispose()
        }
    }

    $outputDirectory = Split-Path -Parent $OutputFile
    New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null

    $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
        Where-Object MimeType -eq 'image/jpeg'
    $encoderParameters = New-Object System.Drawing.Imaging.EncoderParameters 1
    $encoderParameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
        [System.Drawing.Imaging.Encoder]::Quality,
        [long]90
    )
    $atlas.Save($OutputFile, $jpegCodec, $encoderParameters)
}
finally {
    $graphics.Dispose()
    $atlas.Dispose()
}

Write-Output "Generated $OutputFile"
