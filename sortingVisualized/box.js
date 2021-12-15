
import {vec3, vec2, vec4 } from "./libs/MV.js";

const ASPECT = 255;

export default class Box{
    constructor(size){
        this.size = size;
        this._value = -1;
        while(this._value < 0)
            this._value = Math.round(Math.random()*ASPECT - Math.random()*20);
            


        this._scale = vec3(this.size, this._value, this.size);
    
        if(this._value < 100)
            this._color = vec3(0, 255 - this._value, 0);
        else if(this._value < 190)
            this._color = vec3(0, 0, 255 - this._value);
        else if(this._value <= 255)
            this._color = vec3(this._value,0, 0);
        else
            this._color = vec3(255, 0, 0);

        console.log("R: "+ this._color[0] +" G: "+ this._color[1] +" B: "+ this._color[2]);
    }

    get value(){return this._value;}

    set value(new_value){this._value = new_value;}

    get pos(){return this.position;}

    set pos(new_pos){this.position = new_pos;}

    get scale(){return this._scale;}

    set scale(new_value){this._scale = new_value;}

    get color(){return this._color;}

    set color(new_color){this._color = new_color;}



}