//绘制一个坐标系200*200
const svg = document.querySelector("#svg")
const NS = "http://www.w3.org/2000/svg"
const g = document.createElementNS(NS, "g")
if (svg.children && svg.children.length > 0) {
  svg.insertBefore(g, svg.children[0])
} else {
  svg.appendChild(g)
}

let path = document.createElementNS(NS, "path")
g.appendChild(path)
let d = ""
for (let i = -10; i <= 10; i++) {
  d += `M${i * 10} -100 V100`
  d += `M-100 ${i * 10} H100`
  const text1 = document.createElementNS(NS, "text")
  text1.innerHTML = i
  text1.setAttribute("font-size", 4)
  text1.setAttribute("x", i * 10 - 3)
  text1.setAttribute("y", 4)
  g.appendChild(text1)

  const text2 = document.createElementNS(NS, "text")
  text2.innerHTML = i
  text2.setAttribute("font-size", 4)
  text2.setAttribute("x", 0)
  text2.setAttribute("y", i * 10)
  g.appendChild(text2)
}
path.setAttribute("d", d)
path.setAttribute("fill", "none")
path.setAttribute("stroke", "#ccc")
path.setAttribute("stroke-width", 1)

path = document.createElementNS(NS, "path")
g.appendChild(path)
path.setAttribute("d", 'M-100 0 H 100 M0 -100 V 100')
path.setAttribute("fill", "none")
path.setAttribute("stroke", "#000")
path.setAttribute("stroke-width", 1.5)
