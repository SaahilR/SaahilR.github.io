var keys = [];

var camera = {
    position: vec3.fromValues(0, 0, 0),
    look: vec3.fromValues(0, 0, 1),
    up: vec3.fromValues(0, 1, 0),
    right: vec3.fromValues(1, 0, 0),
    pitch: 0.0,
    yaw: 0.0
};

document.addEventListener("keydown", function (event) {
    if (event.key == 'w') {
        keys['w'] = true;
    }
    if (event.key == 'a') {
        keys['a'] = true;
    }
    if (event.key == 's') {
        keys['s'] = true;
    }
    if (event.key == 'd') {
        keys['d'] = true;
    }
    if (event.key == ' ') {
        keys[' '] = true;
    }
    if (event.key == 16) {
        keys[16] == true;
    }
});

document.addEventListener("keyup", function (event) {
    if (event.key == 'w') {
        keys['w'] = false;
    }
    if (event.key == 'a') {
        keys['a'] = false;
    }
    if (event.key == 's') {
        keys['s'] = false;
    }
    if (event.key == 'd') {
        keys['d'] = false;
    }
    if (event.key == ' ') {
        keys[' '] = false;
    }
    if (event.key == 16) {
        keys[16] == false;
    }
});



function processMovement(viewMatrix) {
    camera.look[0] = Math.cos(camera.pitch) * Math.cos(camera.yaw);
    camera.look[1] = Math.sin(camera.pitch);
    camera.look[2] = Math.cos(camera.pitch) * Math.sin(camera.yaw);

    vec3.cross(camera.right, camera.look, [0, 1, 0]);
    vec3.cross(camera.up, camera.right, camera.look);

    var lookDir = vec3.create();
    if (keys['w'] == true) {
        vec3.scale(lookDir, camera.look, 0.05);
        vec3.add(camera.position, camera.position, lookDir);
    }
    if (keys['a'] == true) {
        vec3.scale(lookDir, camera.right, -0.05);
        vec3.add(camera.position, camera.position, lookDir);
    }
    if (keys['s'] == true) {
        vec3.scale(lookDir, camera.look, -0.05);
        vec3.add(camera.position, camera.position, lookDir);
    }
    if (keys['d'] == true) {
        vec3.scale(lookDir, camera.right, 0.05);
        vec3.add(camera.position, camera.position, lookDir);
    }
    if (keys[' '] == true) {
        vec3.scale(lookDir, [0, 1, 0], 0.05);
        vec3.add(camera.position, camera.position, lookDir);
    }
    if (keys[16] == true) {
        vec3.scale(lookDir, [0, 1, 0], -0.05);
        vec3.add(camera.position, camera.position, lookDir);
    }

    //processMouse();

    var target = vec3.create();
    vec3.add(target, camera.position, camera.look);
    mat4.lookAt(viewMatrix, camera.position, target, camera.up);
}
