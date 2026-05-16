@echo off
chcp 65001 >nul
title LinguaDrill GitHub Deploy

cd /d %~dp0

echo ================================================
echo        LinguaDrill GitHub 部署脚本
echo ================================================
echo.

echo [1/4] 检查 Git 状态...
git status
echo.

echo [2/4] 添加所有文件到暂存区...
git add .
echo.

echo [3/4] 提交更改...
git commit -m "Update: LinguaDrill MVP with vocabulary, patterns, shadowing, and progress tracking"
echo.

echo [4/4] 推送到 GitHub...
echo.
echo 请确保你已经在 GitHub 上创建了 linguadrill 仓库！
echo 仓库地址应该是: https://github.com/LiYuKun95/linguadrill
echo.
echo 如果仓库不存在，请先在 GitHub 上创建：
echo 1. 访问 https://github.com/new
echo 2. Repository name: linguadrill
echo 3. 选择 Public
echo 4. 不要勾选 Initialize this repository with a README
echo 5. 点击 Create repository
echo.
echo 然后按任意键继续推送...
pause >nul
echo.

git push -u origin master

echo.
echo ================================================
echo 完成！访问你的仓库:
echo https://github.com/LiYuKun95/linguadrill
echo ================================================
echo.
echo Cloudflare Pages 会自动检测并部署！
echo.
pause