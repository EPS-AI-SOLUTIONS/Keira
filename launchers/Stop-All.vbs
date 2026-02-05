' ============================================
' KEIRA - Stop All Servers
' Szybkie zatrzymanie wszystkich serwerow
' v2.0.0 - Regis Architecture
' ============================================

Option Explicit

Dim WshShell, fso, execObj, projectPath, scriptPath

Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

scriptPath = fso.GetParentFolderName(WScript.ScriptFullName)
projectPath = fso.GetParentFolderName(scriptPath)

' Porty serwerow Keira
Const FRONTEND_PORT = 5175
Const BACKEND_PORT = 8002

' ============================================
' FUNKCJE
' ============================================

Function IsPortInUse(port)
    Dim output
    On Error Resume Next
    Set execObj = WshShell.Exec("cmd /c netstat -ano | findstr :" & port & " | findstr LISTENING")
    output = execObj.StdOut.ReadAll()
    IsPortInUse = (Len(Trim(output)) > 0)
    On Error GoTo 0
End Function

Function GetPidOnPort(port)
    Dim output, lines, i, parts, pid, j, cleanLine
    On Error Resume Next
    Set execObj = WshShell.Exec("cmd /c netstat -ano | findstr :" & port & " | findstr LISTENING")
    output = execObj.StdOut.ReadAll()
    If Len(Trim(output)) > 0 Then
        lines = Split(output, vbCrLf)
        For i = 0 To UBound(lines)
            cleanLine = Trim(lines(i))
            If Len(cleanLine) > 0 Then
                Do While InStr(cleanLine, "  ") > 0
                    cleanLine = Replace(cleanLine, "  ", " ")
                Loop
                parts = Split(cleanLine, " ")
                For j = UBound(parts) To 0 Step -1
                    pid = Trim(parts(j))
                    If IsNumeric(pid) And CLng(pid) > 0 Then
                        GetPidOnPort = CLng(pid)
                        Exit Function
                    End If
                Next
            End If
        Next
    End If
    GetPidOnPort = 0
    On Error GoTo 0
End Function

Sub KillProcessOnPort(port)
    Dim pid, retries
    retries = 0
    Do
        pid = GetPidOnPort(port)
        If pid > 0 Then
            WshShell.Run "cmd /c taskkill /PID " & pid & " /F /T >nul 2>&1", 0, True
            WScript.Sleep 300
            retries = retries + 1
        Else
            Exit Do
        End If
    Loop While retries < 3 And IsPortInUse(port)
End Sub

' ============================================
' MAIN
' ============================================

Dim stopped, feStatus, beStatus

stopped = ""

feStatus = IsPortInUse(FRONTEND_PORT)
beStatus = IsPortInUse(BACKEND_PORT)

If Not feStatus And Not beStatus Then
    MsgBox "Wszystkie serwery sa juz wylaczone." & vbCrLf & vbCrLf & _
           "Frontend  :" & FRONTEND_PORT & " [ ] offline" & vbCrLf & _
           "Backend   :" & BACKEND_PORT & " [ ] offline", _
           vbInformation, "KEIRA - Stop All"
    WScript.Quit
End If

If feStatus Then
    KillProcessOnPort FRONTEND_PORT
    stopped = stopped & "  [X] Frontend  :" & FRONTEND_PORT & vbCrLf
End If

If beStatus Then
    KillProcessOnPort BACKEND_PORT
    stopped = stopped & "  [X] Backend   :" & BACKEND_PORT & vbCrLf
End If

MsgBox "SERWERY ZATRZYMANE" & vbCrLf & vbCrLf & stopped & vbCrLf & _
       "Wszystkie porty zostaly zwolnione.", _
       vbInformation, "KEIRA - Stop All"

Set WshShell = Nothing
Set fso = Nothing
