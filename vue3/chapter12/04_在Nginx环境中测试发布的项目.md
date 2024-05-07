# 04.在 Nginx 环境中测试发布的项目

虽然在本地可以利用serve、http-server、live-server等本地服务器进行快速的发布项目测试，也可以利用nodejs与express等框架配合进行服务器模式的尝试，但一般正式平台上线在真正服务器环境中却不会使用之前这几种操作模式。因为在正式的服务器环境中需要考虑的内容会更多，比如说平台用户的并发数的支撑、高效请求的处理、GZip压缩的支持、反向代理的实现等等。这些更为专业复杂的需求想让serve等本地静态服务器模块实现本身是一件不太现实的事，而如果想利用Node与express等不同的框架进行环境构建也不一定有那样专业的技术知识，并且在正式服务器上还得考虑后台程序是否是nodejs构建，如果是Java、Php、Python等其它的后台程序语言，那么使用nodejs进行服务器环境构建也可能造成得不尝失的结果。根据诸多综合因素的影响，在企业级需求的正式服务器环境下想要将已经完成的vue项目进行上线发布，可以考虑像apache、nginx等更为专业的web服务器构建工具。

其实在服务器环境中配置apache、nginx这样的web服务器构建工具有专门的岗位进行负责，通常可以交由运维工程师完成，在实际工作中并不需要前端开发人员过多的介入，但如果前端人员能够了解一些最为基础的服务器环境的配置对项目开发过程中的项目配置也会起一定的帮助，就像之前提及过的根级目录发布模式以及二级目录发布模式的问题前端开发配置与服务器环境配置就有一定的关联关系。

准备工作是：对于当前的项目仍旧可以先运行`npm run build`进行项目的生产环境打包构建，这时可以确认dist目录的生成，并且环境配置的结果是根级目录的发布模式。

接下来将以nginx这一工具为示例进行服务器端环境的配置测试。那么首先得理解nginx是什么？nginx(engine x) 是一个高性能的HTTP和反向代理web服务器，同时也提供了IMAP/POP3/SMTP服务。Nginx是由伊戈尔·赛索耶夫为俄罗斯访问量第二的Rambler.ru站点（俄文：Рамблер）开发的，从2004年10月4号发布第一个版本开始至今已经发展了近20年，所以该工具已经逐步强大与完善。它提供了基础的静态资源服务器功能，还有反向代理、负载均衡、Gzip 压缩等众多的扩展功能。它还具有高效的并发支持能力，能够同时承载的并发数少说也有几万，这是很不错的一个表现。它的官方网站地址为：https://www.nginx.com，可以访问与下载。

其次，对于nginx可能需要了解它的运行与常见的操作命令，最为常用的主要包括：

- 查看 Nginx 的版本号：nginx -V
- 启动 Nginx：nginx
- 快速停止或关闭 Nginx：nginx -s stop
- 正常停止或关闭 Nginx：nginx -s quit
- 配置文件修改重装载命令：nginx -s reload

注意：以上指令都需要来到 nginx 目录下执行，执行指令的整个 nginx 目录都不能有任何特殊字符和中文。

接下来在下载nginx工具以后需要确认其目录结构，主要包括：conf：配置目录、contrib：发布版本目录、docs：文档目录、html：默认的静态资源目录、logs：日志目录、temp：临时文件目录。

![image-20220826101640707](http://qn.chinavanes.com/qiniu_picGo/image-20220826101640707.png)

对于当前vue项目在nginx中运行测试的目标，主要涉及到的无非是conf目录下的nginx.conf配置文件，如果已经将vue的发布项目放置于F:\vue-project-publish\dist目录下，那么在nginx.conf中主要设置需要改的位置就是http节点下server服务器相关的location位置里root根目录地址的设置，我们只需要将其设置为vue打包构建的dist发行版本目录就可以了。因为现在将其项目设置的端口为5000，所以只需要打开`http://localhost:5000`就可以查看到vue项目的具体页面。

nginx.conf

```bash
worker_processes  1;
events {
    worker_connections  1024;
}
http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;
    server {
        listen       5000; # 设置项目起动的端口
        server_name  localhost; # 设置服务器的名称
        location / {
            root   F:\vue-project-publish\dist; # 确认项目的起始目录
            index  index.html index.htm; # 设置项目默认页面名称与类型
        }
    }
}
```

同样道理，因为当前项目是根级目录结构形式，所以直接指向的是dist目录，但如果vue项目是利用`npm run test`进行测试打包并指定了二级基础目录dist，那么只需要在nginx.conf配置文件中将刚才所提示的root根目录节点属性进行修改，直接修改为F:\vue-project-publish即可，这样的话直接访问`http://localhost:5000`这个根级路径是无法查看到vue的项目结果，只有访问`http://localhost:5000/dist`这一二级目录路径才可以正常访问vue的项目结果。
