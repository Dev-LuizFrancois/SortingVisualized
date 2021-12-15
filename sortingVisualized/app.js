import { buildProgramFromSources, loadShadersFromURLS, setupWebGL } from "./libs/utils.js";
import { ortho, lookAt, flatten, vec3} from "./libs/MV.js";
import {modelView, loadMatrix, multScale, multTranslation, popMatrix, pushMatrix} from "./libs/stack.js";

import * as CUBE from './libs/cube.js';
import {Algorithms, BUBBLE_SORT, SELECTION_SORT, INSERTION_SORT, QUICK_SORT} from './sortingAlgos.js';
import Box from './box.js';


/** @type WebGLRenderingContext */

//WEBGL Variables
let gl;       
let mode;// Drawing mode (gl.LINES or gl.TRIANGLES)

//State of Algo
const WAITING = "WAITING";
const READY = "READY"
const SORTING = "SORTING";
const SORTED = "SORTED";

//State of HTML DIVs
const HIDDEN = "hidden";
const VISIBLE = "visible";

const VP_DISTANCE = 250; // Size in canvas coords

const DEFAULT_BOX_SIZE = 5;


//Algorithm Variables
let algo;
var values = [];
var num_boxes;

//Animation Variables
var relative_distance;
var num_steps;
let speed;
var swap_queue = [];
var boxes = [];
var current_size;

//State Variables
let state;



function setup(shaders)
{
    let canvas = document.getElementById("gl-canvas");
    let aspect = canvas.width / canvas.height;

    gl = setupWebGL(canvas);

    let program = buildProgramFromSources(gl, shaders["shader.vert"], shaders["shader.frag"]);

    let mProjection = ortho(-VP_DISTANCE*aspect,VP_DISTANCE*aspect, -VP_DISTANCE, VP_DISTANCE,-3*VP_DISTANCE,3*VP_DISTANCE);

    /* INITIALIZING GLOBAL VARIABLES */
    mode = gl.LINES;
    state = WAITING;
    algo = new Algorithms(values);
    speed = 2;
    num_boxes = 0;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    CUBE.init(gl);
    gl.enable(gl.DEPTH_TEST);   // Enables Z-buffer depth test
    
    window.requestAnimationFrame(render);

    function resize_canvas(event)
    {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        aspect = canvas.width / canvas.height;

        gl.viewport(0,0,canvas.width, canvas.height);
        mProjection = ortho(-VP_DISTANCE*aspect,VP_DISTANCE*aspect, -VP_DISTANCE, VP_DISTANCE,-3*VP_DISTANCE,3*VP_DISTANCE);
    }

    function uploadModelView()
    {
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "mModelView"), false, flatten(modelView()));
    }

    
    function assingValues()
    {       
        var x = -VP_DISTANCE*aspect + current_size;
        var x_max = VP_DISTANCE*aspect*2/(current_size*2);


        for(var i = 0; i<x_max - 1; i++){
            var new_box = new Box(current_size);
            new_box.pos = vec3(x, new_box.scale[1]/2, 0);
            values.push(new_box.value);
            boxes.push(new_box);
            x += (current_size)*2; 

            console.log(new_box.value);
            algo.restart(values);

        }

        num_boxes = boxes.length;
        num_steps = 0;

    }

    function drawBoxes()
    {
        const color = gl.getUniformLocation(program, "fColor");
        for(var i = 0; i<boxes.length; i++){
            pushMatrix();

                gl.uniform3fv(color, flatten(boxes[i].color));

                multTranslation(boxes[i].pos);
                multScale(boxes[i].scale);
                uploadModelView();
                CUBE.draw(gl, program, mode);
            popMatrix();
        }
    }

    function swapAnimation()
    {


        if(state == SORTED)
            return;

        let swap_boxes = swap_queue[0];
        var sI = swap_boxes[0];
        var bI = swap_boxes[1];
        
        if(relative_distance > 0){

            boxes[sI].pos = vec3(boxes[sI].pos[0]-(speed*current_size), boxes[sI].pos[1], boxes[sI].pos[2]);
            boxes[bI].pos = vec3(boxes[bI].pos[0]+(speed*current_size), boxes[bI].pos[1], boxes[bI].pos[2]);
            
            relative_distance -= 1;
            

        }else{
            swap_queue.shift();
            var aux = boxes[sI];
            boxes[sI] = boxes[bI];
            boxes[bI] = aux;
            num_steps++;

            if(swap_queue.length > 0){
                relative_distance = ((boxes[swap_queue[0][0]].pos[0] -  boxes[swap_queue[0][1]].pos[0])/(current_size*speed));
            }
            else
                state = SORTED;
        }

    }

    /*
        CONTROLLER LISTENERS
    */

        resize_canvas();
        window.addEventListener("resize", resize_canvas);

    //Select Algo Options
    var select= document.getElementById("algo-select");
    var option;
        //Bubble Sort
        option = document.createElement("option");
        option.text = "Bubble Sort";
        option.value = BUBBLE_SORT;
        select.add(option);
        //Selection Sort
        option = document.createElement("option");
        option.text = "Selection Sort";
        option.value = SELECTION_SORT;
        select.add(option);
        //Insertion Sort
        option = document.createElement("option");
        option.text = "Insertion Sort";
        option.value = INSERTION_SORT;
        select.add(option);
        //Quick Sort
        option = document.createElement("option");
        option.text = "Quick Sort";
        option.value = QUICK_SORT;
        select.add(option);

    //Random Set Button
    document.getElementById("assing-values").addEventListener("click", function() {
        
        current_size = ((DEFAULT_BOX_SIZE*document.getElementById("box-size").value)/DEFAULT_BOX_SIZE);
        num_boxes = Math.round(current_size - 1);
        boxes = [];
        values = [];
        state = READY;
        assingValues();
    });

    //Sort Button
    document.getElementById("sort").addEventListener("click", function() {
        
        switch (state){

            case READY:
                let id = parseInt(document.getElementById("algo-select").value);
                algo.setAlgo(id, values);
                swap_queue = algo.getSolution();
                relative_distance = ((boxes[swap_queue[0][0]].pos[0] -  boxes[swap_queue[0][1]].pos[0])/(current_size*speed));
                num_steps = 0;
                state = SORTING;
            break;
            case WAITING:
                window.alert("Generate a set to be sorted!");
            break;
            case SORTED:
                window.alert("This set is already sorted!");
            break;
        }
    });


    //Stats Report
    document.getElementById("stats").style.visibility = HIDDEN;
    document.getElementById("time-stats").style.visibility = HIDDEN;

    function statsReport()
    {
        
        document.getElementById("stats").style.visibility = VISIBLE;
        document.getElementById("time-stats").style.visibility = VISIBLE;
        document.getElementById("stat-n-boxes").innerHTML = "Elements: "+num_boxes;
        document.getElementById("stat-n-iter").innerHTML = "Iterations: "+algo.numIter(); 
        document.getElementById("stat-n-steps").innerHTML = "Steps: "+num_steps; 
        document.getElementById("stat-algo").innerHTML = "Algorithm: "+algo.currentAlgo();

        let t_time = algo.algoTime();
        if(t_time <1)
            document.getElementById("sort-time").innerHTML = "Background sorting time: less than 1 ms";
        else
            document.getElementById("sort-time").innerHTML = "Background sorting time:"+ t_time + "ms";
    }
    

    function render()
    {
        window.requestAnimationFrame(render);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        gl.useProgram(program);
        
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "mProjection"), false, flatten(mProjection));
    
        loadMatrix(lookAt([0,VP_DISTANCE,VP_DISTANCE], [0,0,0], [0,1,0]));

        drawBoxes(); //Draw the boxes at current pos
        
        if(state == SORTING){
            statsReport(); //Updates the values shown on the stats cards

            let vel = document.getElementById("ani-speed").value; //Determines how many steps will be considered by render time
            while(state == SORTING && vel > 0){
                swapAnimation();
                vel-=1;
            }
        }
        
            

        
    }
}

const urls = ["shader.vert", "shader.frag"];
loadShadersFromURLS(urls).then(shaders => setup(shaders))