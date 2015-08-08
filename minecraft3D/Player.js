//Player class
var Player = (function () {

    function Player (x, y, z, cam, world) {
        this.camera = cam;
        this.world = world;
        this.velocity = vec3(0, 0, 0);
        this.position = vec3(x, y, z);
        this.direction = vec3(0, 0, -1);
    }

    Player.prototype.render = function() {
    };

    /*---------------- Vertices ---------------------*/



    /*---------------- Vertices end -----------------*/

    /*---------------- Movement ---------------------*/

    Player.prototype.strafeLeft = function () {
        var deg = radians(90);
        var left = vec3(
            Math.cos(deg)*this.direction[0]+Math.sin(deg)*this.direction[2],
            this.direction[1],
            -Math.sin(deg)*this.direction[0]+Math.cos(deg)*this.direction[2]
        );
        this.velocity = add(this.velocity,
            scale(MOVEMENT_SPEED*elapsedTime, left));
    };

    Player.prototype.strafeRight = function () {
        var deg = radians(-90);
        var right = vec3(
            Math.cos(deg)*this.direction[0]+Math.sin(deg)*this.direction[2],
            this.direction[1],
            -Math.sin(deg)*this.direction[0]+Math.cos(deg)*this.direction[2]
        );
        this.velocity = add(this.velocity,
            scale(MOVEMENT_SPEED*elapsedTime, right));
    };

    Player.prototype.jump = function () {
        this.velocity = add(this.velocity, vec3(0, MOVEMENT_SPEED*elapsedTime, 0));
    };

    Player.prototype.fall = function () {
        this.velocity = add(this.velocity, vec3(0, -MOVEMENT_SPEED*elapsedTime, 0));
    }

    Player.prototype.walkForwards = function () {
        if(this.forwardCollide()) {
            return;
        }
        this.velocity = add(this.velocity,
            scale(MOVEMENT_SPEED*elapsedTime, this.direction));
    };

    Player.prototype.walkBackwards = function () {
        this.velocity = add(this.velocity,
            scale(MOVEMENT_SPEED*elapsedTime, scale(-1, this.direction)));
    };

    Player.prototype.updatePosition = function () {
        this.position = add(this.position, this.velocity);
        this.camera.setPosition(negate(this.position));
        this.updateVelocity();
    };

    Player.prototype.forwardCollide = function() {

        console.log(this.position);
        if(this.world[Math.round(this.position[0])]) {
            if(this.world[Math.round(this.position[1])]) {
                if(this.world[Math.round(this.position[2])]) {
                    console.log("lol");
                    return true;
                }
            }
        }
        return false;
    }

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
        if(spacePressed) {
            this.jump();
        }
        if(shiftPressed) {
            this.fall();
        }
    };

    Player.prototype.handleMouseMove = function (x, y) {
        camera.rotX(x*ROTATION_SPEED);
        var deg = -radians(x*ROTATION_SPEED);
        this.direction = vec3(
            Math.cos(deg)*this.direction[0]+Math.sin(deg)*this.direction[2],
            this.direction[1],
            -Math.sin(deg)*this.direction[0]+Math.cos(deg)*this.direction[2]
        );
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
