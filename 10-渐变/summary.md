## 线性渐变

沿着执行进行颜色渐变，可以是横向、纵向、斜向。

1. 在 SVG 文件的 defs 元素内部，创建一个<linearGradient>节点，并添加 id 属性
2. 在<linearGradient>内编写几个<stop>节点

- 给<stop> 结点指定位置 offset属性和 颜色stop-color属性，用来指定渐变在特定的位置上应用什么颜色 
- `**offset**` 和 `**stop-color**` 这两个属性值，也可以通过 CSS 来指定
- 也可通过 `**stop-opacity** `来设置某个位置的半透明度

1. 在一个元素的 **fill** 属性或 **stroke** 属性中通过ID来引用 <linearGradient> 节点

- 属性fill属性设置为url( #Gradient2 )即可
- 控制渐变方向，通过 (x1, y1) 和 (x2, y2) 两个点控制

- x y 位置用**百分比**设置，x是width的百分比 ， y是height的百分比。

![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1741239011679-9368016f-a9d8-44df-a226-af0beb085577.png)

```xml
<svg width="400" height="400" viewBox="0 0 100 100">
  <defs>
    <linearGradient
      id="linearGradient1"
      x1="0%"
      y1="0%"
      x2="100%"
      y2="0%"
    >
      <stop offset="0%" stop-color="rgb(255,0,0)" />
      <stop offset="100%" stop-color="rgb(255,255,0)" />
    </linearGradient>
  </defs>
  <rect x="10" y="10" width="80" height="40" fill="url(#linearGradient1)"></rect>
</svg>
```

![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1741229153216-48676a38-2168-4e3f-9d21-a4c9288e011c.png)

```xml
 <!-- 从上到下渐变 -->
<linearGradient
  id="linearGradient2"
  x1="0%"
  y1="0%"
  x2="0%"
  y2="100%"
>
  <!-- ... -->
</linearGradient>

<!-- 从左上到右下的渐变 -->
<linearGradient
  id="linearGradient3"
  x1="0%"
  y1="0%"
  x2="100%"
  y2="100%"
>
  <!-- ... -->
</linearGradient>
```

**设置线性坐标点时，不一定非要从头到尾（0 or 100%) , 如果设置了中间数值，就在中间位置渐变。**

**两边就是起始和终止的颜色。**

```xml
<svg width="400" height="400" viewBox="0 0 100 100">
  <defs>
    <linearGradient
      id="linearGradient4"
      x1="0%"
      y1="0%"
      x2="100%"
      y2="0%"
    >
      <stop offset="0%" stop-color="rgb(255,0,0)" />
      <stop offset="60%" stop-color="rgb(0,255,0)" />
      <stop offset="100%" stop-color="rgb(255,255,0)" />
    </linearGradient>
  </defs>
  <rect x="10" y="10" width="80" height="40" fill="url(#linearGradient4)"></rect>
</svg>
```

![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1741229691114-0621154a-0405-476d-bca8-97a664f1dcff.png)

```xml
<svg width="400" height="400" viewBox="0 0 100 100">
  <defs>
    <linearGradient
      id="linearGradient5"
      x1="0%"
      y1="0%"
      x2="100%"
      y2="0%"
    >
    <stop offset="60%" stop-color="rgb(255,0,0)" />
    <stop offset="100%" stop-color="rgb(255,255,0)" />
  </linearGradient>
</defs>
<rect x="10" y="10" width="80" height="40" fill="url(#linearGradient5)"></rect>
</svg>
```

![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1741229745673-0ab13568-966c-474e-9c8c-0cefa23c07e6.png)

## 径向渐变

从一个起始点开始，从里向外圆形渐变，使用`<radialGradient>`标签定义径向渐变。

- 可以指定渐变的中心、起始半径和结束半径，以及渐变的颜色和位置。

默认情况下，当`<radialGradient>`没有设置任何定位属性时，结束圆将是填充对象。比如下图的五角星边框最大的圆，焦点（圆心）是其中心：

![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1741240100208-1cc52cc8-b41c-4773-8334-8af672ce5f2b.png)

```xml
<svg width="400" height="400" viewBox="0 0 100 100">
  <defs>
    <radialGradient id="radialGradient1">
      <stop offset="0%" stop-color="rgb(255,0,0)" />
      <stop offset="100%" stop-color="rgb(255,255,0)" />
    </radialGradient>
  </defs>
  <circle cx="30" cy="30" r="20" fill="url(#radialGradient1)"></circle>
  <rect x="50" y="50" width="30" height="30" fill="url(#radialGradient1)"></rect>
</svg>
```

![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1741230248038-5dfd11eb-54da-41ce-8d8d-622662924668.png)

**默认会在整个图形区域内进行渐变。**

**可以使用cx cy fr r来对渐变区域进行控制。**

- cx cy 定义原点位置
- fr 设置渐变起始位置圆的半径; fr没有设置，就是以原点向外渐变
- r 设置渐变终止位置圆的半径

cx、cy、r确定渐变圆轴的位置和大小。它们的默认值都是 `**50%**`，这会在图形边界框的坐标系统中创建一个居中的圆，填充整个宽度和高度。

```xml
<svg width="400" height="400" viewBox="0 0 100 100">
  <defs>
    <radialGradient id="radialGradient2" cx="50%" cy="50%" fr="20%" r="50%">
      <stop offset="0%" stop-color="rgb(255,0,0)" />
      <stop offset="100%" stop-color="rgb(255,255,0)" />
    </radialGradient>
  </defs>
  <circle cx="30" cy="30" r="20" fill="url(#radialGradient2)"></circle>
</svg>>
```

![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1741239643450-c10d9210-fe33-4a4b-ae20-025ecab0552c.png)

除此之外，还有fx与fy属性。

cx ，cy ， r , fr 用来控制渐变的区域，fx与fy是用来控制从哪个位置开始进行发散。

- 需要注意的是，fx与fy设置的位置不要超过渐变区域，不然会有问题。

```xml
 <svg width="400" height="400" viewBox="0 0 100 100">
  <defs>
    <radialGradient id="radialGradient3" cx="50%" cy="50%" fr="20%" r="50%" fx="25%" fy="50%">
      <stop offset="0%" stop-color="rgb(255,0,0)" />
      <stop offset="100%" stop-color="rgb(255,255,0)" />
    </radialGradient>
  </defs>
  <circle cx="30" cy="30" r="20" fill="url(#radialGradient3)"></circle>
</svg>>
```

![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1741241868119-bde9455d-9bb8-4b82-9de4-c2733eedcf32.png)

## spreadMethod属性

在缩小渐变范围后，设置扩展部分的渐变效果。

- `pad` （默认值）表示使用起点和终点颜色，填充扩展的部分。
- `repeat`  重复当前的渐变颜色，分别作用在扩展的两个部分中。
- `reflect` 按照渐变的反向顺序，作用在扩展的两个部分中。 如果扩展部分依然有剩余，继续反向填充。C-B-A-**A-B-C**-C-B-A-A-B-C



![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1741241966293-7ed36323-0a05-4359-9fb5-77c54daec135.png)

## gradientUnits属性设置渐变单元

在设置渐变区域时，需要设置一些数值。 这些数值可以使用相对单位（百分比），也可以使用绝对单位（px）。

### ObjectBoundingBox

 默认值，使用百分比。 所有图形最终都会形成一个矩形区域：

![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1741243367410-cd8880bc-3604-4feb-973d-f8f16e6e48c2.png)

 这里的百分比都是基于矩形的宽高的。

线性渐变中：

- x1 x2 基于矩形width 
- y1 y2 基于矩形的height

径向渐变中：

- cx fx 基于矩形width 
- cy fy基于矩形的height 
-  r fr同时基于width 和 height   比如矩形区域是100*200那么半径为50与100，最终渐变区域就是个椭圆。 



**图形移动，效果位置也会跟随着移动**

### userSpaceOnUse 

使用绝对值。 参考坐标系图形移动，效果位置不动。

```xml
<defs>
  <radialGradient 
    id="gradient2"
    r="30%" fr="20%"
  >
    <stop offset="0%" stop-color="#ff0" stop-opacity="1"/>
    <stop offset="100%" stop-color="#f00" stop-opacity="1"/>
  </radialGradient>
</defs>

<!-- 50移动到40位置 -->
<circle cx="50" cy="50" r="40" fill="url(#gradient2)"/>
<circle cx="50" cy="50" r="24" fill="none" stroke="#66f" stroke-width=".5"/>
<circle cx="50" cy="50" r="16" fill="none" stroke="#66f" stroke-width=".5"/>
<defs>
  <radialGradient 
    id="gradient4"
    gradientUnits="userSpaceOnUse"
    cx="50" cy="50" fr="20" r="30"
  >
    <stop offset="0%" stop-color="#ff0" stop-opacity="1"/>
    <stop offset="100%" stop-color="#f00" stop-opacity="1"/>
  </radialGradient>
</defs>

<!-- 50移动到40位置 -->
<circle cx="50" cy="50" r="40" fill="url(#gradient4)"/>
<circle cx="50" cy="50" r="30" fill="none" stroke="#66f" stroke-width=".5"/>
<circle cx="50" cy="50" r="20" fill="none" stroke="#66f" stroke-width=".5"/>
```

![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1741243818796-93ac10c7-f0fe-4cf1-8c2f-f6b049281f0e.png)

## 渐变引用

使用href属性，引用另外一个渐变的颜色设置

```xml
<svg width="400" height="400" viewBox="0 0 100 100">
  <defs>
    <radialGradient id="gradient1" fr="15%" r="30%" spreadMethod="repeat">
      <stop offset="0%" stop-color="#ff0" />
      <stop offset="100%" stop-color="#f00" />
    </radialGradient>

    <radialGradient id="gradient2" href="#gradient1" fr="15%" r="30%" spreadMethod="reflect"></radialGradient>
  </defs>
  <circle cx="25" cy="25" r="25" fill="url(#gradient1)"/>
  <circle cx="75" cy="75" r="25" fill="url(#gradient2)"/>
</svg>
```

![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1741244135305-fe3afa0d-4601-4de6-a868-8fa6b1832291.png)

引用的是颜色的渐变过程，与哪种渐变方式无关。 

```xml
<svg width="400" height="400" viewBox="0 0 100 100">
  <defs>
    <radialGradient id="gradient3" fr="15%" r="30%" spreadMethod="repeat">
      <stop offset="0%" stop-color="#ff0" />
      <stop offset="100%" stop-color="#f00" />
    </radialGradient>

    <linearGradient id="gradient4" x1="40%"  x2="60%" spreadMethod="repeat" href="#gradient3" />
  </defs>
  <rect x="20" y="60" width="60" height="30" fill="url(#gradient3)"/>
  <circle cx="30" cy="30" r="25" fill="url(#gradient4)"/>
</svg>
```

![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1741244230945-e3e5e99d-c21f-4517-83f1-9dcfcfe5840a.png)

## 补充说明

通常情况之下，渐变标签 被放置在 `<defs>` 元素内，这样做的好处是重用性和性能优化：

- 重用性：将渐变定义放置在 `<defs>` 元素内**使其成为一个可重用的资源**。这意味着你可以在文档中多次引用相同的渐变，而无需重复定义。这样做有助于减少重复代码，提高代码的可维护性
- 性能优化：将渐变定义放置在 `<defs>` 元素有助于优化性能。当浏览器解析 SVG 文档时，它会在遇到渐变引用时仅计算一次渐变，然后将其应用到多个图形元素中。这样可以减少浏览器的计算量，提高页面加载和渲染速度

理论上说，渐变元素可以放置在文档其他位置（不嵌套在 `<defs>` 内），但这不符合 SVG 最佳实践。