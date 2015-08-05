//Player class
var Player = (function () {

    function Player (x, y, z, cam) {
        this.camera = cam;
        this.velocity = vec3(0, 0, 0);
        this.position = vec3(x, y, z);
    }

    Player.prototype.render = function() {

    };

    /*---------------- Vertices ---------------------*/



    /*---------------- Vertices end -----------------*/

    /*---------------- Movement ---------------------*/

    Player.prototype.strafeLeft = function () {
        this.velocity = add(this.velocity, vec3(MOVEMENT_SPEED*elapsedTime, 0, 0));
    };

    Player.prototype.strafeRight = function () {
        this.velocity = add(this.velocity, vec3(-MOVEMENT_SPEED*elapsedTime, 0, 0));
    };

    Player.prototype.jump = function () {
        this.velocity = add(this.velocity, vec3(0, MOVEMENT_SPEED*elapsedTime, 0));
    };

    Player.prototype.walkForwards = function () {
        this.velocity = add(this.velocity, vec3(0, 0, MOVEMENT_SPEED*elapsedTime));
    };

    Player.prototype.walkBackwards = function () {
        this.velocity = add(this.velocity, vec3(0, 0, -MOVEMENT_SPEED*elapsedTime));
    };

    Player.prototype.updatePosition = function () {
        this.position = add(this.position, this.velocity);
        this.camera.setPosition(this.position);
        this.updateVelocity();
    };

    /*---------------- Movement end ---------------------*/

    /*---------------- Handle keys ----------------------*/

    Player.prototype.handleKeys = function () {
        if(leftPressed) {
        }
        if(rightPressed) {
        }
        if(upPressed) {
        }
        if(downPressed) {
        }
        if(aPressed) {
            this.strafeLeft();
        }
        if(sPressed) {
            this.walkBackwards();
        }
        if(dPressed) {
            this.strafeRight();
        }
        if(wPressed) {
            this.walkForwards();
        }
    };

    Player.prototype.handleMouseMove = function (x, y) {
        camera.rotX(x*ROTATION_SPEED);
        camera.rotY(y*ROTATION_SPEED);
    };

    /*---------------- Gravity --------------------------*/

    Player.prototype.updateVelocity = function () {
        if(!(this.velocity[0] == 0 && this.velocity[1] == 0 && this.velocity[2] == 0)) {
            this.velocity = add(this.velocity, scale(-1, normalize(this.velocity)));
        }
    };

    /*---------------- Collision detection --------------*/



    /*---------------- Collision detection end ----------*/

    Player.prototype.getX = function () {

    };

    Player.prototype.getY = function () {

    };

    return Player;
})();
