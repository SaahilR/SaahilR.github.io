var uniformLocations = [];

function compileShader(shaderId) {
    var shader;
    var shaderElement = document.getElementById(shaderId);
    var shaderText = shaderElement.text.trim();

    // Print full shader to console
    // console.log("Shader " + shaderText);

    if (shaderElement.type == "vertShader") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else if (shaderElement.type == "fragShader") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    }
    gl.shaderSource(shader, shaderText);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

// Links both vertex shader and fragment shader for basic
// Shader vertex/fragment shader pipeline
function setupShader(vertShaderId, fragShaderId) {
    var vertShader = compileShader(vertShaderId);
    var fragShader = compileShader(fragShaderId);
    var shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not link shaders");
    }

    return shaderProgram
}

// Following functions simplify adding uniform values to shaders
function getLocation(shaderProgram, uniformName) {
    var location;

    if (uniformLocations[uniformName]) {
        location = uniformLocations[uniformName];
    } else {
        uniformLocations[uniformName] = gl.getUniformLocation(shaderProgram, uniformName);
        location = uniformLocations[uniformName];
    }

    return location;
}

function setShaderMat4fv(shaderProgram, uniformName, v0) {
    var location = getLocation(shaderProgram, uniformName);
    gl.uniformMatrix4fv(location, false, v0);
}

function setShader3fv(shaderProgram, uniformName, v0, v1, v2) {
    var location = getLocation(shaderProgram, uniformName);
    gl.uniform3fv(location, [v0, v1, v2]);
}

function setShader1i(shaderProgram, uniformName, v0) {
    var location = getLocation(shaderProgram, uniformName);
    gl.uniform1i(location, v0);
}

