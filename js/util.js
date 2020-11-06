let pointerValue = {
    "rect": "crosshair",
    "select": "default",
    "move": "move",
    "line": "crosshair",
    "fhpath": "crosshair",
    "eyedropper": "crosshair",
    "text": "crosshair",
    "zoom": "crosshair",
    "path": "crosshair",
    "ellipse": "crosshair",
    "circle": "circle",
}
let shapeTextMap = {
    "rect": "矩形",
    "select": "default",
    "move": "move",
    "line": "直线",
    "fhpath": "crosshair",
    "eyedropper": "crosshair",
    "text": "crosshair",
    "zoom": "crosshair",
    "path": "crosshair",
    "ellipse": "crosshair",
    "circle": "圆形",
}
function getElementToPageLeft(el, key) {
    let offset = key == 'top' ? 'offsetTop' : 'offsetLeft'
    let actualTop = el[offset]
    let current = el.offsetParent
    while (current !== null) {
        actualTop += current[offset]
        current = current.offsetParent
    }
    return actualTop
}

/**
 * 切换左侧工具栏样式
 * @param el
 */
function toogleClass(el) {
    let target = $(el)
    if (target.hasClass('tool_button')) {
        target.removeClass('tool_button').siblings().addClass("tool_button")
        target.addClass('tool_button_current').siblings().removeClass("tool_button_current")
        shape = target.attr('id') && target.attr('id').split('_')[1]
        svgCanvas.css("cursor", pointerValue[shape])
    }
}

/**
 * 修改右侧面板属性
 * @param name
 * @param selectPanel
 * @param obj
 * @returns {boolean}
 */
function selectPanelUpdateCSS(name,selectPanel, obj) {
    if (!selectPanel) return false
    //rect-sel-stroke-width  线条大小
    let style = {
        "stroke-dasharray": '2 2'
    }
    selectPanel.find("#shape-text").text(shapeTextMap[name])
    selectPanel.find("#sel-stroke-width").val(obj["stroke-width"])
    // rect-sel-line-style  线条样式
    selectPanel.find("#sel-line-style").val(obj['stroke-dasharray'])
    // rect-sel-stroke      线条颜色
    selectPanel.find("#sel-stroke").val(obj.stroke)
    // rect-sel-fill-color  填充颜色
    selectPanel.find("#sel-fill-color").val(obj.fill)
    selectPanel.css('display', 'block')
    return true
}

/**
 * 绘制矩形
 * @param x
 * @param y
 * @param x1
 * @param y1
 * @returns {*}
 */
function createSVGRact(x, y, x1, y1) {
    let width = Math.sqrt((x - x1) ** 2)
    let height = Math.sqrt((y - y1) ** 2)
    let rect = draw.rect(width, height).attr({
        x, y,
        fill: 'transparent'
        , stroke: '#000'
        , 'stroke-width': 1
    })
    return rect
}

/**
 * 绘制圆形
 * @param px
 * @param py
 * @param x
 * @param y
 * @param r
 * @returns {[]|void|*}
 */
function createCircle(px, py, x, y, r) {
    r = r ? r : Math.sqrt((px - x) ** 2 + (py - y) ** 2) / 2
    return draw.circle().attr({
        "cx": (px + x) / 2,
        "cy": (py + y) / 2,
        fill: 'transparent'
        , stroke: '#000'
        , 'stroke-width': 1
    })
}

/**
 * 绘制选中辅助圆点
 * @param x
 * @param y
 * @param r
 * @param index
 * @returns {SVGCircleElement}
 */
function createCircleTip(x, y, r, index) {
    // return draw.circle().attr({
    //     "cx": x,
    //     "cy": y,
    //     id: "tip_" + index,
    //     r,
    //     fill: '#14ff00'
    //     , stroke: '#14ff00'
    //     , 'stroke-width': 1
    // })
    var c = document.createElementNS(nameSpace, 'circle');
    c.setAttribute('r', r);
    c.setAttribute('id', "tip_" + index);
    c.setAttribute('cx', x);
    c.setAttribute('cy', y);
    c.setAttribute('fill', "#14ff00");
    c.setAttribute('stroke-width', '1');
    c.setAttribute('stroke', '#14ff00');
    return c
}

/**
 * 绘制直线
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns {undefined|*|null|jQuery|HTMLElement}
 */
function createLine(x1, y1, x2, y2) {
    return draw.line().attr({
        x1, y1, x2, y2,
        fill: 'transparent'
        , stroke: '#000'
        , 'stroke-width': 4
    })
}

/**
 * 更新图形属性
 * @param target
 * @param config
 * @returns {{attr}|*}
 */
function updateSVG(target, config) {
    target.attr && target.attr(config)
    return target
}

/**
 *
 * 创建绘制点插入到svg中
 * @param target
 * @param selectorCir
 */
function createSelectTips(target, selectorCir) {
    selectorCir.html("")
    let retPoint = createPoint(target)
    retPoint.forEach((item, index) => {
        selectorCir.append(createCircleTip(item.x, item.y, 5, index))
    })
    selectorCir.css("display", "block")
}

/**
 * 删除提示点
 * @param selectorCir
 */
function removeSelectTips(selectorCir) {
    selectorCir.html("")

}

/**
 * 根据选中图形创建提示点坐标
 * @param target
 * @returns {*|*[]}
 */
function createPoint(target) {
    let nodeName = target.nodeName ? target.nodeName : target[0].nodeName

    return createPointInfo[nodeName] ? createPointInfo[nodeName](target) : []
}

/**
 * 创建具体提示点坐标
 * @type {{rect: (function(*): []), line: (function(*): []), circle: (function(*): [])}}
 */
let createPointInfo = {
    "rect": function (target) {
        let rect = []
        let x = isNaN(parseInt(target.attr("x"))) ? 0 : parseInt(target.attr("x"))
        let y = isNaN(parseInt(target.attr("y"))) ? 0 : parseInt(target.attr("y"))
        let height = parseInt(target.attr("height"))
        let width = parseInt(target.attr("width"))
        rect.push({
            x: x,
            y: y
        }, {
            x: x + width, y
        }, {
            x: x + width, y: y + height
        }, {
            x: x, y: y + height
        })
        return rect
    },
    "line": function (target) {
        let line = []
        let x1 = parseInt(target.attr("x1"))
        let y1 = parseInt(target.attr("y1"))
        let x2 = parseInt(target.attr("x2"))
        let y2 = parseInt(target.attr("y2"))
        line.push({
            x: x1 - 1, y: y1 - 1
        }, {
            x: x2 + 1, y: y2 + 1
        })

        return line
    },
    "circle": function (target) {
        let line = []
        let x = parseInt(target.attr("cx"))
        let y = parseInt(target.attr("cy"))
        let r = parseInt(target.attr("r"))
        line.push({
            x: x - r, y: y - r
        }, {
            x: x + r, y: y - r
        }, {
            x: x + r, y: y + r
        }, {
            x: x - r, y: y + r
        })

        return line
    }
}

/**
 * 多数相加
 * @param rest
 * @returns {*}
 */
function addNum(...rest) {
    return rest.reduce((prev, cur) => {
        return prev + parseInt(cur)
    }, 0)
}

function minNum(a, b) {
    return parseInt(a) - parseInt(b)
}

/**
 * 计算两点之间直线的距离
 * @param x
 * @param y
 * @param x1
 * @param y1
 * @returns {number}
 */
function computeDistance(x, y, x1, y1) {
    return Math.sqrt((x - x1) ** 2 + (y - y1) ** 2)
}