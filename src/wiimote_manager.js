import { keysValues } from "./constants.js";

class WiimoteManager {
    static TURN_TRIGGER = 10;
    static FORWARD_TRIGGER = 50;
    static BACKWARD_TRIGGER = 70;

    keys = new Map();
    constructor(keyUp, keyDown) {
        this.keys.set(keysValues.arrowLeft, false);
        this.keys.set(keysValues.arrowRight, false);
        this.keys.set(keysValues.arrowUp, false);
        this.keys.set(keysValues.arrowDown, false);

        window.addEventListener(
            "deviceorientation",
            (event) => {
                const alpha = event.alpha;
                const gamma = event.gamma;
                const beta = event.beta;

                document.getElementById("alpha").innerText = "alpha" + alpha;
                document.getElementById("beta").innerText = "beta" + beta;
                document.getElementById("gamma").innerText = "gamma" + gamma;

                if (this.canGoLeft(beta)) {
                    console.log("go left pressed");
                    const event = {
                        preventDefault: () => {},
                        key: keysValues.arrowLeft,
                        type: "keydown",
                    };
                    keyDown(event);
                }

                if (this.isNotTurningLeft(beta)) {
                    this.stopGoLeft();
                    console.log("go left released");

                    const event = {
                        preventDefault: () => {},
                        key: keysValues.arrowLeft,
                        type: "keyup",
                    };
                    keyUp(event);
                }

                if (this.canGoRight(beta)) {
                    const event = {
                        preventDefault: () => {},
                        key: keysValues.arrowRight,
                        type: "keydown",
                    };
                    keyDown(event);
                }

                if (this.isNotTurningRight(beta)) {
                    this.stopGoRight();

                    const event = {
                        preventDefault: () => {},
                        key: keysValues.arrowRight,
                        type: "keyup",
                    };
                    keyUp(event);
                }

                if (this.canGoForward(gamma)) {
                    console.log("go up pressed");
                    const event = {
                        preventDefault: () => {},
                        key: keysValues.arrowUp,
                        type: "keydown",
                    };
                    keyDown(event);
                }

                if (this.isNotGoingForward(gamma)) {
                    this.stopGoForward();
                    console.log("go up released");

                    const event = {
                        preventDefault: () => {},
                        key: keysValues.arrowUp,
                        type: "keyup",
                    };
                    keyUp(event);
                }

                if (this.canGoBackward(gamma)) {
                    const event = {
                        preventDefault: () => {},
                        key: keysValues.arrowDown,
                        type: "keydown",
                    };
                    keyDown(event);
                }

                if (this.isNotGoingBackward(gamma)) {
                    this.stopGoBackward();

                    const event = {
                        preventDefault: () => {},
                        key: keysValues.arrowDown,
                        type: "keyup",
                    };
                    keyUp(event);
                }
            },
            true
        );
    }

    canGoRight(value) {
        if (value > WiimoteManager.TURN_TRIGGER && this.keys.get(keysValues.arrowRight) == false) {
            this.keys.set(keysValues.arrowRight, true);
            return true;
        }
        return false;
    }

    isNotTurningLeft(value) {
        return (
            Math.abs(value) <= WiimoteManager.TURN_TRIGGER &&
            this.keys.get(keysValues.arrowLeft) == true
        );
    }

    isNotTurningRight(value) {
        return (
            Math.abs(value) <= WiimoteManager.TURN_TRIGGER &&
            this.keys.get(keysValues.arrowRight) == true
        );
    }

    isNotGoingForward(value) {
        return (
            value <= -WiimoteManager.FORWARD_TRIGGER && this.keys.get(keysValues.arrowUp) == true
        );
    }

    isNotGoingBackward(value) {
        return (
            Math.abs(value) <= WiimoteManager.BACKWARD_TRIGGER &&
            this.keys.get(keysValues.arrowDown) == true
        );
    }

    stopGoRight() {
        this.keys.set(keysValues.arrowRight, false);
    }

    canGoLeft(value) {
        if (value < -WiimoteManager.TURN_TRIGGER && this.keys.get(keysValues.arrowLeft) == false) {
            this.keys.set(keysValues.arrowLeft, true);
            return true;
        }
        return false;
    }

    stopGoLeft() {
        this.keys.set(keysValues.arrowLeft, false);
    }

    canGoForward(value) {
        if (value > -WiimoteManager.FORWARD_TRIGGER && this.keys.get(keysValues.arrowUp) == false) {
            this.keys.set(keysValues.arrowUp, true);
            return true;
        }
        return false;
    }

    stopGoForward() {
        this.keys.set(keysValues.arrowUp, false);
    }

    canGoBackward(value) {
        if (
            Math.abs(value) > WiimoteManager.BACKWARD_TRIGGER &&
            this.keys.get(keysValues.arrowDown) == false
        ) {
            this.keys.set(keysValues.arrowDown, true);
            return true;
        }
        return false;
    }
    stopGoBackward() {
        this.keys.set(keysValues.arrowDown, false);
    }
}

export default WiimoteManager;