//Player class
var Player = (function () {

    function Player (x, y, z, cam, world) {
        this.camera = cam;
        this.world = world;
        this.velocity = vec3(0, 0, 0);
        this.position = vec3(x + .5, y + .5, z + .5); //Place player in center of grid box
        this.direction = vec3(0, 0, -1);
    }

    Player.prototype.render = function() {
    };

    /*---------------- Vertices ---------------------*/



    /*---------------- Vertices end -----------------*/

    /*---------------- Movement ---------------------*/

    Player.prototype.strafeLeft = function () {
        var abovePosition = vec3(this.position[0], this.position[1] + 1, this.position[2]);
        var deg = radians(90);
        var left = vec3(
            Math.cos(deg)*this.direction[0]+Math.sin(deg)*this.direction[2],
            this.direction[1],
            -Math.sin(deg)*this.direction[0]+Math.cos(deg)*this.direction[2]
        );
        if(this.horiCollide(left,this.position) || this.horiCollide(left, abovePosition)) {
            return;
        }
        this.velocity = add(this.velocity,
            scale(MOVEMENT_SPEED*elapsedTime, left));
    };

    Player.prototype.strafeRight = function () {
        var abovePosition = vec3(this.position[0], this.position[1] + 1, this.position[2]);
        var deg = radians(-90);
        var right = vec3(
            Math.cos(deg)*this.direction[0]+Math.sin(deg)*this.direction[2],
            this.direction[1],
            -Math.sin(deg)*this.direction[0]+Math.cos(deg)*this.direction[2]
        );
        if(this.horiCollide(right, this.position) || this.horiCollide(right, abovePosition)) {
            return;
        }
        this.velocity = add(this.velocity,
            scale(MOVEMENT_SPEED*elapsedTime, right));
    };

    Player.prototype.jump = function () {
        if(!this.fallCollide() || this.jumpCollide()) {
            return;
        }
        this.velocity = add(this.velocity, vec3(0, MOVEMENT_SPEED*1.3, 0));
    };

    Player.prototype.fall = function () {
        if(this.fallCollide()) {
            return;
        }
        this.velocity = add(this.velocity, vec3(0, -0.01*elapsedTime, 0));

    }

    Player.prototype.walkForwards = function () {
        var abovePosition = vec3(this.position[0], this.position[1] + 1, this.position[2]);
        if(this.horiCollide(this.direction, this.position) || this.horiCollide(this.direction, abovePosition)) {
            return;
        }
        this.velocity = add(this.velocity,
            scale(MOVEMENT_SPEED*elapsedTime, this.direction));
    };

    Player.prototype.walkBackwards = function () {
        var abovePosition = vec3(this.position[0], this.position[1] + 1, this.position[2]);
        if(this.horiCollide(negate(this.direction), this.position) || this.horiCollide(negate(this.direction), abovePosition)) {
            return;
        }
        this.velocity = add(this.velocity,
            scale(MOVEMENT_SPEED*elapsedTime, scale(-1, this.direction)));
    };

    Player.prototype.updatePosition = function () {
        this.position = add(this.position, this.velocity);
        var shownPos = vec3(this.position[0], this.position[1] + 1, this.position[2]);
        this.camera.setPosition(negate(shownPos));
        this.updateVelocity();
        this.fall();
    };

    Player.prototype.fallCollide = function() {
        var gridPos = [Math.floor(this.position[0]), Math.floor(this.position[1]), Math.floor(this.position[2])];
        if(this.position[1] - Math.floor(this.position[1]) > 0.5) {
            return false;
        }
        if(this.world[gridPos[0]]) {
            if(this.world[gridPos[0]][gridPos[1] - 1]) {
                if(this.world[gridPos[0]][gridPos[1] - 1][gridPos[2]]) {
                    if(this.world[gridPos[0]][gridPos[1] - 1][gridPos[2]] instanceof SpinningBlock) {
                        world.removeSpinningBlock(gridPos[0], gridPos[1] - 1, gridPos[2]);
                        return false;
                    }
                    this.velocity[1] = 0;
                    return true;
                }
            }
        }
        return false;
    };

    Player.prototype.jumpCollide = function() {
        var gridPos = [Math.floor(this.position[0]), Math.floor(this.position[1] + 1), Math.floor(this.position[2])];
        if(this.world[gridPos[0]]) {
            if(this.world[gridPos[0]][gridPos[1] + 1]) {
                if(this.world[gridPos[0]][gridPos[1] + 1][gridPos[2]]) {
                    if(this.world[gridPos[0]][gridPos[1] + 1][gridPos[2]] instanceof SpinningBlock) {
                        world.removeSpinningBlock(gridPos[0], gridPos[1] + 1, gridPos[2]);
                        return false;
                    }
                    this.velocity[1] = 0;
                    return true;
                }
            }
        }
        return false;
    };

    Player.prototype.horiCollide = function(moveDir, pos) {
        var gridPos = [Math.floor(pos[0]), Math.floor(pos[1]), Math.floor(pos[2])];
        //Walking in x direction
        if(moveDir[0] > 0 && pos[0] - Math.floor(pos[0]) > 0.7) {
            if(this.world[gridPos[0] + 1]) {
                if(this.world[gridPos[0] + 1][gridPos[1]]) {
                    if(this.world[gridPos[0] + 1][gridPos[1]][gridPos[2]]) {
                        if(this.world[gridPos[0] + 1][gridPos[1]][gridPos[2]] instanceof SpinningBlock) {
                            world.removeSpinningBlock(gridPos[0] + 1, gridPos[1], gridPos[2]);
                            return false;
                        }
                        this.velocity[0] = 0;
                        return true;
                    }
                }
            }
        }
        //Walking in negative x direction
        if(moveDir[0] < 0 && pos[0] - Math.floor(pos[0]) < 0.3) {
            if(this.world[gridPos[0] - 1]) {
                if(this.world[gridPos[0] - 1][gridPos[1]]) {
                    if(this.world[gridPos[0] - 1][gridPos[1]][gridPos[2]]) {
                        if(this.world[gridPos[0] - 1][gridPos[1]][gridPos[2]] instanceof SpinningBlock) {
                            world.removeSpinningBlock(gridPos[0] - 1, gridPos[1], gridPos[2]);
                            return false;
                        }
                        this.velocity[0] = 0;
                        return true;
                    }
                }
            }
        }
        //Walking in z direction
        if(moveDir[2] > 0 && pos[2] - Math.floor(pos[2]) > 0.7) {
            if(this.world[gridPos[0]]) {
                if(this.world[gridPos[0]][gridPos[1]]) {
                    if(this.world[gridPos[0]][gridPos[1]][gridPos[2] + 1]) {
                        if(this.world[gridPos[0]][gridPos[1]][gridPos[2] + 1] instanceof SpinningBlock) {
                            world.removeSpinningBlock(gridPos[0], gridPos[1], gridPos[2] + 1);
                            return false;
                        }
                        this.velocity[2] = 0;
                        return true;
                    }
                }
            }
        }
        //Walking in negative z direction
        if(moveDir[2] < 0 && pos[2] - Math.floor(pos[2]) < 0.3) {
            if(this.world[gridPos[0]]) {
                if(this.world[gridPos[0]][gridPos[1]]) {
                    if(this.world[gridPos[0]][gridPos[1]][gridPos[2] - 1]) {
                        if(this.world[gridPos[0]][gridPos[1]][gridPos[2] - 1] instanceof SpinningBlock) {
                            world.removeSpinningBlock(gridPos[0], gridPos[1], gridPos[2] - 1);
                            return false;
                        }
                        this.velocity[2] = 0;
                        return true;
                    }
                }
            }
        }
        return false;
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
            this.velocity[0] = 0;
            this.velocity[2] = 0;

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
