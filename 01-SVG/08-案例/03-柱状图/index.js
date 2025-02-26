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

