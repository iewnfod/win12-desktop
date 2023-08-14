# 重新获取最新的核心代码
./configure.sh

echo "打包中..."
# 删除之前的打包结果
rm -rf ./dist
# 重新打包
npm run build
