# 安装tree-node-cli 
`npm install -g tree-node-cli`

# 忽略文件夹
`tree -I "node_modules"`

# 只看三级目录
`tree -L 3`

# 使用实例 Note: Use the command treee on Windows and Linux to avoid conflicts with built-in tree command.
```
tree [options]
treee -L 3  -I "node_modules|.idea|objects|.git" -a --dirs-first
```

# 卸载
`npm uninstall -g tree-node-cli`