param(
  [string]$BaseUrl = "http://localhost:3000",
  [Parameter(Mandatory=$true)][string]$Token
)

function Invoke-Api {
  param(
    [string]$Method,
    [string]$Path,
    [object]$Body = $null
  )
  $headers = @{ Authorization = "Bearer $Token" }
  $uri = "$BaseUrl$Path"
  try {
    if ($Body -ne $null) {
      $json = $Body | ConvertTo-Json -Depth 10
      $res = Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers -ContentType 'application/json' -Body $json -ErrorAction Stop
    } else {
      $res = Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers -ErrorAction Stop
    }
    return @{ ok=$true; json=$res }
  } catch {
    return @{ ok=$false; err=$_.Exception.Message }
  }
}

function Test-Envelope {
  param([object]$Json)
  # Valid if it has either data or error keys, and meta
  return ($Json.PSObject.Properties.Name -contains 'meta') -and (
    ($Json.PSObject.Properties.Name -contains 'data') -or ($Json.PSObject.Properties.Name -contains 'error')
  )
}

$tests = @(
  @{ name='Bots: List'; method='GET'; path='/api/bots/bots' },
  @{ name='CRM: Stats'; method='GET'; path='/api/crm/stats' },
  @{ name='WhatsApp: Status'; method='GET'; path='/api/whatsapp/status' }
)

$failed = 0
foreach ($t in $tests) {
  Write-Host "-> $($t.name) $($t.method) $($t.path)" -ForegroundColor Cyan
  $res = Invoke-Api -Method $t.method -Path $t.path
  if (-not $res.ok) {
    Write-Host "   Request failed: $($res.err)" -ForegroundColor Red
    $failed++
    continue
  }
  if (Test-Envelope -Json $res.json) {
    Write-Host "   OK envelope" -ForegroundColor Green
  } else {
    Write-Host "   Invalid envelope: $(($res.json | ConvertTo-Json -Depth 5))" -ForegroundColor Yellow
    $failed++
  }
}

if ($failed -gt 0) {
  Write-Host "Smoke tests completed with $failed failure(s)." -ForegroundColor Red
  exit 1
} else {
  Write-Host "Smoke tests passed." -ForegroundColor Green
  exit 0
}

