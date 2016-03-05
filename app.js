function Painter(canvas) {
    var self = this;
    
    this.init = function() {
        self.canvas = canvas;
        self.ctx = self.canvas.getContext("2d");
    };
    
    this.rect = function(x,y,dx,dy,c) {
        self.ctx.fillStyle = c;
        self.ctx.fillRect(x,y,dx,dy);  
    };
    
    this.width = function() {
        return self.canvas.width;
    };
    
    this.height = function() {
        return self.canvas.height;
    };
    
    this.background = function(c) {
        self.rect(0, 0, self.width(), self.height(), c);
    };
    
    this.cell = function(x, y, c) {
        self.rect(x*self.cellDx, y*self.cellDy, self.cellDx, self.cellDy, c);
    };
    
    this.setCellSize = function(matrix) {
        self.cellDx = self.width() / matrix.length;
        self.cellDy = self.height() / matrix[0].length;
    };
    
    this.repaint = function(matrix, bgCol, fgCol) {
        self.setCellSize(matrix);
        self.background(bgCol);
        for (var y = 0; y<matrix.length; y++) {
            var row = matrix[y];
            for (var x = 0; x<row.length; x++) {
                self.cell(x, y, row[x] ? fgCol : bgCol);
            }
        }
    };
    
    this.init();
}

function Life() {
    var self = this;
    
    this.init = function() {
        self.canvas = document.getElementById("canvas");
        self.painter = new Painter(self.canvas);
        self.matrixSize = 40;
        
        self.start();
    }
    
    this.update = function(matrix, x, y, value) {
        matrix[y][x] = value;
    };
    
    this.read = function(matrix, x, y) {
        var value = matrix[y][x];
        return value;
    };
    
    this.createMatrix = function(dim) {
        var matrix = [];
        for (var y=0; y<dim; y++) {
            matrix.push(Array.apply(null, Array(dim)).map(Number.prototype.valueOf, 0));
        }
        return matrix;
    };
    
    this.random = function(max) {
        return Math.floor(Math.random() * max);  
    };
    
    this.generateSeed = function() {
        for (var i=0; i<self.matrixSize*5; i++) {
            var x = self.random(self.matrixSize);
            var y = self.random(self.matrixSize);
            self.update(self.matrix, x, y, 1);
        }
    };
    
    this.start = function() {
        self.matrix = self.createMatrix(self.matrixSize);
        self.generateSeed();
        self.paint();
        setTimeout(self.nextStep, 200);
    };
    
    this.nextStep = function() {
        self.matrix = self.updateCells();
        self.paint();
        setTimeout(self.nextStep, 100);
    };
    
    this.isCellAlive = function(x, y) {
        return self.read(self.matrix, x, y) ? true : false;
    };
    
    this.countNeighbors = function(x, y) {
        var count = 0;
        for (var _x=x-1; _x<=x+1; _x++) {
            for (var _y=y-1; _y<=y+1; _y++) {
                if (_x == x && _y == y)
                    continue;
                var safeX = _x < 0 ? self.matrixSize-1 : (_x >= self.matrixSize ? 0 : _x);
                var safeY = _y < 0 ? self.matrixSize-1 : (_y >= self.matrixSize ? 0 : _y);
                var alive = self.isCellAlive(safeX, safeY);
                if (alive) {
                    count += 1;
                }
            }
        }
        return count;
    };
    
    this.updateCells = function() {
        var nextMatrix = self.createMatrix(self.matrixSize);
        for (var y=0; y<self.matrixSize; y++) {
            for (var x=0; x<self.matrixSize; x++) {
                var isAlive = self.isCellAlive(x, y);
                var neighbors = self.countNeighbors(x, y);
                if (isAlive) {
                    if (neighbors > 1 && neighbors < 4)
                        self.update(nextMatrix, x, y, 1);
                } else {
                    if (neighbors == 3)
                    self.update(nextMatrix, x, y, 1);
                }
            }
        }
        
        return nextMatrix;
    };
    
    this.paint = function() {
        self.painter.repaint(self.matrix, "#333333", "#AAAAAA");
    };
    
    this.init();
}

$(document).ready(function() {
    new Life();
});

