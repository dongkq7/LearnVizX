draw({
  id: '#svg',
  title: '饼状图示例'
})

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
  g.setAttribute('msg', `${item.text}: ${item.value}`)
  g.setAttribute('curAngle', endAngle)
  g.setAttribute('lastAngle', preAngle)


  const color = randomColor()
  g.classList.add('pie')
  svg.appendChild(g)

  // 绘制扇形
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
  path.setAttribute('fill', color)
  g.appendChild(path)

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

  preAngle = endAngle

})

const panel = document.querySelector('.data-panel')
svg.onmouseover = function(e) {
  // 由于g元素不会触发事件，所以这里可以通过parentNode判断是否是g元素
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

    // 实时追踪鼠标位置
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

function getEndPoint(r, angle) {
  return {
    x: origin.x + r * Math.sin(angle * Math.PI / 180),
    y: origin.y - r * Math.cos(angle * Math.PI / 180)
  }
}
function randomColor() {
  return '#' + Math.random().toString(16).slice(-6)
}