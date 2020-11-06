let nameSpace = 'http://www.w3.org/2000/svg',
    menuBar = $('#menu_bar'),
    color_hex = $('#color-hex'),
    toolsLeft = $('#tools_left'),
    tool_select = $('#tool_select'),
    selectorCir = $('#selectorCir'),
    svgcontent = document.querySelector('#svgcontent'),
    element = SVG(svgcontent),
    svgCanvas = $('#svgcanvas'),
    draw = SVG().addTo('#svgcontent'),
    svgRact = svgcontent.getBoundingClientRect(),
    offsetX = svgRact.left,
    offsetY = svgRact.top,
    shape = 'select', //tools找对应鼠标样式
    suffix = '_panel',
    selectPanel = null,
    currentTarget = null,
    selectSVG = null,
    selectTip = null,
    selectParams = {},
    dargFalg = false,
    editFalg = false,
    flagDraw = false,
    pointerStart = {
        x: 0, y: 0
    },
    pointerEnd = {
        x: 0, y: 0
    }



let attrsToConvert = {
    "line": ['x1', 'x2', 'y1', 'y2'],
    "circle": ['cx', 'cy', 'r'],
    "ellipse": ['cx', 'cy', 'rx', 'ry'],
    "foreignObject": ['x', 'y', 'width', 'height'],
    "rect": ['x', 'y', 'width', 'height'],
    "image": ['x', 'y', 'width', 'height'],
    "use": ['x', 'y', 'width', 'height'],
    "text": ['x', 'y']
};


