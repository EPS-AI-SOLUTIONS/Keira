' ============================================
' KEIRA - Launcher GUI
' Black Glass UI Edition
' v2.0.0 - Regis Architecture
' ============================================

Option Explicit

Dim WshShell, fso, scriptPath, projectPath, psCode

Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

scriptPath = fso.GetParentFolderName(WScript.ScriptFullName)
projectPath = fso.GetParentFolderName(scriptPath)

' Black Glass UI - Full Featured PowerShell GUI
psCode = "Add-Type -AssemblyName System.Windows.Forms; " & _
         "Add-Type -AssemblyName System.Drawing; " & _
         "[System.Windows.Forms.Application]::EnableVisualStyles(); " & _
         "$projectPath = '" & Replace(projectPath, "'", "''") & "'; " & _
         "$FRONTEND_PORT = 5175; $BACKEND_PORT = 8002; " & _
         "$script:autoStart = $false; " & _
         "$dotOn = [char]0x25CF; $dotOff = [char]0x25CB; $play = [char]0x25B6; $stop = [char]0x25A0; $gear = [char]0x2699; $globe = [char]0x25C9; $branch = [char]0x25D5; " & _
         "" & _
         "$colBg = [System.Drawing.Color]::FromArgb(255, 10, 10, 10); " & _
         "$colBgPanel = [System.Drawing.Color]::FromArgb(255, 22, 22, 22); " & _
         "$colBgBtn = [System.Drawing.Color]::FromArgb(255, 28, 28, 28); " & _
         "$colBorder = [System.Drawing.Color]::FromArgb(255, 55, 55, 55); " & _
         "$colText = [System.Drawing.Color]::FromArgb(255, 220, 220, 220); " & _
         "$colTextDim = [System.Drawing.Color]::FromArgb(255, 120, 120, 120); " & _
         "$colAccent = [System.Drawing.Color]::FromArgb(255, 128, 128, 128); " & _
         "$colOnline = [System.Drawing.Color]::FromArgb(255, 255, 255, 255); " & _
         "$colOffline = [System.Drawing.Color]::FromArgb(255, 80, 80, 80); " & _
         "$colError = [System.Drawing.Color]::FromArgb(255, 255, 100, 100); " & _
         "$colHover = [System.Drawing.Color]::FromArgb(255, 45, 45, 45); " & _
         "" & _
         "$script:matrixChars = 'KEIRA01'; " & _
         "$script:columns = @(); $script:drops = @(); $script:matrixBmp = $null; $script:matrixGfx = $null; " & _
         "$script:notifyIcon = $null; " & _
         "" & _
         "function Init-Matrix { $w = $script:matrixPanel.Width; $h = $script:matrixPanel.Height; $cols = [Math]::Floor($w / 14); $script:columns = @(0..$cols); $script:drops = @(); for ($i = 0; $i -le $cols; $i++) { $script:drops += Get-Random -Minimum 0 -Maximum 40 }; $script:matrixBmp = New-Object System.Drawing.Bitmap($w, $h); $script:matrixGfx = [System.Drawing.Graphics]::FromImage($script:matrixBmp); $script:matrixGfx.SmoothingMode = 'AntiAlias' }; " & _
         "" & _
         "function Draw-Matrix { if ($null -eq $script:matrixGfx) { return }; " & _
         "$script:matrixGfx.Clear([System.Drawing.Color]::FromArgb(255,5,5,5)); " & _
         "$font = New-Object System.Drawing.Font('Consolas', 11); " & _
         "for ($i = 0; $i -lt $script:drops.Count; $i++) { " & _
         "$char = $script:matrixChars[(Get-Random -Minimum 0 -Maximum $script:matrixChars.Length)]; " & _
         "$x = $i * 14; $y = $script:drops[$i] * 16; " & _
         "$brightness = Get-Random -Minimum 30 -Maximum 120; " & _
         "$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, $brightness, $brightness, $brightness)); " & _
         "$script:matrixGfx.DrawString($char, $font, $brush, $x, $y); $brush.Dispose(); " & _
         "if ($script:drops[$i] * 16 -gt $script:matrixBmp.Height -and (Get-Random -Minimum 0 -Maximum 100) -gt 96) { $script:drops[$i] = 0 } else { $script:drops[$i]++ } }; " & _
         "$font.Dispose(); $script:matrixPanel.BackgroundImage = $script:matrixBmp }; " & _
         "" & _
         "function Test-PortInUse { param([int]$Port); $c = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue; return $null -ne $c }; " & _
         "function Show-Notification { param([string]$Title, [string]$Message); if ($script:notifyIcon) { $script:notifyIcon.BalloonTipTitle = $Title; $script:notifyIcon.BalloonTipText = $Message; $script:notifyIcon.BalloonTipIcon = 'Info'; $script:notifyIcon.ShowBalloonTip(3000) } }; " & _
         "function Get-GitStatus { try { $branch = git -C $projectPath rev-parse --abbrev-ref HEAD 2>$null; $changes = (git -C $projectPath status --porcelain 2>$null | Measure-Object).Count; if ($branch) { return @{Branch=$branch; Changes=$changes} } } catch {}; return $null }; " & _
         "" & _
         "function Start-Frontend { if (Test-PortInUse $FRONTEND_PORT) { [System.Windows.Forms.MessageBox]::Show('Frontend already running', 'Info', 'OK', 'Information'); return }; $script:statusLabel.Text = 'Starting Frontend...'; $form.Refresh(); Start-Process cmd -ArgumentList '/k pnpm dev' -WorkingDirectory $projectPath -WindowStyle Minimized; Show-Notification 'KEIRA' 'Frontend starting...' }; " & _
         "function Start-Backend { if (Test-PortInUse $BACKEND_PORT) { [System.Windows.Forms.MessageBox]::Show('Backend already running', 'Info', 'OK', 'Information'); return }; $script:statusLabel.Text = 'Starting Backend...'; $form.Refresh(); Start-Process cmd -ArgumentList '/k python -m uvicorn api.main:app --reload --port 8002' -WorkingDirectory $projectPath -WindowStyle Minimized; Show-Notification 'KEIRA' 'Backend starting...' }; " & _
         "function Start-All { $script:statusLabel.Text = 'Starting servers...'; $form.Refresh(); Start-Backend; Start-Frontend; Show-Notification 'KEIRA' 'Starting all servers...' }; " & _
         "function Stop-All { $stopped = @(); @($FRONTEND_PORT, $BACKEND_PORT) | ForEach-Object { $c = Get-NetTCPConnection -LocalPort $_ -State Listen -ErrorAction SilentlyContinue; if ($c) { Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue; $stopped += $_ } }; if ($stopped.Count -gt 0) { $script:statusLabel.Text = 'Stopped: ' + ($stopped -join ', '); Show-Notification 'KEIRA' 'Servers stopped' } else { $script:statusLabel.Text = 'No active servers' } }; " & _
         "" & _
         "function Update-Status { " & _
         "try { $fe = Test-PortInUse $FRONTEND_PORT } catch { $fe = $false }; " & _
         "try { $be = Test-PortInUse $BACKEND_PORT } catch { $be = $false }; " & _
         "$script:btnFrontend.Text = '  ' + $(if ($fe) { $dotOn } else { $dotOff }) + '  Frontend'; " & _
         "$script:btnBackend.Text = '  ' + $(if ($be) { $dotOn } else { $dotOff }) + '  Backend'; " & _
         "$script:btnFrontend.ForeColor = if ($fe) { $colOnline } else { $colTextDim }; " & _
         "$script:btnBackend.ForeColor = if ($be) { $colOnline } else { $colTextDim }; " & _
         "$script:lblFE.Text = $(if ($fe) { $dotOn } else { $dotOff }) + '  Frontend  :' + $FRONTEND_PORT; " & _
         "$script:lblFE.ForeColor = if ($fe) { $colOnline } else { $colOffline }; " & _
         "$script:lblBE.Text = $(if ($be) { $dotOn } else { $dotOff }) + '  Backend   :' + $BACKEND_PORT; " & _
         "$script:lblBE.ForeColor = if ($be) { $colOnline } else { $colOffline }; " & _
         "try { $git = Get-GitStatus; if ($git) { $script:lblGit.Text = $branch + ' ' + $git.Branch + '  (' + $git.Changes + ' changes)'; $script:lblGit.ForeColor = if ($git.Changes -gt 0) { $colAccent } else { $colTextDim } } else { $script:lblGit.Text = $branch + ' git: n/a'; $script:lblGit.ForeColor = $colOffline } } catch { $script:lblGit.Text = $branch + ' git: error'; $script:lblGit.ForeColor = $colOffline }; " & _
         "$online = @($fe, $be) | Where-Object { $_ } | Measure-Object | Select-Object -ExpandProperty Count; " & _
         "$script:statusLabel.Text = 'Online: ' + $online + '/2' }; " & _
         "" & _
         "$form = New-Object System.Windows.Forms.Form; " & _
         "$form.Text = 'KEIRA - Watermark Remover'; " & _
         "$form.Size = New-Object System.Drawing.Size(360, 580); " & _
         "$form.StartPosition = 'CenterScreen'; " & _
         "$form.FormBorderStyle = 'FixedSingle'; " & _
         "$form.MaximizeBox = $false; " & _
         "$form.BackColor = $colBg; " & _
         "" & _
         "function New-GlassPanel { param([int]$Y, [int]$H); " & _
         "$p = New-Object System.Windows.Forms.Panel; " & _
         "$p.Size = New-Object System.Drawing.Size(320, $H); " & _
         "$p.Location = New-Object System.Drawing.Point(15, $Y); " & _
         "$p.BackColor = $colBgPanel; return $p }; " & _
         "" & _
         "function New-GlassBtn { param([string]$Text, [int]$Y, [int]$W = 296, [int]$X = 12); " & _
         "$b = New-Object System.Windows.Forms.Button; " & _
         "$b.Text = $Text; $b.Size = New-Object System.Drawing.Size($W, 34); " & _
         "$b.Location = New-Object System.Drawing.Point($X, $Y); " & _
         "$b.Font = New-Object System.Drawing.Font('Segoe UI', 10); " & _
         "$b.FlatStyle = 'Flat'; " & _
         "$b.FlatAppearance.BorderColor = $colBorder; $b.FlatAppearance.BorderSize = 1; " & _
         "$b.FlatAppearance.MouseOverBackColor = $colHover; " & _
         "$b.BackColor = $colBgBtn; $b.ForeColor = $colText; " & _
         "$b.Cursor = 'Hand'; $b.TextAlign = 'MiddleLeft'; return $b }; " & _
         "" & _
         "function New-Sep { param([int]$Y); $s = New-Object System.Windows.Forms.Panel; " & _
         "$s.Size = New-Object System.Drawing.Size(296, 1); " & _
         "$s.Location = New-Object System.Drawing.Point(12, $Y); " & _
         "$s.BackColor = $colBorder; return $s }; " & _
         "" & _
         "function New-Lbl { param([string]$Text, [int]$Y); $l = New-Object System.Windows.Forms.Label; " & _
         "$l.Text = $Text; $l.Font = New-Object System.Drawing.Font('Segoe UI', 9, [System.Drawing.FontStyle]::Bold); " & _
         "$l.ForeColor = $colTextDim; $l.AutoSize = $true; " & _
         "$l.Location = New-Object System.Drawing.Point(12, $Y); return $l }; " & _
         "" & _
         "$script:notifyIcon = New-Object System.Windows.Forms.NotifyIcon; " & _
         "$script:notifyIcon.Icon = [System.Drawing.SystemIcons]::Application; " & _
         "$script:notifyIcon.Text = 'KEIRA Watermark Remover'; $script:notifyIcon.Visible = $true; " & _
         "$cm = New-Object System.Windows.Forms.ContextMenuStrip; " & _
         "$cm.BackColor = $colBgPanel; $cm.ForeColor = $colText; " & _
         "$cm.Items.Add('Show').Add_Click({ $form.Show(); $form.WindowState = 'Normal' }); " & _
         "$cm.Items.Add('Start All').Add_Click({ Start-All }); " & _
         "$cm.Items.Add('Stop All').Add_Click({ Stop-All }); " & _
         "$cm.Items.Add('-'); " & _
         "$cm.Items.Add('Exit').Add_Click({ $form.Close() }); " & _
         "$script:notifyIcon.ContextMenuStrip = $cm; " & _
         "$script:notifyIcon.Add_DoubleClick({ $form.Show(); $form.WindowState = 'Normal' }); " & _
         "$form.Add_Resize({ if ($form.WindowState -eq 'Minimized') { $form.Hide(); Show-Notification 'KEIRA' 'Minimized to tray' } }); " & _
         "" & _
         "$pH = New-GlassPanel -Y 10 -H 100; " & _
         "$script:matrixPanel = New-Object System.Windows.Forms.Panel; " & _
         "$script:matrixPanel.Size = New-Object System.Drawing.Size(320, 100); " & _
         "$script:matrixPanel.Location = New-Object System.Drawing.Point(0, 0); " & _
         "$script:matrixPanel.BackColor = [System.Drawing.Color]::Black; " & _
         "$pH.Controls.Add($script:matrixPanel); " & _
         "$tLbl = New-Object System.Windows.Forms.Label; $tLbl.Text = 'KEIRA'; " & _
         "$tLbl.Font = New-Object System.Drawing.Font('Segoe UI Light', 26); " & _
         "$tLbl.ForeColor = $colText; $tLbl.BackColor = [System.Drawing.Color]::Transparent; " & _
         "$tLbl.AutoSize = $true; $tLbl.Location = New-Object System.Drawing.Point(110, 20); " & _
         "$pH.Controls.Add($tLbl); $tLbl.BringToFront(); " & _
         "$vLbl = New-Object System.Windows.Forms.Label; $vLbl.Text = 'AI Watermark Remover v2.0'; " & _
         "$vLbl.Font = New-Object System.Drawing.Font('Segoe UI', 9); " & _
         "$vLbl.ForeColor = $colTextDim; $vLbl.AutoSize = $true; " & _
         "$vLbl.Location = New-Object System.Drawing.Point(85, 65); " & _
         "$pH.Controls.Add($vLbl); $vLbl.BringToFront(); " & _
         "$form.Controls.Add($pH); " & _
         "" & _
         "$pS = New-GlassPanel -Y 120 -H 160; " & _
         "$pS.Controls.Add((New-Lbl -Text 'SERVERS' -Y 10)); " & _
         "$bStart = New-GlassBtn -Text ('  ' + $play + '  Start All  (Frontend + Backend)') -Y 35; " & _
         "$bStart.ForeColor = $colAccent; $bStart.FlatAppearance.BorderColor = $colAccent; " & _
         "$bStart.Add_Click({ Start-All }); " & _
         "$pS.Controls.Add($bStart); " & _
         "$pS.Controls.Add((New-Sep -Y 78)); " & _
         "$script:btnFrontend = New-GlassBtn -Text ('  ' + $dotOff + '  Frontend') -Y 88; " & _
         "$script:btnFrontend.Add_Click({ Start-Frontend }); " & _
         "$pS.Controls.Add($script:btnFrontend); " & _
         "$script:btnBackend = New-GlassBtn -Text ('  ' + $dotOff + '  Backend') -Y 125; " & _
         "$script:btnBackend.Add_Click({ Start-Backend }); " & _
         "$pS.Controls.Add($script:btnBackend); " & _
         "$form.Controls.Add($pS); " & _
         "" & _
         "$pStop = New-GlassPanel -Y 290 -H 55; " & _
         "$bStop = New-GlassBtn -Text ('  ' + $stop + '  Stop All Servers') -Y 10; " & _
         "$bStop.ForeColor = $colError; $bStop.FlatAppearance.BorderColor = $colError; " & _
         "$bStop.Add_Click({ Stop-All }); " & _
         "$pStop.Controls.Add($bStop); " & _
         "$form.Controls.Add($pStop); " & _
         "" & _
         "$pB = New-GlassPanel -Y 355 -H 80; " & _
         "$pB.Controls.Add((New-Lbl -Text 'OPEN IN BROWSER' -Y 10)); " & _
         "$bFE = New-GlassBtn -Text ($globe + ' Frontend') -Y 35 -W 143 -X 12; " & _
         "$bFE.Font = New-Object System.Drawing.Font('Segoe UI', 9); " & _
         "$bFE.TextAlign = 'MiddleCenter'; " & _
         "$bFE.Add_Click({ Start-Process 'http://localhost:5175' }); " & _
         "$pB.Controls.Add($bFE); " & _
         "$bBE = New-GlassBtn -Text ($globe + ' API Docs') -Y 35 -W 143 -X 161; " & _
         "$bBE.Font = New-Object System.Drawing.Font('Segoe UI', 9); " & _
         "$bBE.TextAlign = 'MiddleCenter'; " & _
         "$bBE.Add_Click({ Start-Process 'http://localhost:8002/docs' }); " & _
         "$pB.Controls.Add($bBE); " & _
         "$form.Controls.Add($pB); " & _
         "" & _
         "$pSt = New-GlassPanel -Y 445 -H 100; " & _
         "$pSt.Controls.Add((New-Lbl -Text 'STATUS' -Y 8)); " & _
         "$script:lblFE = New-Object System.Windows.Forms.Label; " & _
         "$script:lblFE.Text = $dotOff + '  Frontend  :5175'; " & _
         "$script:lblFE.Font = New-Object System.Drawing.Font('Consolas', 10); " & _
         "$script:lblFE.ForeColor = $colOffline; $script:lblFE.AutoSize = $true; " & _
         "$script:lblFE.Location = New-Object System.Drawing.Point(12, 30); " & _
         "$pSt.Controls.Add($script:lblFE); " & _
         "$script:lblBE = New-Object System.Windows.Forms.Label; " & _
         "$script:lblBE.Text = $dotOff + '  Backend   :8002'; " & _
         "$script:lblBE.Font = New-Object System.Drawing.Font('Consolas', 10); " & _
         "$script:lblBE.ForeColor = $colOffline; $script:lblBE.AutoSize = $true; " & _
         "$script:lblBE.Location = New-Object System.Drawing.Point(12, 50); " & _
         "$pSt.Controls.Add($script:lblBE); " & _
         "$pSt.Controls.Add((New-Sep -Y 73)); " & _
         "$script:lblGit = New-Object System.Windows.Forms.Label; " & _
         "$script:lblGit.Text = $branch + ' checking...'; " & _
         "$script:lblGit.Font = New-Object System.Drawing.Font('Segoe UI', 9); " & _
         "$script:lblGit.ForeColor = $colTextDim; $script:lblGit.AutoSize = $true; " & _
         "$script:lblGit.Location = New-Object System.Drawing.Point(12, 78); " & _
         "$pSt.Controls.Add($script:lblGit); " & _
         "$script:statusLabel = New-Object System.Windows.Forms.Label; " & _
         "$script:statusLabel.Text = 'Online: 0/2'; " & _
         "$script:statusLabel.Font = New-Object System.Drawing.Font('Segoe UI', 9); " & _
         "$script:statusLabel.ForeColor = $colTextDim; $script:statusLabel.AutoSize = $true; " & _
         "$script:statusLabel.Location = New-Object System.Drawing.Point(200, 78); " & _
         "$pSt.Controls.Add($script:statusLabel); " & _
         "$form.Controls.Add($pSt); " & _
         "" & _
         "$timer = New-Object System.Windows.Forms.Timer; $timer.Interval = 2000; " & _
         "$timer.Add_Tick({ Update-Status }); $timer.Start(); " & _
         "$matrixTimer = New-Object System.Windows.Forms.Timer; $matrixTimer.Interval = 100; " & _
         "$matrixTimer.Add_Tick({ Draw-Matrix }); " & _
         "$form.Add_Shown({ Init-Matrix; $matrixTimer.Start() }); " & _
         "$form.Add_FormClosing({ $script:notifyIcon.Visible = $false; $script:notifyIcon.Dispose() }); " & _
         "Update-Status; [void]$form.ShowDialog(); $timer.Stop(); $matrixTimer.Stop(); " & _
         "if ($script:matrixGfx) { $script:matrixGfx.Dispose() }; if ($script:matrixBmp) { $script:matrixBmp.Dispose() }"

WshShell.Run "powershell -ExecutionPolicy Bypass -WindowStyle Hidden -Command """ & psCode & """", 0, False

Set WshShell = Nothing
Set fso = Nothing
