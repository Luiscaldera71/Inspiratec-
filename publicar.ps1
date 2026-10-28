# publicar.ps1 - Sube el codigo funcional de esta carpeta a GitHub (main); Vercel publica solo.
# Uso:  .\publicar.ps1 "mensaje del cambio"
# Copia src/ y los archivos de configuracion al clon de GitHub, hace commit y push. No borra nada del repositorio.
param([string]$Mensaje = "Actualizacion de Inspiratec")

$origen  = $PSScriptRoot
$destino = Join-Path (Split-Path $origen -Parent) 'inspiratec-vercel'
$repo    = 'https://Luiscaldera71@github.com/Luiscaldera71/Inspiratec-.git'

if (-not (Test-Path (Join-Path $destino '.git'))) { git clone $repo $destino }
Set-Location $destino
git checkout main | Out-Null
git pull --ff-only origin main

# Copiar solo lo funcional (nunca .env, node_modules, dist ni docs)
robocopy (Join-Path $origen 'src') (Join-Path $destino 'src') /E /NFL /NDL /NJH /NJS | Out-Null
# public/ lleva el logo, el banner, el video del login, el manifest y el service worker de la PWA
robocopy (Join-Path $origen 'public') (Join-Path $destino 'public') /E /NFL /NDL /NJH /NJS | Out-Null
foreach ($f in 'package.json', 'firestore.rules', 'vercel.json', 'index.html', 'vite.config.js') {
  if (Test-Path (Join-Path $origen $f)) { Copy-Item (Join-Path $origen $f) (Join-Path $destino $f) -Force }
}

# Si cambiaron las dependencias, actualizar pnpm-lock.yaml (el repo usa pnpm)
npx --yes pnpm@10 install --lockfile-only | Out-Null

git add -A
if (-not (git status --porcelain)) { Write-Host 'No hay cambios para subir.'; return }
git status --short
git commit -m $Mensaje
git push origin main
Write-Host 'Listo: GitHub recibio el cambio y Vercel lo publica en 1-2 minutos.'
