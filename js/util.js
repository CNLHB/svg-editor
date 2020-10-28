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
        var x = e.offsetX || e.layerX;
        var y = e.offsetY || e.layerY;
        ev.target.setAttribute('x', '' + x);
        ev.target.setAttribute('y', '' + y);

    }

}

function createSVGRact(x, y, x1, y1) {
    // var columnStyle = 'stroke: black; fill: transparent';
    var rect = document.createElementNS(nameSpace, 'rect');//creat新的svg节点，rect。
    // rect.style = columnStyle;          //给rect节点设置style
    rect.setAttribute('width', Math.sqrt((x - x1) ** 2)); //使用setAttribute来设置rect节点属性
    rect.setAttribute('height', Math.sqrt((y - y1) ** 2));
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('fill', 'transparent');
    rect.setAttribute('stroke-width', '1');
    rect.setAttribute('stroke', 'black');

    svgcontent.appendChild(rect)
    return rect
}

function updateSVGRact(target, config) {
    Object.keys(config).forEach((item) => {
        target.setAttribute(item, config[item])
    })
    return target
}

function createCircle(px, py, x, y, r) {
    var c = document.createElementNS(nameSpace, 'circle');
    c.setAttribute('r', r ? r : Math.sqrt((px - x) ** 2 + (py - y) ** 2) / 2);
    c.setAttribute('cx', [px + x] / 2);
    c.setAttribute('cy', [py + y] / 2);
    c.setAttribute('fill', 'transparent');
    c.setAttribute('stroke-width', '1');
    c.setAttribute('stroke', 'black');
    svgcontent.appendChild(c);
    return c
}

function createCircleTip(x, y, r) {
    var c = document.createElementNS(nameSpace, 'circle');
    c.setAttribute('r', r);
    c.setAttribute('id', "tips" + Math.round(Math.random() * 1000));
    c.setAttribute('cx', x);
    c.setAttribute('cy', y);
    c.setAttribute('fill', "#14ff00");
    c.setAttribute('stroke-width', '1');
    c.setAttribute('stroke', '#14ff00');
    return c
}

function createLine(x1, y1, x2, y2) {
    var c = document.createElementNS(nameSpace, 'line');
    c.setAttribute('x1', x1);
    c.setAttribute('y1', y1);
    c.setAttribute('x2', x2);
    c.setAttribute('y2', y2);
    c.setAttribute('stroke-width', '4');
    c.setAttribute('stroke', 'black');
    svgcontent.appendChild(c);
    return c
}

function createSelectTips(target, selectorCir) {
    let nodeName = target.nodeName
    selectorCir.innerHTML = ''
    let retPoint = createPoint(target)
    retPoint[nodeName].forEach(item => {
        selectorCir.appendChild(createCircleTip(item.x, item.y, 5))
    })
    selectorCir.style.display = 'block'
}

function removeSelectTips(selectorCir) {
    selectorCir.innerHTML = ''

}

function createPoint(target) {
    let nodeName = target.nodeName
    let line = []
    let rect = []
    let circle = []
    if (nodeName == 'rect') {
        let x = parseInt(target.getAttribute("x"))
        let y = parseInt(target.getAttribute("y"))
        let height = parseInt(target.getAttribute("height"))
        let width = parseInt(target.getAttribute("width"))
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

    }
    return {
        line,
        rect,
        circle
    }
}