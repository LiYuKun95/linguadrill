#!/bin/bash
# GitHub 上传脚本

cd "$(dirname "$0")"

echo "=================================="
echo "  LinguaDrill GitHub 上传脚本"
echo "=================================="
echo ""

# 检查 git remote
if ! git remote -v | grep -q origin; then
    echo "[1/4] 设置远程仓库..."
    read -p "请输入你的 GitHub 仓库地址 (例如: https://github.com/LiYuKun95/linguadrill.git): " REPO_URL
    git remote add origin "$REPO_URL"
else
    echo "[1/4] 远程仓库已设置"
fi

echo ""
echo "[2/4] 检查文件状态..."
git status

echo ""
echo "[3/4] 提交更改..."
git add .
git commit -m "Update: LinguaDrill MVP"

echo ""
echo "[4/4] 推送到 GitHub..."
git push -u origin master

echo ""
echo "=================================="
echo "  完成！"
echo "=================================="
echo ""
echo "访问你的仓库: https://github.com/LiYuKun95/linguadrill"
echo ""
echo "Cloudflare Pages 会自动检测并部署！"