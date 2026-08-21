@echo off
setlocal
cd /d "%~dp0"

echo === 正在提交并推送博客更新 ===

echo [1/4] 检查代理连接（Clash 7897）...
curl.exe -s -o NUL --connect-timeout 5 --proxy socks5h://127.0.0.1:7897 https://github.com
if errorlevel 1 (
    echo.
    echo [错误] 连不上代理 127.0.0.1:7897，请先打开 Clash 再重试。
    echo.
    pause
    exit /b 1
)

echo [2/4] 添加文件...
git add .
if errorlevel 1 (
    echo [错误] git add 失败，请把上方红色报错发给我。
    pause
    exit /b 1
)

set /p msg=请输入本次提交说明（直接回车则使用当前时间）: 
if "%msg%"=="" set "msg=update %date% %time%"

echo [3/4] 提交...
git commit -m "%msg%"
if errorlevel 1 echo [提示] 没有新改动可提交，继续尝试推送。

echo [4/4] 推送...
git push
if errorlevel 1 (
    echo.
    echo [错误] 推送失败，请把上方红色报错发给我，或检查：
    echo   1. Clash 代理是否已开启
    echo   2. 如果弹出账号密码：用户名填 GitHub 用户名，密码填个人访问令牌（PAT），不是网页登录密码
    echo.
    pause
    exit /b 1
)

echo.
echo === 完成，已成功推送到 GitHub ===
pause
