
function init() {
    //监听顶部menu点击事件
    menuBar.on('click', handleMenuClick);
    //监听左边工具栏点击事件
    toolsLeft.on('click', handleToolsClick);
    //监听画布区域点击事件
    svgCanvas.on('click', handleSvgCanvasClick)
    //监听画布区域鼠标按下事件
    svgCanvas.on('mousedown', mousedownHandler)
    //取消画布区域右键默认事件，并做逻辑处理
    svgCanvas.on('contextmenu', handleRightKeyClick)
    //监听页面鼠标抬起事件
    $(document).on('mouseup', mouseupHandler)
}

init()
// 鼠标样式

//点击左侧工具栏处理函数
function handleToolsClick(event) {
    //改变样式
    toogleClass(event.target)
    if (selectSVG !== null) {
        updateSVG($(selectSVG), selectParams)
        removeSelectTips(selectorCir)
        selectSVG = null
    }
}

//点击右键处理函数
function handleRightKeyClick(event) {
    //改变样式
    event.preventDefault()
    shape = "select"
    svgCanvas.css("cursor", pointerValue[shape])
    toogleClass(tool_select)
    removeSelectTips(selectorCir)
    selectPanel && (selectPanel.css('display', 'none'))
    selectSVG && $(selectSVG).attr('stroke', selectParams.stroke);
    selectPanel = null
    selectSVG = null
    editFalg = false
    return false
}

//顶部工具栏处理函数
function handleMenuClick(event) {
    console.log(88)
    // event.target.classList.toggle('open')
}

//点击画布处理函数
function handleSvgCanvasClick(event) {
    //获取鼠标点击的坐标
    let x = event.pageX - offsetX
    let y = event.pageY - offsetY
    pointerStart.x = x
    pointerStart.y = y
    if (pointerValue[shape] !== 'default') {
        return
    }
    let target = $(event.target)
    let name = target[0].nodeName
    //判断是否为辅助点
    if (target && target.attr('id') && target.attr('id').startsWith('tip')) {
        return
    }
    //判断是否重复选择自身
    if (target[0] === selectSVG) {
        return
    }
    //判断选择其他svg元素
    if (selectSVG !== null) {
        updateSVG($(selectSVG), selectParams)
        selectSVG = null
        $(selectPanel).css('display', 'none')
        removeSelectTips(selectorCir)
    }
    selectPanel = $("#shape-panel")
    //选择svg line元素
    //选择svg rect元素 ，创建辅助点， 展示rect面板,同时保存元素样式，取消选中时复原
    if (shapeTextMap[name] && selectPanel.length) {
        let selectSVGCSS = {
            stroke: target.attr('stroke'),
            'stroke-linecap': 'butt'
        }
        selectParams = {
            stroke: target.attr('stroke'),
            fill: target.attr('fill'),
            "stroke-width": target.attr('stroke-width'),
            'stroke-linecap': 'butt',
            "stroke-dasharray": "实线"
        }
        selectPanelUpdateCSS(name, selectPanel, selectParams)
        updateSVG(target, {
            stroke: 'red',
            'stroke-linecap': 'round',
        })
    }
    //`stroke-linecap`
    pointerValue[name] && createSelectTips(target, selectorCir)
    selectSVG = target[0]
}


function mouseupHandler() {
    svgCanvas.on('mousemove', mousemoveHandler)
    flagDraw = false
    dargFalg = false
    editFalg = false
    currentTarget = null
    pointerStart = {
        x: 0, y: 0
    }
    pointerEnd = {
        x: 0, y: 0
    }
    console.log("mouseupHandler")

}

function mousemoveHandler(ev) {
    ev.stopPropagation()
    let x = ev.pageX - offsetX
    let y = ev.pageY - offsetY
    let target = ev.target
    //编辑
    if (selectSVG && editFalg) {
        //编辑矩形
        if (selectSVG.nodeName === 'rect') {
            let offsetX = x - pointerStart.x
            let offsetY = y - pointerStart.y
            let width = Math.abs(offsetX)
            let height = Math.abs(offsetY)
            offsetX < 0 && $(selectSVG).attr('x', x);
            offsetY < 0 && $(selectSVG).attr('y', y);
            updateSVG($(selectSVG), {
                width,
                height
            })
        }
        if (selectSVG.nodeName === 'line') {
            let id = parseInt(selectTip.getAttribute('id').split('_')[1])
            updateSVG($(selectSVG), {
                ['x' + (id + 1)]: x, ['y' + (id + 1)]: y
            })
        }
        if (selectSVG.nodeName === 'circle') {
            //计算圆的半径
            let r = Math.floor(Math.sqrt(computeDistance(pointerStart.x, pointerStart.y, x, y) ** 2 / 8));
            let offsetX = x - pointerStart.x
            let offsetY = y - pointerStart.y
            let sel = $(selectSVG)
            updateSVG(sel, {
                r: r,
                cx: pointerStart.x + (offsetX < 0 ? -r : r), cy: pointerStart.y + (offsetY < 0 ? -r : r)
            })
        }
        createSelectTips($(selectSVG), selectorCir)
        return
    }
    // && target == selectSVG
    //拖动
    if (selectSVG && dargFalg) {
        if (selectSVG.nodeName === 'rect') {
            let currentX = isNaN(parseInt(selectSVG.getAttribute('x'))) ? 0 : parseInt(selectSVG.getAttribute('x'))
            let currentY = isNaN(parseInt(selectSVG.getAttribute('y'))) ? 0 : parseInt(selectSVG.getAttribute('y'))
            updateSVG($(selectSVG), {
                x: currentX + x - pointerStart.x,
                y: currentY + y - pointerStart.y
            })
            pointerStart.x = x
            pointerStart.y = y
        }
        if (selectSVG.nodeName === 'line') {
            let sel = $(selectSVG)
            let x1 = parseInt(sel.attr('x1'));
            let y1 = parseInt(sel.attr('y1'));
            let x2 = parseInt(sel.attr('x2'));
            let y2 = parseInt(sel.attr('y2'));
            // addNum
            let moveX = minNum(x, pointerStart.x)
            let moveY = minNum(y, pointerStart.y)
            updateSVG(sel, {
                x1: x1 + moveX, y1: y1 + moveY,
                x2: x2 + moveX, y2: y2 + moveY
            })
            pointerStart.x = x
            pointerStart.y = y
        }
        if (selectSVG.nodeName === 'circle') {
            let sel = $(selectSVG)
            let currentX = parseInt(sel.attr('cx'))
            let currentY = parseInt(sel.attr('cy'))
            updateSVG(sel, {
                cx: currentX + minNum(x, pointerStart.x), cy: currentY + minNum(y, pointerStart.y)
            })
            pointerStart.x = x
            pointerStart.y = y
        }
        createSelectTips($(selectSVG), selectorCir)
        return
    }
    if (!flagDraw) return false
    //初次绘制
    if (shape === "rect") {
        if (currentTarget) {
            let offsetX = x - pointerStart.x
            let offsetY = y - pointerStart.y
            let width = Math.abs(offsetX)
            let height = Math.abs(offsetY)
            offsetX < 0 && currentTarget.attr('x', x);
            offsetY < 0 && currentTarget.attr('y', y);
            updateSVG(currentTarget, {
                width,
                height
            })
            return
        }
        currentTarget = createSVGRact(pointerStart.x, pointerStart.y, x, y)
    }
    if (shape === "line") {
        if (currentTarget) {
            updateSVG(currentTarget, {
                x2: x,
                y2: y
            })
            return
        }
        currentTarget = createLine(pointerStart.x, pointerStart.y, x, y)
    }
    if (shape === 'ellipse') {

        if (currentTarget) {
            updateSVG(currentTarget, {
                cx: (pointerStart.x + x) / 2,
                cy: (pointerStart.y + y) / 2,
                r: Math.sqrt((pointerStart.x - x - 1) ** 2 + (pointerStart.y - y - 1) ** 2) / 2
            })
            return
        }
        currentTarget = createCircle(pointerStart.x, pointerStart.y, x, y);

    }


}

function mousedownHandler(ev) {
    svgCanvas.remove('mousemove', mousemoveHandler)
    let x = ev.pageX - offsetX
    let y = ev.pageY - offsetY
    //层级如何保证看到的是置于顶层的
    let target = ev.target
    flagDraw = true
    if (pointerValue[shape] === 'default') {
        dargFalg = true
    }
    if (target.getAttribute('id') && target.getAttribute('id').startsWith('tip')) {
        editFalg = true
        selectTip = target
        let id = parseInt(selectTip.getAttribute('id').split('_')[1])
        //获取固定点
        var rectPointMap = {
            "0": "2",
            "1": "3",
            "2": "0",
            "3": "1"
        }
        let point = "#tip_" + rectPointMap[id]
        let x1 = parseInt($(point).attr('cx'))
        let y1 = parseInt($(point).attr('cy'))
        pointerStart = {
            x: x1, y: y1
        }
        return
    }
    pointerStart = {
        x, y
    }

}

