let nameSpace = 'http://www.w3.org/2000/svg';
let menu_bar = document.querySelector('#menu_bar')
let color_hex = document.querySelector('#color-hex')
let tools_left = document.querySelector('#tools_left')
let svgcontent = document.querySelector('#svgcontent')
let element = SVG(svgcontent)
let draw = SVG().addTo('#svgcontent')


let tool_select = document.querySelector('#tool_select')
let selectorCir = document.querySelector('#selectorCir')
let svgRact = svgcontent.getBoundingClientRect()
let svgCanvas = document.querySelector('#svgcanvas')
let offsetX = svgRact.left
let offsetY = svgRact.top
let shape = 'select' //tools找对应鼠标样式
let suffix = '_panel'
let selectPanel;
let currentTarget = null
let selectSVG = null
let selectTip = null
let selectParams = {}
let dargFalg = false
let editFalg = false
let flagDraw = false,
    pointerStart = {
        x: 0, y: 0
    },
    pointerEnd = {
        x: 0, y: 0
    };

var attrsToConvert = {
    "line": ['x1', 'x2', 'y1', 'y2'],
    "circle": ['cx', 'cy', 'r'],
    "ellipse": ['cx', 'cy', 'rx', 'ry'],
    "foreignObject": ['x', 'y', 'width', 'height'],
    "rect": ['x', 'y', 'width', 'height'],
    "image": ['x', 'y', 'width', 'height'],
    "use": ['x', 'y', 'width', 'height'],
    "text": ['x', 'y']
};


