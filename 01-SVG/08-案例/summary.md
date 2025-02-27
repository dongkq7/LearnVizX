# 1、坐标系

## 绘制静态坐标系

```xml
<svg viewBox="0 0 100 100" width="500" height="500">
  <path 
    d="
      M0 0 H100 M0 10 H100 M0 20 H100 M0 30 H100 M0 40 H100 M0 50 H100 M0 60 H100 M0 70 H100 M0 80 H100 M0 90 H100 M0 100 H100
      M0 0 V100 M10 0 V100 M20 0 V100 M30 0 V100 M40 0 V100 M50 0 V100 M60 0 V100 M70 0 V100 M80 0 V100 M90 0 V100 M100 0 V100
    "
    fill="none"
    stroke="#ccc"
    stroke-width="0.5"
  />
  <text x="0" y="3" font-size="3">0</text>
  <text x="8" y="3" font-size="3">10</text>
  <text x="18" y="3" font-size="3">20</text>
  <text x="28" y="3" font-size="3">30</text>
  <text x="38" y="3" font-size="3">40</text>
  <text x="48" y="3" font-size="3">50</text>
  <text x="58" y="3" font-size="3">60</text>
  <text x="68" y="3" font-size="3">70</text>
  <text x="78" y="3" font-size="3">80</text>
  <text x="88" y="3" font-size="3">90</text>
  <text x="0" y="11" font-size="3">10</text>
  <text x="0" y="21" font-size="3">20</text>
  <text x="0" y="31" font-size="3">30</text>
  <text x="0" y="41" font-size="3">40</text>
  <text x="0" y="51" font-size="3">50</text>
  <text x="0" y="61" font-size="3">60</text>
  <text x="0" y="71" font-size="3">70</text>
  <text x="0" y="81" font-size="3">80</text>
  <text x="0" y="91" font-size="3">90</text>
</svg>
```

![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1740471485571-9ac0dbda-220c-4c5d-bc71-78b820913c14.png)

## 绘制动态坐标系

### 目标

根据JS与CSS来动态生成坐标系。在网页中引入JS和CSS，并提供一些参数即可根据需求生成坐标系。

- 由于不同尺寸坐标系中文字大小与位置不方便控制，这里只设计200*200固定大小的坐标系
- 坐标系的四周可能会去展示一些文字等信息，所以需要进行留白，这里四边进行25的留白，所以整个区域大小为250*250，在找所有坐标点的位置时，都需要加上25的留白大小

### 基本实现

index.js

```javascript
function draw(id) {
  // 在250*250的画布上绘制一个200*200的坐标系，四周各留25的边距
  const padding = 25
  const lineGap = 200 / 10

  const svg = document.querySelector(id)
  svg.setAttribute('viewBox', '0 0 250 250')
  svg.setAttribute('width', 500)
  svg.setAttribute('height', 500)
  const svgNS = 'http://www.w3.org/2000/svg'

  const path = document.createElementNS(svgNS, 'path')
  path.setAttribute('fill', 'none')
  path.setAttribute('stroke', '#ccc')
  path.setAttribute('stroke-width', 0.5)
  let d = ''
  for(let i = 0; i < 11; i++) {
    // 横线
    d += `M25 ${padding + i * lineGap} H225`
    // 竖线
    d += `M${padding + i * lineGap} 25 V225`
  }
  path.setAttribute('d', d)

  const children = svg.children
  if (children?.length) {
    svg.insertBefore(path, children[0])
  } else {
    svg.appendChild(path)
  }

  console.log(svg)
}
```

需要注意的是，坐标系要始终保持在最底下。不然会覆盖原有的svg图形。所以要去判断svg中有无子元素，如果有的话要把path插入到最前面。

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <svg id="svg">
  </svg>
  <script src="./index.js"></script>
  <script>
    draw('#svg')
  </script>
</body>
</html>
```

![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1740475400675-a37a1e14-c498-449c-8286-580b01a2c3b1.png)

### 优化

#### 坐标系内容放在g中

坐标系中的内容会越来越多，所以可以将坐标系内容使用g来包裹，后续方便复用。只需要将新增的内容添加到g中，再将g插入到svg中即可。这样svg中增加其他内容就不需要考虑坐标系中的内容放在哪里合适了。



#### 通过配置对象来定制化部分内容

参数接收字符串与配置对象两种方式，首先对参数进行归一化处理，然后再根据配置去定制化内容。



```javascript
function draw(args) {
  // 在250*250的画布上绘制一个200*200的坐标系，四周各留25的边距
  const padding = 25
  const lineGap = 200 / 10

  // 参数归一化处理
  if (typeof args === 'string') {
    args = {
      id: args
    }
  }
  const config = {
    title: '标题',
    titleColor: '#333',
    color: '#ccc',
    xAxis: true,
    yAxis: true,
    ...args
  }

  const svg = document.querySelector(config.id)
  svg.setAttribute('viewBox', '0 0 250 250')
  svg.setAttribute('width', 500)
  svg.setAttribute('height', 500)
  const svgNS = 'http://www.w3.org/2000/svg'

  const g = document.createElementNS(svgNS, 'g')
  // 设置标题
  const text = document.createElementNS(svgNS, 'text')
  text.setAttribute('x', 5)
  text.setAttribute('y', 15)
  text.setAttribute('fill', config.titleColor)
  text.setAttribute('font-size', 8)
  text.textContent = config.title
  g.appendChild(text)

  const path = document.createElementNS(svgNS, 'path')
  path.setAttribute('fill', 'none')
  path.setAttribute('stroke', config.color)
  path.setAttribute('stroke-width', 0.5)
  let d = ''
  for(let i = 0; i < 11; i++) {
    // 横线
    if (config.xAxis) {
      d += `M25 ${padding + i * lineGap} H225`
    }
    
    // 竖线
    if (config.yAxis) {
      d += `M${padding + i * lineGap} 25 V225`
    }
  }
  path.setAttribute('d', d)
  g.appendChild(path)

  const children = svg.children
  if (children?.length) {
    svg.insertBefore(g, children[0])
  } else {
    svg.appendChild(g)
  }

  console.log(svg)
}
```

# 2、折线图

### 组成部分

一个基础的折线图包括：

- 坐标轴左侧文字
- 底部线段及文字
- 连线以及连线之间的圆点

```xml
  <svg id="svg">
    <!-- 左侧数值 -->
    <g class="y-text">
      <text x="20" y="225">0</text>
      <text x="20" y="185">40</text>
      <text x="20" y="145">80</text>
      <text x="20" y="105">120</text>
      <text x="20" y="65">160</text>
      <text x="20" y="25">200</text>
    </g>

    <!-- 底部线段，7个间隙(200 / 7 = 28.5)，8个线段 -->
    <g class="x-line">
      <path
          d="M25 225V229 M53.5 225V229 M82 225V229 M110.5 225V229
            M139 225V229 M167.5 225V229 M196 225V229 M225 225V229"
        />
    </g>

    <!-- x轴底部文字 -->
    <g class="x-text">
      <text x="39" y="235">周一</text>
      <text x="67.5" y="235">周二</text>
      <text x="96" y="235">周三</text>
      <text x="124.5" y="235">周四</text>
      <text x="153" y="235">周五</text>
      <text x="181.5" y="235">周六</text>
      <text x="210" y="235">周日</text>
    </g>

    <!-- 线段-->
    <polyline class="data-line" points="39 125,67.5 25,96 175,124.5 200,153 150,181.5 140,210 80"/>

    <!-- 线段上的圆点 -->
    <g class="data-circle">
      <circle cx="39" cy="125" />
      <circle cx="67.5" cy="25"  />
      <circle cx="96" cy="175"  />
      <circle cx="124.5" cy="200"  />
      <circle cx="153" cy="150"  />
      <circle cx="181.5" cy="140"  />
      <circle cx="210" cy="80"  />
    </g>

  </svg>
.y-text {
  font-size: 6px;
  fill: #ccc;
  text-anchor: end;
}

.x-line {
  stroke: #ccc;
  stroke-width: 0.5px;
  fill: none;
}

.x-text {
  font-size: 6px;
  fill: #ccc;
  text-anchor: middle;
}

.data-circle circle {
  r: 1px;
  fill: #fff;
  stroke: #5A6FC0;
  stroke-width: 1px;
}
.data-circle circle:hover {
  r: 2px;
}
.data-line {
  cursor: pointer;
  stroke: #5A6FC0;
  stroke-width: 1px;
  fill: none;
}
```

![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1740538039497-ad3d57f7-e836-4374-8836-86d43b49da90.png)

### 坐标轴数据处理

数据结构如下：

```plain
[
  {
    text: '周一', value: 200
  },
  {
    text: '周二', value: 400
  }
  ...
]
```

#### 左侧数值绘制

1. 首先要根据提供的数据来找到最大值，根据最大值算出间隔

- 比如要绘制6个数值，最大值为500，那么每个数值的间隔为500/5 = 100，那么6个数值分别为0 100 200 300 400 500
- 为了让折线绘制美观，不顶边，一般会进行一个向上取整。

- 比如如果最大值是500那么就取到500，如果是450那么也取到500
- 如果最大值是1850那么就取到2000
- 三位数以100的倍数作为最大值，四位数则以1000的倍数作为最大值



1. 根据数值间隔以及坐标间隔来绘制

- 比如坐标系是200 * 200的，最大值为500，要分成五份，那么每份的纵坐标间隔为200 / 5 = 40，每份的数值间隔为500 / 5 = 100

```javascript
const NS = 'http://www.w3.org/2000/svg'
const svg = document.querySelector('#svg')
const data = [
  { text: '周一',value: 200 },
  { text: '周二',value: 120 },
  { text: '周三',value: 80 },
  { text: '周四',value: 450 },
  { text: '周五',value: 330 },
  { text: '周六',value: 100 },
  { text: '周日',value: 60 }
]

// 找出data中的最大值
const maxValue = Math.max(...data.map(item => item.value))
const xStart = 25 // 横坐标起始位置
const yStart = 225 // 纵坐标起始位置

const count = 5 // 假如纵坐标展示5个数值
const upLimit = calcUpLimit(maxValue)
const yDataSpace = upLimit / count
const ySpace = 200 / count

let g = document.createElementNS(NS, 'g')
g.classList.add('y-text')
svg.appendChild(g)

for(let i = 0; i <= count; i++) {
  const text = document.createElementNS(NS, 'text')
  text.setAttribute('x', xStart - 5)
  text.setAttribute('y', yStart - ySpace * i)
  text.textContent = yDataSpace * i
  g.appendChild(text)
}
/**
 * 根据最大值计算出纵坐标绘制数值的最大值
 * 500 -> 500 450 -> 500 1850 -> 2000
 * @param {number} maxValue 最大值
 */
function calcUpLimit(maxValue) {
  // 获取数值的位数
  const len = (maxValue + '').length
  const unit = Math.pow(10, len - 1)
  return Math.ceil(maxValue / unit) * unit
}
```

#### 底部坐标轴绘制

```javascript
// 绘制x轴刻度线
const xSpace = 200 / data.length
g = document.createElementNS(NS, 'g')
g.classList.add('x-line')
svg.appendChild(g)

const path = document.createElementNS(NS, 'path')
let d = ''
for(let i = 0; i <=  data.length; i++) {
  d += `M${xStart + xSpace * i} 225 V229`
}
path.setAttribute('d', d)
g.appendChild(path)

// 绘制底部文字
g = document.createElementNS(NS, 'g')
g.classList.add('x-text')
svg.appendChild(g)
data.forEach((item, index) => {
  const text = document.createElementNS(NS, 'text')
  // 需要找到每个space中间的那个位置来进行绘制
  text.setAttribute('x', xStart + xSpace * index + xSpace / 2)
  text.setAttribute('y', yStart + 10)
  text.textContent = item.text
  g.appendChild(text)
})
```



### 折线与圆点绘制

**圆点坐标的计算逻辑**

- 圆点的横坐标就是文字中间点的横坐标
- 纵坐标需要经过换算，`缩放比例 = 200 / 纵坐标最大值`。由于实际坐标系与绘制坐标系的y轴正方向是相反的，所以 `**纵坐标 = 225 - value \* 缩放比例**`

```javascript
// 缩放比例
const ratio = 200 / upLimit
// 数据折线
g = document.createElementNS(NS, 'g')
g.classList.add('data-line')
svg.appendChild(g)
const polyline = document.createElementNS(NS, 'polyline')

let points = ''
data.forEach((item, index) => {
  points += `${xStart + xSpace * index + xSpace / 2} ${yStart - item.value * ratio} `
})
polyline.setAttribute('points', points)
g.appendChild(polyline)

// 数据圆点
g = document.createElementNS(NS, 'g')
g.classList.add('data-circle')
svg.appendChild(g)


data.forEach((item, index) => {
  const circle = document.createElementNS(NS, 'circle')
  circle.setAttribute('cx', xStart + xSpace * index + xSpace / 2)
  circle.setAttribute('cy', yStart - item.value * ratio)
  // 方便后续在面板中展示出数值内容
  circle.setAttribute('value', item.value)
  g.appendChild(circle)
})
```

### 增加坐标点的显示

```javascript
// 增加鼠标移入展示数值框
const panel = document.querySelector('.data-panel')
svg.onmouseover = function(e) {
  if (e.target.tagName === 'circle') {
    const left = e.clientX + 5 + 'px'
    const top = e.clientY + 5 + 'px'
    panel.style.left = left
    panel.style.top = top
    panel.style.display = 'block'
    panel.textContent = e.target.getAttribute('value')
  }

  e.target.onmouseout = function() {
    panel.style.display = 'none'
    e.target.onmouseout = null
  }
}
```

# 3、坐标系功能优化

无论柱状图还是折线图，坐标系中都需要展示刻度与文字，可以考虑将这些封装到坐标系的绘制中。并将相关数据放到返回结果中以便图形使用。

```javascript
function draw(args) {
  //...省略部分逻辑
  
  const xSpace = 200 / config.xText.length
  result.xSpace = xSpace

  if (config.xText?.length) {
    // 绘制横坐标刻度线
    g = document.createElementNS(svgNS, 'g')
    g.classList.add('x-line')
    const path = document.createElementNS(svgNS, 'path')
    let d = ''
    for(let i = 0; i <= config.xText.length; i++) {
      d += `M${padding + i * xSpace} 225 V229`
    }
    path.setAttribute('d', d)
    path.setAttribute('stroke', config.color)
    path.setAttribute('stroke-width', 0.5)
    path.setAttribute('fill', 'none')
    g.appendChild(path)
    svg.appendChild(g)

    // 绘制文字
    g = document.createElementNS(svgNS, 'g')
    g.classList.add('x-text')
    config.xText.forEach((txt, i) => {
      const text = document.createElementNS(svgNS, 'text')
      text.setAttribute('x', padding + i * xSpace + xSpace / 2) 
      text.setAttribute('y', yStart + 10)
      text.setAttribute('font-size', 6)
      text.setAttribute('fill', config.titleColor)
      text.setAttribute('text-anchor', 'middle')
      text.textContent = txt
      g.appendChild(text)
      svg.appendChild(g)
    })
  }

  // 绘制纵坐标数值
  if (config.yMax && config.yMax > 0) {
    const part = config.part || 5
    const upLimit = calcUpLimit(config.yMax) // 展示的最大值
    const ySpace = 200 / part // 根据part计算出数值之间的间隔
    const ratio = 200 / upLimit // 缩放比例
    result.ratio = ratio
    result.upLimit = upLimit

    g = document.createElementNS(svgNS, 'g')
    g.classList.add('y-text')
    for(let i = 0; i <= part; i++) {
      const text = document.createElementNS(svgNS, 'text')
      text.setAttribute('x', padding - 5)
      text.setAttribute('y', yStart - ySpace * i)
      text.setAttribute('font-size', 6)
      text.setAttribute('fill', config.titleColor)
      text.setAttribute('text-anchor', 'end')
      text.textContent = upLimit / part * i
      g.appendChild(text)
    }
    svg.appendChild(g)
  }

  return result
}

/**
 * 根据最大值计算出纵坐标绘制数值的最大值
 * 500 -> 500 450 -> 500 1850 -> 2000
 * @param {number} maxValue 最大值
 */
function calcUpLimit(maxValue) {
  // 获取数值的位数
  const len = (maxValue + '').length
  const unit = Math.pow(10, len - 1)
  return Math.ceil(maxValue / unit) * unit
}
```

# 4、柱状图

柱状图示例如下：

![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1740562603350-93371187-8fc9-4dc5-992b-27ca6fb756eb.png)

需要计算出每个柱状图的x、y以及width与height，然后通过rect绘制即可

![img](https://cdn.nlark.com/yuque/0/2025/gif/22253064/1740562056336-b9e4be38-eb30-4676-a86f-fb78f2abd582.gif?x-oss-process=image%2Fcrop%2Cx_0%2Cy_0%2Cw_1043%2Ch_892)

```javascript
const data = [
  { text: 'Mon', value: 320 },
  { text: 'Tue', value: 620 },
  { text: 'Wed', value: 500 },
  { text: 'Thu', value: 720 },
  { text: 'Fri', value: 820 },
  { text: 'Sat', value: 920 },
  { text: 'Sun', value: 980 },
]
const yMax = Math.max(...data.map(item => item.value))
const texts = data.map(item => item.text)
const values = data.map(item => item.value)

// 绘制出坐标系
const result = draw({
  id: '#svg',
  title: '柱状图示例',
  yAxis: false,
  color: '#E1E6F0',
  xText: data.map(item => item.text),
  yMax,
})

// 绘制柱状图
const svg = document.querySelector('#svg')
const NS = 'http://www.w3.org/2000/svg'
let g = document.createElementNS(NS, 'g')
svg.appendChild(g)
values.forEach((value, index) => {
  // 其中25为坐标系四周留白的大小，xSpace为横坐标刻度间的距离
  const x = 25 + index * result.xSpace + result.xSpace / 4
  const width = result.xSpace / 2
  const height = result.ratio * value
  const rect1 = document.createElementNS(NS, 'rect')
  rect1.setAttribute('x', x)
  rect1.setAttribute('y', 25)
  rect1.setAttribute('width', width)
  rect1.setAttribute('height', 200)
  rect1.setAttribute('fill', '#E1E6F0')
  rect1.setAttribute('fill-opacity', 0.5)
  g.appendChild(rect1)

  const rect2 = document.createElementNS(NS, 'rect')
  rect2.classList.add('bar')
  rect2.setAttribute('x', x)
  rect2.setAttribute('y', 225 - height)
  rect2.setAttribute('width', width)
  rect2.setAttribute('height', height)
  rect2.setAttribute('fill', '#5A6FC0')
  rect2.setAttribute('value', value)
  g.appendChild(rect2)
})


const panel = document.querySelector('.data-panel')
// 鼠标移入展示数据
svg.onmousemove = function(e) {
  if (e.target.classList.contains('bar')) {
    const value = e.target.getAttribute('value')
    panel.style.left = e.clientX + 10 + 'px'
    panel.style.top = e.clientY + 5 + 'px'
    panel.style.display = 'block'
    panel.innerHTML = value

    e.target.onmouseleave = function() {
      panel.style.display = 'none'
    }
  }
}
.bar:hover {
  cursor: pointer;
  fill: #ADDE8B;
}

.data-panel{
  padding:5px 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  background-color: #fff;
  border-radius: 4px;
  position: absolute;
  display:none;
  left:0;
  top:0;
}
```

# 5、饼状图

## 弧形终点坐标计算及绘制

绘制弧形要具备以下条件（以顺时针绘制）：

- 圆心坐标
- 起点坐标
- 半径
- 角度
- 终点坐标

其中角度可以通过 `360 * (value / sum)`来获得

![img](https://cdn.nlark.com/yuque/0/2025/jpeg/22253064/1740642420643-0feb13ff-591a-4f46-bb1c-9c9b1b6ada91.jpeg)

如图所示，已知圆心坐标(x, y)、半径R，所处象限为x正方向y负方向的右上角象限，与y轴的夹角。

1. 以x1，y1为点向x轴y轴做垂线，那么线段A的长度为x1-x，线段B的长度为y-y1
2. 那么`**由 sin(30°) = (x1 - x) / r 得, x1 = x + sin(30°) \* r**`
3. `**由cos(30°) = (y-y1) / r得, y1 = y - cos(30°) \* r**`

需要注意，绘制时参考的象限不同，结果也不同。

Math.sin()中要求传递的参数是弧度，不是角度，所以要将角度转换成弧度传递进去

弧度的定义是，弧长等于半径的弧所对的圆心角为1弧度。

设圆的半径为，根据圆的周长公式C= 2πR。由于弧长为R时所对的圆心角是1弧度，那么整个圆的周长所对应的圆心角的弧度数为2πR / R = 2π弧度。即：2π弧度 = 360°，那么1° = π/180弧度。

- **所以可以通过** `**度数 \* (π / 180)**` **计算出弧度值**

需要注意：

1. 绘制弧的时候如果角度超过180°则需要绘制大弧，小于180°则需要绘制小弧
2. 绘制下一个弧的时候对应的角度要加上上一个弧的角度，因为这里要保持计算方式一致，所以始终要看与y轴负方向的夹角大小。

```javascript
const data = [
  { text: 'HTML', value: 80},
  { text: 'CSS', value: 100},
  { text: 'JavaScript', value: 200},
  { text: 'Vue', value: 180},
  { text: 'Rect', value: 200},
]
const padding = 25 // 画布边距
const origin = { x: 100, y: 100 } // 原点坐标
let startPoint = { x: 100, y: 20 } // 起点坐标
const svg = document.querySelector('#svg')
const NS = 'http://www.w3.org/2000/svg'

const sum = data.reduce((acc, cur) => acc + cur.value, 0)

let preAngle = 0
data.forEach((item, index) => {
  const angle = item.value / sum * 360 // 所占角度
  const arcFlag = angle > 180 ? 1 : 0 // 超过180度画大弧，小于180度画小弧
  const endAngle = preAngle + angle

  const g = document.createElementNS(NS, 'g')
  g.classList.add('pie')
  svg.appendChild(g)

  const endPoint = getEndPoint(80, endAngle)
  const path = document.createElementNS(NS, 'path')
  
  const d = `
    M${origin.x + padding} ${origin.y + padding}
    L${startPoint.x + padding} ${startPoint.y + padding}
    A80 80 0 ${arcFlag} 1 ${endPoint.x + padding} ${endPoint.y + padding}
    Z
  `
  startPoint = endPoint
  path.setAttribute('d', d)
  path.setAttribute('fill', randomColor())
  g.appendChild(path)
  preAngle = endAngle

})

function getEndPoint(r, angle) {
  return {
    x: origin.x + r * Math.sin(angle * Math.PI / 180),
    y: origin.y - r * Math.cos(angle * Math.PI / 180)
  }
}
function randomColor() {
  return '#' + Math.random().toString(16).slice(-6)
}
```

## 弧上折线与文字绘制

![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1740639740156-9d6c1640-3568-4952-874c-3662976027c8.png)

1. 要基于当前数据圆弧对应的角度的一半以及折线拐角点所对应的半径来计算这个点的坐标A。
2. 计算好后，使用polyline链接圆的中心点O、与A和B来进行绘制

- 由于不同方向的AB线段的朝向不同，可以根据A点的横坐标与O点的横坐标大小来判断，大于中心点横坐标，则B的x轴坐标在A的x轴坐标基础上+5，否则-5即可

1. 根据B点的坐标去绘制文字，如果B点的坐标在点O的左侧，那么文字的text-anchor为end

```javascript
// 绘制扇形文字信息
  const polyline = document.createElementNS(NS, 'polyline')
  const lineEndPoint = getEndPoint(83, preAngle + angle / 2)
  const unit = lineEndPoint.x > 100 ? 5 : -5 // 用于控制折现的方向

  polyline.setAttribute('points', 
    `${origin.x + padding} ${origin.y + padding} ${lineEndPoint.x + padding} ${lineEndPoint.y + padding} ${lineEndPoint.x + unit + padding} ${lineEndPoint.y + padding}`
  )
  polyline.setAttribute('stroke', color)
  polyline.setAttribute('fill', 'none')
  g.appendChild(polyline)

  const text = document.createElementNS(NS, 'text')
  text.setAttribute('x', lineEndPoint.x + unit + padding)
  text.setAttribute('y', lineEndPoint.y + padding)
  text.setAttribute('fill', color)
  text.textContent = `${item.text}`
  text.setAttribute('font-size', 8)
  g.appendChild(text)
  text.setAttribute('text-anchor', lineEndPoint.x > 100 ? 'start' : 'end')
```



## 鼠标移入放大效果实现

![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1740640153316-24b42388-deae-4451-8aaf-bd38826f9d0f.png)

原理：鼠标移入时将扇形重新绘制，半径放大；鼠标移出后再进行还原。

这里需要实现不管鼠标移入扇形还是字体还是折线上都要展示放大效果，但是这些元素是放在一个g元素中的

- g元素不会触发事件，可以通过e.target.parentNode来判断是否是g元素
- 这里需要使用onmouseover与onmouseout，因为事件是绑定在svg上的。onmouseover有冒泡，所以鼠标移入svg中的子元素时也会触发。

```javascript
const panel = document.querySelector('.data-panel')
svg.onmouseover = function(e) {
  if (
    e.target.parentNode.tagName === 'g'
    &&
    e.target.parentNode.classList.contains('pie')
  ) {
    const path = e.target.parentNode.querySelector('path')
    // 重新绘制扇形
    const startAngle = e.target.parentNode.getAttribute('lastAngle')
    const endAngle = e.target.parentNode.getAttribute('curAngle')

    function show(e) {
      panel.textContent = e.target.parentNode.getAttribute('msg')
      panel.style.left = e.clientX + 10 + 'px'
      panel.style.top = e.clientY + 10 + 'px'
      panel.style.display = 'block'
    }

    function drawArc(r, startAngle, endAngle) {
      const startPoint = getEndPoint(r, startAngle)
      const endPoint = getEndPoint(r, endAngle)
      const arcFlag = endAngle - startAngle > 180 ? 1 : 0
      
      const d = `
        M${origin.x + padding} ${origin.y + padding}
        L${startPoint.x + padding} ${startPoint.y + padding}
        A${r} ${r} 0 ${arcFlag} 1 ${endPoint.x + padding} ${endPoint.y + padding}
      `
      path.setAttribute('d', d)
    }

    drawArc(83, startAngle, endAngle)

    e.target.onmousemove = function(e) {
      show(e)
    }
    e.target.onmouseout= function() {
      drawArc(80, startAngle, endAngle)
      panel.style.display = 'none'
      this.onmousemove = null
      this.onmouseout = null
    }
  }
}
```