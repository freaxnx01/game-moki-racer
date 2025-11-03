export class GameControls {
    constructor() {
        this.left = false;
        this.right = false;
        this.jump = false;

        this.setupKeyboardControls();
    }

    setupKeyboardControls() {
        window.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    this.left = true;
                    break;
                case 'ArrowRight':
                    this.right = true;
                    break;
                case ' ':
                case 'Spacebar':
                    this.jump = true;
                    e.preventDefault(); // Prevent page scroll
                    break;
            }
        });

        window.addEventListener('keyup', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    this.left = false;
                    break;
                case 'ArrowRight':
                    this.right = false;
                    break;
                case ' ':
                case 'Spacebar':
                    this.jump = false;
                    break;
            }
        });
    }
}
