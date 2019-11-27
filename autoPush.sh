#!/usr/bin/env sh

# 终止一个错误
set -e

# 进入项目文件夹

# 如果你是要部署到自定义域名
# echo 'www.example.com' > CNAME
git add -A
git commit -m 'update note'

# 如果你想要部署到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果你想要部署到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:WeaklyChicken/HMC-VUEPRESS-NOTE.git master

cd -