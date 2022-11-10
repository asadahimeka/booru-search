# booru

![npm](https://img.shields.io/npm/v/@himeka/booru.svg) ![GitHub](https://img.shields.io/github/license/asadahimeka/booru-search.svg) ![Typescript typings](https://img.shields.io/badge/Typings-Typescript-informational.svg)

[English](readme.md) | 中文

> _A node package to search boorus_
>
> _Booru 站点图片搜索 API_
>
> Forked from [AtoraSuunva/booru](https://github.com/AtoraSuunva/booru)

## 特性

- 搜索 20 个不同的 booru 站点（见 [sites.json](./src/sites.json)）
- 将所有接收到的数据标准化为一致的 `Post` 对象
- 也可以访问从 booru 接收的原始数据（从 XML 转换为 JSON，如果适用）
- 对 boorus 的别名支持（`sb` -> `safebooru.org`）
- Promises
- 类型（使用 Typescript）
- 选择要获取的图像数量
- 支持随机作品，在支持它的站点上使用 `order:random`，在不支持它的站点上使用自定义代码
- 支持 Node.js 与浏览器（在不跨域的情况下）

---

## 安装

```sh
npm i @himeka/booru
# 或
yarn add @himeka/booru
```

---

## 使用

```js
const Booru = require('@himeka/booru')

Booru.search('safebooru', ['glaceon'], { limit: 3, random: true }).then(
  posts => {
    for (let post of posts) console.log(post.fileUrl, post.postView)
  },
)

// or (using alias support and creating boorus)
const sb = Booru.forSite('sb')

sb.search(['cat', 'dog'], { limit: 2 })
```

详见 [example.js](./example.js)

---

## 文档

点击查看: [docs](https://asadahimeka.github.io/booru-search)

## 浏览器支持

booru 主要是为 Node.js 构建的，浏览器支持可能有限。
可以使用 webpack（或类似工具）在 web 上使用 booru，尽管体验可能会有所不同。
某些网站没有正确的 CORS 标头，这意味着从浏览器对这些网站的 API 请求将失败，需要自行解决跨域问题。

## FAQ

### `Post` 有什么属性？

`Post` 的基本结构如下:

```js
Post {
  _data: {/*...*/},                       // 站点 API 返回的原始数据
  fileUrl: 'https://aaaa.com/img.jpg',    // 作品的原文件（大图）链接
  id: '124125',                           // 作品 ID
  tags: ['cat', 'cute'],                  // 作品标签，以数组表示
  score: 5,                               // 作品的评分
  source: 'https://ex.com/aaa.png',       // 作品的来源链接（Pixiv、Twitter 等，如果有的话）
  rating: 's',                            // 作品的分级（R18、存疑、安全）
  createdAt: Date,                        // 作品创建日期
  postView: 'https://booru.ex/show/12345' // 作品的站点详情页面
}
```

`s`: 'Safe'
`q`: 'Questionable'
`e`: 'Explicit'
`u`: 'Unrated'

Derpibooru 会有 `Safe, Suggestive, Questionable, Explicit`,  `Suggestive` 会在 `<Post>.rating` 显示为`q`

### Why?

Why not?

### License?

[It's MIT](https://choosealicense.com/licenses/mit/)
