@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo === 正在提交并推送博客更新 ===
git add .

set /p msg=请输入本次提交说明（直接回车则使用当前时间）: 
if "%msg%"=="" set "msg=update %date% %time%"

git commit -m "%msg%"
git push

echo.
echo === 完成 ===
pause
