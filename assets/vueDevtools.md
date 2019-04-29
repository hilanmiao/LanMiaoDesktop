举个例子：如果你用了ipc,在这里打断点平常是跑不到的，加上devtools才可以。
```
ipcRenderer.on('getAutoStartValue', (event, result) => {
    this.autoStart = result
})
```

0.局部或全局安装
```
npm install -g @vue/devtools
npm install --save-dev @vue/devtools
```

详细信息可查看

https://github.com/vuejs/vue-devtools/blob/master/shells/electron/README.md

1.在vue前引入devtools
```
import devtools from '@vue/devtools'
import Vue from 'vue'
```

2.设置（暂时没用到）
```
if (process.env.NODE_ENV === 'development') {
    devtools.connect('localhost', '9080')
}
```

3.在index.ejs文件中添加
```
<script src="http://localhost:8098"></script>
```

4.执行cmd文件(有两个文件vue-devtools,vue-devtools.cmd，因为我是windows，所以找到文件位置直接双击运行即可)
```
./node_modules/.bin/vue-devtools.cmd
```
