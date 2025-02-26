draw({
  id: '#svg',
  title: '折线图示例',
  yAxis: false,
  color: '#E1E6F0'
})

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

// 缩放比例
const radio = 200 / upLimit
// 数据折线
g = document.createElementNS(NS, 'g')
g.classList.add('data-line')
svg.appendChild(g)
const polyline = document.createElementNS(NS, 'polyline')

let points = ''
data.forEach((item, index) => {
  points += `${xStart + xSpace * index + xSpace / 2} ${yStart - item.value * radio} `
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
  circle.setAttribute('cy', yStart - item.value * radio)
  circle.setAttribute('value', item.value)
  g.appendChild(circle)
})

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
