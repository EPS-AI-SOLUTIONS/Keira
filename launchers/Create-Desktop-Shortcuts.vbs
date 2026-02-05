' ============================================
' CREATE DESKTOP SHORTCUTS
' Tworzy skroty na pulpicie dla Keira
' v2.0.0 - Regis Architecture
' ============================================

Option Explicit

Dim WshShell, fso, desktopPath, projectPath, shortcut
Dim scriptPath, launchersPath, iconPath, createdCount

Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Get paths
desktopPath = WshShell.SpecialFolders("Desktop")
scriptPath = fso.GetParentFolderName(WScript.ScriptFullName)
projectPath = fso.GetParentFolderName(scriptPath)
launchersPath = projectPath & "\launchers"

' Check if custom icon exists, fallback to system icon
iconPath = projectPath & "\public\keira.ico"
If Not fso.FileExists(iconPath) Then
    iconPath = "%SystemRoot%\System32\shell32.dll,14"
End If

createdCount = 0
On Error Resume Next

' ============================================
' SHORTCUT 1: Keira Launcher (PowerShell GUI)
' ============================================
Set shortcut = WshShell.CreateShortcut(desktopPath & "\Keira Launcher.lnk")
shortcut.TargetPath = "wscript.exe"
shortcut.Arguments = """" & launchersPath & "\Keira-GUI.vbs"""
shortcut.WorkingDirectory = projectPath
shortcut.Description = "Keira - AI Watermark Remover"
shortcut.IconLocation = iconPath
shortcut.WindowStyle = 1
shortcut.Save
If Err.Number = 0 Then createdCount = createdCount + 1
Err.Clear

' ============================================
' SHORTCUT 2: Stop All Servers
' ============================================
Set shortcut = WshShell.CreateShortcut(desktopPath & "\Stop Keira.lnk")
shortcut.TargetPath = "wscript.exe"
shortcut.Arguments = """" & launchersPath & "\Stop-All.vbs"""
shortcut.WorkingDirectory = projectPath
shortcut.Description = "Zatrzymaj wszystkie serwery Keira"
shortcut.IconLocation = "%SystemRoot%\System32\shell32.dll,131"
shortcut.WindowStyle = 7
shortcut.Save
If Err.Number = 0 Then createdCount = createdCount + 1
Err.Clear

On Error GoTo 0

' Summary
If createdCount > 0 Then
    MsgBox "Utworzono " & createdCount & " skrotow na pulpicie!" & vbCrLf & vbCrLf & _
           "Dostepne skroty:" & vbCrLf & _
           "  - Keira Launcher (Menu)" & vbCrLf & _
           "  - Stop Keira (Cleanup)", _
           vbInformation, "KEIRA - Shortcuts"
Else
    MsgBox "Nie udalo sie utworzyc skrotow!" & vbCrLf & _
           "Sprawdz uprawnienia do pulpitu.", _
           vbExclamation, "Blad"
End If

Set shortcut = Nothing
Set fso = Nothing
Set WshShell = Nothing
