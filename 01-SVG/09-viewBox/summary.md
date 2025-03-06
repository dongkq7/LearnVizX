每个svg标签都有一个自己的坐标系（多个svg标签之间的坐标系没有关系都是独立的），这个坐标系是隐式的且式无穷大的：

![img](https://cdn.nlark.com/yuque/0/2025/jpeg/22253064/1740894185969-d5f72fd9-87e4-4e35-8b05-14935bee7ffe.jpeg)

只不过默认窗口左上角为0,0点，展示的区域默认是x正y正这个区域。

svg默认的宽高是300*150

- 一旦设置了viewbox（没有设置width height），会默认撑满窗口
- 如果只设置了width和height，没有设置viewbox ， 则viewbox默认为0 0 width height 
- 一般都会viewBox 配合 width和height

## viewBox属性

```plain
viewBox="x y width height"
```

指定一个视口的大小和位置，用来展示坐标系中指定的部分。

- x y 设置视口的起始位置，可以是正值也可以是负值
- width height 设置视口的区域

![img](https://cdn.nlark.com/yuque/0/2025/jpeg/22253064/1740907904306-516a2631-a690-41f3-8917-be2887fa6975.jpeg)

比如画了一个圆，圆心坐标是(-200,-200)半径为100，那么此时想在viewBox中展示出来，就需要将viewBox中的x、y设置为-300 -300

```xml
<svg id="svg" width="200" height="200" viewBox="-300 -300 200 200" style="border: 1px solid red;">
  <circle cx="-200" cy="-200" r="100" fill="red"/>
</svg>
```

![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1740907993734-972691c6-6d60-4a37-a857-ab88c8c7a42f.png)

## width height

确定最终图形展示的大小。

首先，使用viewBox确定了要展示图形的部分（位置）。

接下来就可以使用width和height设置展示图形的大小。 

如果width和height的区域比viewBox区域大， 就会等比例**放大**。 否则会等比例**缩小。**

```xml
<svg 
id="svg"
width="500"
height="500"
viewBox="200 200 200 200"
style="border: solid #000"
>
  <circle cx="300" cy="300" r="100" fill="red" />
</svg>
```

![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1740894645468-470911dc-9497-4927-bf3b-739d5f11a6d0.png)

## preserveAspectRatio

当viewBox的宽高与svg的宽高不一致时，默认会进行一个等比缩放

假设：

viewBox.width=100 viewBox.height=100  比例1:1

情况一：

svg.width=200 svg.height=200  比例1:1

此时正常放缩

情况二：

svg.width=200 svg.height=400  比例1:2   viewBox图形必须按照1:1放大（因为viewBox的宽高比为1:1）

此时viewbox放缩后会有两种宽高：

​	200*200

​	400*400

**这个时候，是按照小的那一边缩放，还是按照大那一边的缩放。缩放后会有什么效果，又如何控制展示位置。就由preserveAspectRatio属性控制**

viewBox的宽高比不一定是1:1，有可能是1:2，那么此时缩放的时候需要按照1:2来进行

**preserveAspectRatio 属性在设置的时候有两部分值：**

```
preserveAspectRatio ="align meetOrSlice"
```

### align

align用于设置图形在窗口中的位置，如`xMinYMin``xMidYMin``xMidYMid`...

- 注意x是小写Y是大写

![img](https://cdn.nlark.com/yuque/0/2025/jpeg/22253064/1740909540966-6dfa7639-7faa-43a8-bae7-299bb7ec4250.jpeg)

```xml
 <svg 
    id="svg" 
    preserveAspectRatio="xMaxYMin meet"
    viewBox="-100 -100 200 200" 
    width="800" 
    height="400" 
    style="border: 1px solid red"
  ></svg>
```

![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1740907111345-f66898ba-abac-45f2-bb56-95f46e3122f7.png)

### meetOrSlice

用来设置viewBox在进行放缩时是参考svg宽高中的较大的值还是较小的值？

#### meet 

viewBox图形会按照小的数值放缩，此时窗口区域就会多出一部分。这一部分可以显示viewBox没有包含到那部分坐标系的内容（可见的）

比如现在有一个-100到100的 200*200的坐标系：

![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1740919096678-2a23a273-6cb1-4250-a940-60a932a51f6a.png)

情况1：

- `viewBox="-50 -50 100 100"`，viewBox展示的区域100*100
- svg的width=200 height=200也是1:1

那么此时viewBox将等比进行放大

![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1740919234875-7a98800e-6023-47c9-8442-4a07fdb9fe6f.png)

情况2：

- `viewBox="-50 -50 100 100"`，viewBox展示的区域100*100
- svg的width=200 height=400，宽高比为1:2

此时由于**preserveAspectRatio的align默认为xMidYMid，且是meet，那么此时会展示出viewBox中没有包含的那部分**

![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1740919311148-0526ed8c-32d1-4c5f-8642-9d5fa4791a8a.png)![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1740919490783-9a0d2a37-6d1d-4950-837a-68877a3a6385.png)

情况3：

- 在情况2的基础上，将align设置为xMinYMin,将会展示成如下样子：

![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1740919627121-c60c27bb-0a15-46cb-b295-1ac914db13ed.png)

#### slice

viewBox图形会按照大的数值放缩。此时窗口过小，装不下图形。所以需要在viewBox图形中切一部分在窗口中展示。

```xml
<svg 
  id="svg" 
  width="200" 
  height="400" 
  viewBox="-50 -50 100 100" 
  style="border: 1px solid red;"
  preserveAspectRatio="xMidYMin slice"
>
</svg>
```

![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1740919991140-31259102-dad3-4fe1-9dee-8994745fde71.png)

### none

还有一种情况，就是不按照等比例缩放。 设置`preserveAspectRatio="none"`

就将viewBox图形按照现有的svg宽高比例拉伸。

```xml
 <svg 
  id="svg" 
  width="200" 
  height="400" 
  viewBox="-50 -50 100 100" 
  style="border: 1px solid red;"
  preserveAspectRatio="none"
>
</svg>
```

![img](https://cdn.nlark.com/yuque/0/2025/png/22253064/1740920072886-9ccc0e63-3461-4c90-a8bb-7d3225d7498a.png)