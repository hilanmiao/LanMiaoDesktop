# 安装tree-cli 
`npm install -g tree-cli`

# 忽略文件夹
`tree -I "node_modules"`

# 只看两级目录
`tree -L 2`

# 使用实例 Note: Use the command treee on Windows and Linux to avoid conflicts with built-in tree command.
```
tree [options]
treee -l 2, -o assets/tree.txt --ignore [node_modules, test] -d --noreport
```
