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
}
/**
 *   selectPanel = document.getElementById(name + suffix)
 selectPanel.style.display = "block"
 selectParams = { stroke: target.getAttribute('stroke') }
 target.setAttribute('stroke', 'red');
 createSelectTips(target, selectorCir)
 selectSVG = target
 * @type {{rect: svgHandle.rect, path: string, move: string, select: string, line: string, zoom: string, ellipse: string, fhpath: string, text: string, eyedropper: string}}
 */
let svgHandle = {
    "rect": function (target, selectorCir) {
        createSelectTips(target, selectorCir)
    },
    "select": "default",
    "move": "move",
    "line": function (target, selectorCir) {
        createSelectTips(target, selectorCir)
    },
    "fhpath": "crosshair",
    "eyedropper": "crosshair",
    "text": "crosshair",
    "zoom": "crosshair",
    "path": "crosshair",
    "ellipse": "crosshair",
    "circle": function (target, selectorCir) {
        createSelectTips(target, selectorCir)
    }
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

function toogleClass(el) {
    let target = el
    if (target.classList.contains('tool_button')) {
        target.classList.toggle('tool_button')
        target.classList.toggle('tool_button_current')
        shape = target.id && target.id.split('_')[1]
        svgCanvas.style.cursor = pointerValue[shape]
    }
    let children = target.parentNode.children
    for (let i = 0; i < children.length; i++) {
        if (target != children[i] && children[i].classList.contains("tool_button_current")) {
            children[i].classList.toggle('tool_button')
            children[i].classList.toggle('tool_button_current')
        }
    }
}

function drag(rect) {
    svgcontent.onmousemove = function (ev) {
        var e = ev
        var x = e.offsetX
        var y = e.offsetY
        ev.target.setAttribute('x', '' + x);
        ev.target.setAttribute('y', '' + y);

    }

}

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

function createCircleTip(x, y, r, index) {
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

function createLine(x1, y1, x2, y2) {
    return draw.line().attr({
        x1, y1, x2, y2,
        fill: 'transparent'
        , stroke: '#000'
        , 'stroke-width': 4
    })
}

function updateSVG(target, config) {
    target.attr && target.attr(config)
    return target
}

function createSelectTips(target, selectorCir) {
    selectorCir.innerHTML = ''
    let retPoint = createPoint(target)
    retPoint.forEach((item, index) => {
        selectorCir.appendChild(createCircleTip(item.x, item.y, 5, index))
    })
    selectorCir.style.display = 'block'
}

function removeSelectTips(selectorCir) {
    selectorCir.innerHTML = ''

}

function createPoint(target) {
    let nodeName = target.nodeName ? target.nodeName : target[0].nodeName

    return createPointInfo[nodeName] ? createPointInfo[nodeName](target) : []
}

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

function addNum(...rest) {
    return rest.reduce((prev, cur) => {
        return prev + parseInt(cur)
    }, 0)
}

function minNum(a, b) {
    return parseInt(a) - parseInt(b)
}

function computeDistance(x, y, x1, y1) {
    return Math.sqrt((x - x1) ** 2 + (y - y1) ** 2)
}