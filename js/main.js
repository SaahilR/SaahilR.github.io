﻿document.addEventListener("DOMContentLoaded", start);

var gl;
var keys = [];

function start() {
    // Canvas setup
    var canvas = document.getElementById("renderCanvas");
    gl = canvas.getContext("webgl2");

    // Handle Mouse Input
    canvas.requestPointerLock = canvas.requestPointerLock ||
                                canvas.mozRequestPointerLock;

    document.exitPointerLock = canvas.exitPointerLock ||
                            canvas.mozExitPointerLock;

    canvas.onclick = function () {
        canvas.requestPointerLock();
    }

    document.addEventListener('pointerlockchange', lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

    function lockChangeAlert() {
        if (document.pointerLockElement === canvas ||
            document.mozPointerLockElement === canvas) {
            console.log('The pointer lock status is now locked');
            document.addEventListener("mousemove", processMouse, false);
        } else {
            console.log('The pointer lock status is now unlocked');
            document.removeEventListener("mousemove", processMouse, false);
        }
    }

    function processMouse(e) {
        dx = e.movementX;
        dy = e.movementY;

        camera.yaw += 0.005 * dx;
        camera.pitch += -0.005 * dy;
        if (camera.pitch > Math.PI / 2) camera.pitch = Math.PI / 2;
        if (camera.pitch < -Math.PI / 2) camera.pitch = -Math.PI / 2;
    }

    var cubeVertices = [
        -1.0, -1.0, -1.0,   0.0, 0.0, -1.0,  1.0, 0.0,
		-1.0,  1.0, -1.0,   0.0, 0.0, -1.0,  1.0, 1.0,
		 1.0,  1.0, -1.0,   0.0, 0.0, -1.0,  0.0, 1.0,
		 1.0, -1.0, -1.0,   0.0, 0.0, -1.0,  0.0, 0.0,

        -1.0, -1.0,  1.0,   0.0, 0.0, 1.0,   1.0, 0.0,
		-1.0,  1.0,  1.0,   0.0, 0.0, 1.0,   1.0, 1.0,
		 1.0,  1.0,  1.0,   0.0, 0.0, 1.0,   0.0, 1.0,
		 1.0, -1.0,  1.0,   0.0, 0.0, 1.0,   0.0, 0.0,

		 1.0, -1.0, -1.0,   1.0, 0.0, 0.0,   1.0, 0.0, // 8
		 1.0, -1.0,  1.0,   1.0, 0.0, 0.0,   1.0, 1.0,
		 1.0,  1.0,  1.0,   1.0, 0.0, 0.0,   0.0, 1.0,
		 1.0,  1.0, -1.0,   1.0, 0.0, 0.0,   0.0, 0.0, // 11

        -1.0, -1.0, -1.0,  -1.0, 0.0, 0.0,   1.0, 0.0, // 12
		-1.0, -1.0,  1.0,  -1.0, 0.0, 0.0,   1.0, 1.0,
		-1.0,  1.0,  1.0,  -1.0, 0.0, 0.0,   0.0, 1.0,
		-1.0,  1.0, -1.0,  -1.0, 0.0, 0.0,   0.0, 0.0, // 15

        -1.0, 1.0, -1.0,    0.0, 1.0, 0.0,   1.0, 0.0, // 16
		-1.0, 1.0,  1.0,    0.0, 1.0, 0.0,   1.0, 1.0,
		 1.0, 1.0,  1.0,    0.0, 1.0, 0.0,   0.0, 1.0,
		 1.0, 1.0, -1.0,    0.0, 1.0, 0.0,   0.0, 0.0, // 19

        -1.0, -1.0, -1.0,   0.0,-1.0, 0.0,   1.0, 0.0, // 20
		-1.0, -1.0,  1.0,   0.0,-1.0, 0.0,   1.0, 1.0,
		 1.0, -1.0,  1.0,   0.0,-1.0, 0.0,   0.0, 1.0,
		 1.0, -1.0, -1.0,   0.0, -1.0, 0.0,  0.0, 0.0, // 23

        -10.0, -2.0, -10.0,  0.0, 1.0, 0.0,  0.0, 0.0,
        -10.0, -2.0,  10.0,  0.0, 1.0, 0.0,  0.0, 1.0,
         10.0, -2.0,  10.0,  0.0, 1.0, 0.0,  1.0, 1.0,
         10.0, -2.0, -10.0,  0.0, 1.0, 0.0,  1.0, 0.0
    ];

    var cubeIndices = [
        0, 2, 1, 0, 3, 2, // Front
		4, 5, 6, 4, 6, 7, // Back
		8, 9, 10, 8, 10, 11, // Right
		12, 14, 13, 12, 15, 14, // Left
		16, 18, 17, 16, 19, 18, // Top
		20, 21, 22, 20, 22, 23, // Bottom
        24, 25, 26, 24, 26, 27  // Plane
    ];

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);

    var albedo_texture = loadTexture("../textures/color.png");
    var normal_texture = loadTexture("../textures/rock_normal.jpg");
    var rough_texture = loadTexture("../textures/rough.png");
    var metal_texture = loadTexture("../textures/metal.png");

    // Shader Setup
    var shaderProgram = setupShader("mainVertShader", "mainFragShader");
    
    gl.useProgram(shaderProgram);
    // Vertex Array Object
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // Vertex attribute setup (position, color, and texture)
    var positionAttributeLocation = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.enableVertexAttribArray(positionAttributeLocation);
    var normalAttributeLocation = gl.getAttribLocation(shaderProgram, "aNormal");
    gl.enableVertexAttribArray(normalAttributeLocation);
    var textureAttributeLocation = gl.getAttribLocation(shaderProgram, "aTexCoords");
    gl.enableVertexAttribArray(textureAttributeLocation);

    // Define rules for each vertex
    const FLOAT_SIZE = 4;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 8 * FLOAT_SIZE, 0);
    gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 8 * FLOAT_SIZE, 3 * FLOAT_SIZE);
    gl.vertexAttribPointer(textureAttributeLocation, 2, gl.FLOAT, false, 8 * FLOAT_SIZE, 6 * FLOAT_SIZE);

    // Load the texture into the shader

    var projectionMatrix = mat4.create();
    var viewMatrix = mat4.create();
    var modelMatrix = mat4.create();

    mat4.perspective(projectionMatrix, 45 * Math.PI / 180.0, canvas.width / canvas.height, 0.1, 50.0);
    mat4.lookAt(viewMatrix, camera.position, camera.look, camera.up);
    mat4.translate(viewMatrix, viewMatrix, [0.5, 0.0, 0.0]);

    gl.useProgram(shaderProgram);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, albedo_texture);
    setShader1i(shaderProgram, "uAlbedo", 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, normal_texture);
    setShader1i(shaderProgram, "uNormal", 1);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, rough_texture);
    setShader1i(shaderProgram, "uRough", 2);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, metal_texture);
    setShader1i(shaderProgram, "uMetal", 3);

    setShader3fv(shaderProgram, "lightPos", -2, 10, -5)
    
    gl.enable(gl.DEPTH_TEST);

    var lightPos = [0.0, 0.0, 0.0];

    requestAnimationFrame(runRenderLoop);
    function runRenderLoop(time) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clearColor(0.5, 0.5, 1.0, 1.0);
        
        // Matrix Transformations
        mat4.identity(modelMatrix);

        mat4.translate(modelMatrix, modelMatrix, [5.0, 0.0, 0.0]);
        //mat4.rotate(modelMatrix, modelMatrix, 0.001 * time, [0.0, 1.0, 0.7]);
        processMovement(viewMatrix);

        // Pass matrices values to shader
        setShaderMat4fv(shaderProgram, "uProjection", projectionMatrix);
        setShaderMat4fv(shaderProgram, "uView", viewMatrix);
        setShaderMat4fv(shaderProgram, "uModel", modelMatrix);
        
        setShader3fv(shaderProgram, "viewPos", camera.position);
        setShader3fv(shaderProgram, "lightPos", 8.0 * Math.sin(0.003 * time), 1.0, 8.0 * Math.cos(0.003 * time));

        // Start drawing proccess
        gl.useProgram(shaderProgram);
        gl.bindVertexArray(vao);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(gl.TRIANGLES, 36 + 6, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(runRenderLoop);
    }
}