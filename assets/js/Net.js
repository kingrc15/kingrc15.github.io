function loop(net, iter, int) {
    setTimeout(net.backprop(), int)
}

function SetUp(){
    net = new Net(trainingInputs, trainingInputs, trainingInputs, trainingInputs);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Net{
    constructor(trainingInputs, trainingOutputs, testInputs, testOuputs){
        this.leftBuffer = 75;
        this.topBuffer = 200;
        this.ySpacing = 100;
        this.xSpacing = 500;
        this.trainingInputs = trainingInputs;
        this.trainingOutputs = trainingOutputs;
        this.testInputs = testInputs;
        this.testOuputs = testOuputs;
        this.numLayers = document.getElementById("NumLayers").value;
        var layOpt, numNodes;
        this.layers = [];
        this.sizes = [];
        for (var x = 0; x < this.numLayers; x++){
            numNodes = document.createElement("input")
            numNodes.type = "Number";
            numNodes.style.position = "absolute";
            numNodes.style.left = x*this.xSpacing + this.leftBuffer - 40 + 'px';
            numNodes.style.top = this.topBuffer - 100 + "px";
            numNodes.id = "numNodes" + x;
            document.body.appendChild(numNodes);
            if (x != 0){
                layOpt = document.getElementById("layerOptions").cloneNode(true);
                layOpt.style.display = "inline";
                layOpt.style.left = x*this.xSpacing + this.leftBuffer-27 + 'px';
                layOpt.style.top = this.topBuffer - 65 + 'px';
                layOpt.id = "layOpt" + x;
                document.body.appendChild(layOpt);
            }
        }
        document.getElementById("SetUp").disabled = true;
        document.getElementById("CreateNet").disabled = false;
    }

    feedforward(input){
        var a = input
        document.getElementById("Layer0").act = a
        for (var x = 1; x < this.layers.length + 1; x++){
            var lay = document.getElementById("Layer" + x)
            var z = multiply(lay.weights, a).map(function (num, idx) { return parseFloat(num) + parseFloat(lay.biases[idx]);});
            a = window[this.layers[x-1]](z)
            lay.zs = z
            lay.act = a
        }
    }

    backprop(){
        var d, idx, lay, preLay, prime, wUpdate, cost;
        for (var x = 0; x < this.batchSize; x++){
            idx = Math.floor(Math.random()*this.trainingInputs.length);
            this.feedforward(this.trainingInputs[idx]);
            for (var y = this.layers.length; y > 0; y--){
                lay = document.getElementById("Layer" + y);
                preLay = document.getElementById("Layer" + (y-1));
                prime = window[this.layers[y-1]+"Prime"](lay.zs);
                if (y == this.layers.length){
                    cost = costDerivative(lay.act, trainingOutputs[idx]);
                    d = prime.map(function(p, i) { return p * cost[i];});
                } else{
                    d = prime.map(function(p, i) { return p * d[i];});
                }
                lay.gradUpdateB = lay.gradUpdateB.map(function(u, i){ return u + d[i]});
                wUpdate = multiply(d,transpose(preLay.act));
                for (var z = 0; z < wUpdate.length; z++){
                    lay.gradUpdateW[z] = lay.gradUpdateW[z].map(function(u, i){ 
                        return parseFloat(u) + parseFloat(wUpdate[z][i]);
                    });
                }
                d = transpose(multiply(transpose(d),lay.weights))[0][0];
            }
        }
        for (var x = 1; x < this.layers.length + 1; x++){
            lay = document.getElementById("Layer" + x);
            window[this.optMethod](lay, this.batchSize, this.LR);
        }
        this.drawWeights();
        this.evaluate();
    }

    validateFields(){
        var valid = true;
        for (var x = 0; x < this.numLayers; x++){
            if(document.getElementById("numNodes" + x).value == ''){ valid = false }
            if (x != 0){
                if(document.getElementById("layOpt" + x).value == 'Select Layer Type'){ valid = false }
            }
        }
        if (valid){
            document.getElementById("CreateNet").disabled = true;
            document.getElementById("backprop").disabled = false;
            document.getElementById("loop").disabled = false;
            net.createLayers();
        }
    }

    createLayers(){
        for (var x = 0; x < this.numLayers; x++){
            this.sizes.push(document.getElementById("numNodes" + x).value);
            if (x != 0){
                var y = document.getElementById("layOpt" + x);
                y = y.childNodes
                this.layers.push(y[1].value);
            }
        }
        this.optMethod = ['SGD'];
        this.batchSize = 2;
        this.LR = 10;
        this.maxLayer =  Math.max.apply(null,this.sizes);
        var tmp, tmpX, tmpY, X, Y, wTmp;
        for (var x = 0; x < this.sizes.length; x++){
            this.layer = document.createElement("div");
            this.layer.id = "Layer" + x
            this.layer.type = this.layers[x]
            this.layer.act = []
            if (x != 0){
                this.layer.biases = []
                this.layer.weights = []
                this.layer.gradUpdateW = []
                this.layer.zs = []
            }
            for (var y = 0; y < this.sizes[x]; y++){
                this.node = document.createElement("div");
                this.node.className = "dot";
                this.node.style.top = y * this.ySpacing + (this.maxLayer - this.sizes[x]) * this.ySpacing / 2 + this.topBuffer + 'px';
                this.node.style.left = this.xSpacing * x + this.leftBuffer + 'px';
                this.node.weights = [];
                this.node.id = "Node" + (x + 1) + (y + 1);
                if(x != 0){
                    this.node.bias = 0;
                    this.layer.biases.push(this.node.bias);
                    this.node.innerHTML = this.node.bias.toFixed(2);
                    for (var z = 0; z < this.sizes[x-1]; z++){
                        tmp = document.getElementById("Node" + (x) + (z + 1));
                        tmpX = parseFloat(tmp.style.left.replace(/px/,""));
                        tmpY = parseFloat(tmp.style.top.replace(/px/,""));
                        X = parseFloat(this.node.style.left.replace(/px/,""));
                        Y = parseFloat(this.node.style.top.replace(/px/,""));
                        this.node.weights.push(window[this.layers[x-1] + "Init"](this.sizes[x-1]));
                        this.node.weight = document.createElement("div");
                        this.node.weight.className = "line";
                        this.node.weight.id = "weight" + x + z + y;
                        this.node.weight.style.width = Math.sqrt(Math.pow(X - tmpX,2) + Math.pow(Y - tmpY,2)) + 'px';
                        this.node.weight.style.transform = "rotate(" + Math.atan((Y - tmpY)/(X - tmpX))*180/3.14159 + "deg)";
                        this.node.weight.style.left = (X + tmpX) / 2 - 25 + 'px';
                        this.node.weight.style.top = (Y  + tmpY)/2 + 25 + 'px';
                        document.body.appendChild(this.node.weight);
                    }
                    this.layer.gradUpdateW.push(new Array(this.node.weights.length).fill(0))
                    this.layer.weights.push(this.node.weights);
                }
                this.layer.appendChild(this.node);
            }
            if(x != 0){
                this.layer.gradUpdateB = new Array(this.layer.biases.length).fill(0)
                this.layer.gradUpdateB = this.layer.gradUpdateB.fill(0)
                for (var y = 0; y < this.sizes[x]; y++){
                    for (var z = 0; z < this.sizes[x-1]; z++){
                        wTmp = document.getElementById("weight" + x + z + y);
                        wTmp.style.left = parseFloat(wTmp.style.left.replace(/px/,"")) - Math.abs(wTmp.getBoundingClientRect().x - (this.xSpacing * (x-1) + this.leftBuffer)) + 25 + 'px'
                    }
                }
            }
            document.body.appendChild(this.layer);
        }
        this.drawWeights();
        for (var x = 0; x < this.numLayers; x++){
            document.getElementById("numNodes" + x).disabled = true;
            if (x != 0){
                document.getElementById("dd").disabled = true;
            }
        }
    }

    drawWeights(){
        var lay, wTmp,nTmp;
        for (var x = 0; x < this.sizes.length; x++){
            lay = document.getElementById("Layer" + x);
            for (var y = 0; y < this.sizes[x]; y++){
                for (var z = 0; z < this.sizes[x-1]; z++){
                    wTmp = document.getElementById("weight" + x + z + y);
                    if (lay.weights[y][z] < 0){
                        wTmp.style.borderBottom = "solid red";
                    } else {
                        wTmp.style.borderBottom = "solid green";
                    }
                    wTmp.style.opacity = Math.abs(lay.weights[y][z]*4);
                    wTmp.innerHTML = lay.weights[y][z].toFixed(2);
                }
                if (x != 0){
                    nTmp = document.getElementById("Node" + (x + 1) + (y + 1))
                    nTmp.innerHTML = lay.biases[y].toFixed(2)
                }
            }
        }
    }

    evaluate(){
        document.getElementById("Cost").innerHTML = "Cost = " + this.cost();
        document.getElementById("Accuracy").innerHTML = "Accuracy = " + this.accuracy();
    }

    cost(){
        var result, lay;
        var cost = 0;
        for (var x = 0; x < this.testInputs.length; x++){
            lay = document.getElementById("Layer" + (this.sizes.length-1));
            for (var y = 0; y < lay.act.length; y++){
                cost += Math.abs(this.testOuputs[x][y] - lay.act[y]);
            }
        }
        return cost;
    }

    accuracy(){
        var maxA, maxAI, maxY, maxYI, lay;
        var acc = 0, tot = 0;
        for (var x = 0; x < this.testInputs.length; x++){
            maxA = 0;
            maxAI = 0;
            maxY = 0;
            maxYI = 0;
            lay = document.getElementById("Layer" + (this.sizes.length-1));
            for (var y = 0; y < lay.act.length; y++){
                if (this.testOuputs[x][y] > maxA){
                    maxA = this.testOuputs[x][y];
                    maxAI = y;
                }
                if (lay.act[y] > maxY){
                    maxY = lay.act[y];
                    maxYI = y;
                }
                if (maxAI == maxYI){
                    acc++;
                }
                tot++;
            }
        }
        return acc/tot;
    }
}

//Optimization Techniques 

function SGD(layer, batchSize, LR){
    layer.biases = layer.biases.map(function(b, i) {
        update = layer.gradUpdateB[i] / batchSize * LR;
        return b - update;
    })
    layer.gradUpdateB.fill(0)
    for (var x = 0; x < layer.weights.length; x++){
        layer.weights[x] = layer.weights[x].map(function(w,i) {
            update = layer.gradUpdateW[x][i] / batchSize * LR;
            layer.gradUpdateW[x][i] = 0;
            return w - update;
        });
    }
    layer.gradUpdateB.fill(0);
}

//Activation functions

function Sigmoid(z){
    return z.map(function (idx) { return 1/(1 + Math.exp(-idx));});
}

function SigmoidPrime(z){
    return z.map(function (idx) { return (1/(1 + Math.exp(-idx)))*(1-(1/(1 + Math.exp(-idx))));});
}

function SigmoidInit(preLaySize) {
    return Math.random()/Math.sqrt(1/preLaySize)
}

function TanH(z){
    return z.map(function(idx){ return Math.tanh(idx);})
}

function TanHPrime(z){
    return z.map(function(idx){ return 1 - Math.pow(Math.tanh(idx),2);})
}

function TanHInit(preLaySize) {
    return (Math.random()-0.5)/Math.sqrt(1/preLaySize)
}

function ReLU(z){
    return z.map(function (idx) { return idx * (idx >= 0);});
}

function ReLUPrime(z){
    console.log(z.map(function (idx){if (idx >= 0){return 1;} else {return 0;}}))
    return z.map(function (idx) { 
        if (idx >= 0){
            return 1;
        } else {
            return 0;
        }
    });
}

function ReLUInit(preLaySize) {
    return Math.random()/Math.sqrt(2/preLaySize)
}

//Cost Functions

function costDerivative(a,y){
    return a.map(function (a, i) { return a - y[i];});
}

//Math

function multiply(a, b) {
    var aNumRows = a.length, aNumCols = a[0].length, bNumRows = b.length, bNumCols = b[0].length,
    m = new Array(aNumRows);  // initialize array of rows
    if (bNumCols == null) bNumCols = 1;
    if (aNumCols == null) aNumCols = 1;
    for (var r = 0; r < aNumRows; ++r) {
        m[r] = new Array(bNumCols); // initialize the current row
        for (var c = 0; c < bNumCols; ++c) {
            m[r][c] = 0;             // initialize the current cell
            for (var i = 0; i < aNumCols; ++i) {
                if (bNumCols == 1) {
                    m[r][c] += a[r][i] * b[i];
                } else if (aNumCols == 1) {
                    m[r][c] += a[r] * b[i][c];
                } else {
                    m[r][c] += a[r][i] * b[i][c];
                }
            }
        }
    }
    //console.log("m = ", m[0][0])
    return m;
}

function transpose(array){
    var newArray = [];
    arrayLength = 1;
    for(var i = 0; i < arrayLength; i++){
        newArray.push([]);
    };

    for(var i = 0; i < array.length; i++){
        for(var j = 0; j < arrayLength; j++){
            newArray[j].push(array[i]);
        };
    };

    return newArray;
}

trainingInputs = [[1,0,0,0,0],[0,1,0,0,0],[0,0,1,0,0]];
trainingOutputs = [[1,0,0],[0,1,0],[0,0,1]];