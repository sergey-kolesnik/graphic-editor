            let color = '#000000';
let pallete = document.getElementById('color-picker');
let shapePallete = document.getElementById('shape-picker');

for (let btn of pallete.getElementsByTagName('button')) {
    btn.style.setProperty('background-color', btn.dataset.color);
}

pallete.addEventListener('click', function(event){
    let target = event.target;
    let btn = target.closest('button.color');
    if ( ( (btn === undefined) || (btn === null) || (btn.tagName != 'BUTTON') || (! pallete.contains(btn)) ) ) {
        return;
    }
    color = btn.dataset.color;
    pallete.querySelector('button.selected').classList.remove('selected');
    btn.classList.add('selected');
});


shapePallete.addEventListener('click', function(event){
    let target = event.target;
    let btn = target.closest('button.shape');
    if ( ( (btn === undefined) || (btn === null) || (btn.tagName != 'BUTTON') || (! shapePallete.contains(btn)) ) ) {
        return;
    }
    shapeType = btn.dataset.shape;
    shapePallete.querySelector('button.selected').classList.remove('selected');
    btn.classList.add('selected');
});

let shapeType = 'line';
let canvas = document.getElementById('canvas');
let startCoords = {};

let currentShape;

canvas.addEventListener('mousedown', function(event) {
    startCoords.x = event.pageX;
    startCoords.y = event.pageY;
});

let calcRadius = function(startCoordinates, endCoordinates) {
    let dx = (startCoordinates.x - endCoordinates.x),
        dy = (startCoordinates.y - endCoordinates.y);
    return Math.sqrt(dx ** 2 + dy ** 2);
    // return (dx ** 2 + dy ** 2) ** 0.5;
};

let drawLine = function(startCoordinates, endCoordinates) {
    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute('x1', startCoordinates.x);
    line.setAttribute('y1', startCoordinates.y);
    line.setAttribute('x2', endCoordinates.x);
    line.setAttribute('y2', endCoordinates.y);
    line.setAttribute('stroke', color);
    canvas.appendChild(line);
    return line;
};

let drawCircle = function(startCoordinates, endCoordinates) {
    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute('cx', startCoordinates.x);
    circle.setAttribute('cy', startCoordinates.y);
    circle.setAttribute('r', calcRadius(startCoordinates, endCoordinates));
    circle.setAttribute('stroke', color);
    circle.setAttribute('fill', 'none');
    canvas.appendChild(circle);
    return circle;
};

let drawRectangle = function(startCoordinates, endCoordinates) {
    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute('x', Math.min(startCoordinates.x, endCoordinates.x));
    rect.setAttribute('y', Math.min(startCoordinates.y, endCoordinates.y));
    rect.setAttribute('width', Math.abs(endCoordinates.x - startCoordinates.x));
    rect.setAttribute('height', Math.abs(endCoordinates.y - startCoordinates.y));
    rect.setAttribute('stroke', color);
    rect.setAttribute('fill', 'none');
    canvas.appendChild(rect);
    return rect;
};


let drawShape = function(startCoordinates, endCoordinates) {
    if (shapeType == 'line') {
        return drawLine(startCoordinates, endCoordinates);
    } else if (shapeType == 'circle') {
        return drawCircle(startCoordinates, endCoordinates);
    } else if (shapeType == 'rectangle') {
        return drawRectangle(startCoordinates, endCoordinates);
    } else {
        console.log(`Error: tool ${shapeType} not exists.`);
    }
}

canvas.addEventListener('mouseup', function(event) {
    let endCoords = {
        x: event.pageX,
        y: event.pageY,
    };
    drawShape(startCoords, endCoords);
});

canvas.addEventListener('mousemove', function(event) {
    if (event.buttons == 0) {
        return;
    }

    let endCoords = {
        x: event.pageX,
        y: event.pageY,
    };
    
    if ((currentShape !== null) && (currentShape !== undefined)) {
        canvas.removeChild(currentShape);
    }

    currentShape = drawShape(startCoords, endCoords);
});