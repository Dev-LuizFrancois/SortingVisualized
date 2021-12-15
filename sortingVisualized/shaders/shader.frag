precision highp float;


uniform vec3 fColor;

void main() {
    vec3 c = fColor;
    gl_FragColor = vec4(0.5*c, 1.0);
}

