
## 运行 

```shell
git clone https://github.com/hugoOrange/aServer.git
cd aServer
npm install
# linux/mac 环境下启动
npm run lserve
# windows 环境下启动
npm run wserve
```

## nginx 配置

增加如下nginx配置
```conf
{
    server {
        listen 8482;
        server_name loclhost;

        location /pmp/service {
            proxy_pass http://localhost:4553/service;
        }
    }
}
```

## 配置返回数据

在`mock/module/`目录下新增一个模块目录`myRequest`，在目录下新增文件`myRequest.json`:
```json
[
    {
        "url": "/service/province/config/region/all/440000",
        "m": "get",
        "req": {},
        "res": {}
    },
    {
        "url": "/service/province/config/region/all/440000",
        "m": "get",
        "req": {},
        "res": {}
    },
    {
        "url": "/service/province/config/region/all/440000",
        "m": "get",
        "req": [
            {
                "reqA": 1
            },
            {
                "reqB": 2
            }
        ],
        "res": [
            {
                "resForReqA": 1
            },
            {
                "resForReqB": 2
            }
        ]
    }
]
```
其中各个字段的含义如下:
 - `url` 请求的路径
 - `m` 请求的http方法: *`get`*或*`post`*
 - `req` 请求发送的参数
   - 当为非数组对象时，`res`也应为对象，并且与`res`对应
   - 当为数组时，`res`也应为数组，并且数组的每一个元素即为一个请求，响应与`res`的每一个元素一一对应
 - `res`　请求响应的参数

然后在`mock/index.js`文件里面添加对应的文件路径:
```javascript
/**
 * 模拟数据的存放路径
 */
const MOCK_PATH = [
    './module/common/region.json',
    './module/case_center/mock.json',
    
    // 在下面这里添加模拟数据的文件路径
    './module/myRequest/myRequest.json'
];
```