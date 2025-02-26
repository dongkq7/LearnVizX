function draw(args) {
  // 在250*250的画布上绘制一个200*200的坐标系，四周各留25的边距
  const padding = 25
  const lineGap = 200 / 10
  const yStart = 225

  const result = {}

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

  const svgNS = 'http://www.w3.org/2000/svg'
  const svg = document.querySelector(config.id)
  
  svg.setAttribute('viewBox', '0 0 250 250')
  svg.setAttribute('width', 500)
  svg.setAttribute('height', 500)


  let g = document.createElementNS(svgNS, 'g')
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
