# One2X 电通大会报告：完整可重建源码

GitHub 保存全部报告、图片、字体及本地视频原始字节。超过4 MiB的文件按原字节顺序分段，存于 .asset-chunks/<原文件SHA256>/<序号>.part。分段不代表媒体缺失；没有压缩、转码或改动原文件内容。

asset-manifest.json 记录所有逻辑文件的原相对路径、字节数、SHA256、MIME及类型。chunk-manifest.json 记录大文件的顺序片段、字节数及每段校验。

要求 Node.js 22 或更新版本，无第三方依赖，无需联网。运行 npm run build 将所有原始文件还原至 dist/，流式拼接且验证每段及每个完整逻辑文件的SHA256。运行 npm run verify 可独立重新读取全部dist文件并核查字节数、SHA256及精确文件集合。

Menv 配置：medeo.json 中 build.shape=static、build.root=.、build.output=dist。构建命令 npm run build，发布目录 dist，入口 dist/index.html。必须先构建再部署，源码中的分段布局会还原成正常原路径。

本快照重新扫描冻结的最新报告，包含KAIROS Claude完善版11镜、新增逐帧图片、当前兼容视频播放引用和最新阅读说明。原交付目录未改动。根旧构建工具、旧manifest、Git元数据、dist、node_modules及ZIP/tar压缩包不收录为逻辑内容。

## 无损压缩分段

大文件的4 MiB原始片段逐片尝试gzip；仅压缩后更小时保存为 .part.gz，否则保留 .part。chunk-manifest.json v2 的每片 path/size/sha256 对应GitHub中实际存储字节，encoding为gzip或raw；decodedSize/decodedSha256对应原始片段字节。npm run build 流式解压并按原顺序拼接，同时核查存储片段、解压片段和完整逻辑文件；npm run verify 再独立复核dist。最终HTML、图片、视频和字体与原报告逐字节一致。所有源码物理文件仍不超过4 MiB。
