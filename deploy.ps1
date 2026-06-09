# =====================================================================
#  Деплой K-Beauty Profi на GitHub Pages БЕЗ ТОКЕНІВ.
#  Перший запуск відкриє браузер для входу в GitHub (один раз).
#  Далі — просто запускай цей файл, і зміни автоматично публікуються
#  через GitHub Actions.
#
#  Запуск:  правий клік на файлі → "Run with PowerShell"
#           або в терміналі:  ./deploy.ps1 "опис змін"
# =====================================================================
param([string]$msg = "update site")

Set-Location -Path $PSScriptRoot

git add -A
git commit -m $msg
git push

Write-Host ""
Write-Host "Готово. GitHub Actions опублікує сайт за 1-2 хв:" -ForegroundColor Green
Write-Host "https://prokoppro91-droid.github.io/kbeauty-site/" -ForegroundColor Cyan
Write-Host "Прогрес: https://github.com/prokoppro91-droid/kbeauty-site/actions"
