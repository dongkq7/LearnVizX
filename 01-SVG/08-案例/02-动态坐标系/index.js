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
    d += `M25 ${padding + i * lineGap} H225`
    // 竖线
    d += `M${padding + i * lineGap} 25 V225`
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