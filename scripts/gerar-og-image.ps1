Add-Type -AssemblyName System.Drawing

$width = 1200
$height = 630
$outputPath = "public\og-alms-prime.png"
$logoPath = "public\logo-alms-prime.png"

$bitmap = New-Object System.Drawing.Bitmap($width, $height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)

$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$rect = [System.Drawing.Rectangle]::new(0, 0, $width, $height)
$bgStart = [System.Drawing.ColorTranslator]::FromHtml("#061728")
$bgEnd = [System.Drawing.ColorTranslator]::FromHtml("#0d3148")
$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $bgStart, $bgEnd, 35)
$graphics.FillRectangle($bgBrush, $rect)

$cyanGlow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(55, 34, 211, 238))
$greenGlow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(45, 52, 211, 153))
$graphics.FillEllipse($cyanGlow, -190, -170, 520, 520)
$graphics.FillEllipse($greenGlow, 870, 310, 480, 480)

$borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(80, 125, 211, 252), 2)
$graphics.DrawRectangle($borderPen, 55, 55, 1090, 520)

$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$cyanBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#67e8f9"))
$lightBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#dbeafe"))
$greenBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#a7f3d0"))

$brandFont = New-Object System.Drawing.Font("Segoe UI", 30, [System.Drawing.FontStyle]::Bold)
$subtitleFont = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Bold)
$badgeFont = New-Object System.Drawing.Font("Segoe UI", 15, [System.Drawing.FontStyle]::Bold)
$titleFont = New-Object System.Drawing.Font("Segoe UI", 44, [System.Drawing.FontStyle]::Bold)
$descFont = New-Object System.Drawing.Font("Segoe UI", 21, [System.Drawing.FontStyle]::Regular)
$footerFont = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Bold)

$logoBoxBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(235, 255, 255, 255))
$logoBoxPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(130, 103, 232, 249), 2)

$graphics.FillRectangle($logoBoxBrush, 90, 85, 108, 108)
$graphics.DrawRectangle($logoBoxPen, 90, 85, 108, 108)

if (Test-Path $logoPath) {
  $logo = [System.Drawing.Image]::FromFile((Resolve-Path $logoPath))
  $graphics.DrawImage($logo, 102, 97, 84, 84)
  $logo.Dispose()
}

$graphics.DrawString("ALMS PRIME", $brandFont, $whiteBrush, 225, 92)
$graphics.DrawString("Tecnologia • Gestão • Soluções digitais", $subtitleFont, $cyanBrush, 228, 136)

$badgeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(42, 34, 211, 238))
$badgePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, 125, 211, 252), 1)
$graphics.FillRectangle($badgeBrush, 90, 230, 285, 42)
$graphics.DrawRectangle($badgePen, 90, 230, 285, 42)
$graphics.DrawString("PORTAL INSTITUCIONAL", $badgeFont, $cyanBrush, 113, 239)

$graphics.DrawString("Tecnologia, gestão", $titleFont, $whiteBrush, 90, 315)
$graphics.DrawString("e soluções digitais", $titleFont, $whiteBrush, 90, 370)
$graphics.DrawString("para sua operação crescer", $titleFont, $whiteBrush, 90, 425)

$graphics.DrawString(
  "Sistemas, portais, automações e dashboards para organizar processos e acelerar decisões.",
  $descFont,
  $lightBrush,
  [System.Drawing.RectangleF]::new(92, 500, 950, 45)
)

$graphics.DrawString("www.almsprime.com.br", $footerFont, $greenBrush, 90, 555)
$graphics.DrawString("ALMS Prime", $footerFont, $greenBrush, 930, 555)

$bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

$graphics.Dispose()
$bitmap.Dispose()
$bgBrush.Dispose()
$cyanGlow.Dispose()
$greenGlow.Dispose()
$borderPen.Dispose()
$whiteBrush.Dispose()
$cyanBrush.Dispose()
$lightBrush.Dispose()
$greenBrush.Dispose()
$brandFont.Dispose()
$subtitleFont.Dispose()
$badgeFont.Dispose()
$titleFont.Dispose()
$descFont.Dispose()
$footerFont.Dispose()
$logoBoxBrush.Dispose()
$logoBoxPen.Dispose()
$badgeBrush.Dispose()
$badgePen.Dispose()

Write-Host "Imagem criada em: $outputPath" -ForegroundColor Green
