import { startSimpleKit } from "simplekit/canvas-mode";

export class Canvas {
    private static instance: Canvas;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private readonly borderWidth: number = 4;
    private readonly borderColor: string = 'black';

    private constructor() {
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d')!;
        this.resize();
        this.initializeCanvas();
        window.addEventListener('resize', () => {
            this.resize();
            this.drawBoundaries();
        });
    }

    private initializeCanvas() {
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.drawBoundaries();
    }

    private drawBoundaries() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.borderColor;
        this.ctx.lineWidth = this.borderWidth;
        this.ctx.strokeRect(
            this.borderWidth / 2,
            this.borderWidth / 2,
            this.canvas.width - this.borderWidth,
            this.canvas.height - this.borderWidth
        );
        this.ctx.closePath();
    }

    static getInstance(): Canvas {
        if (!Canvas.instance) {
            Canvas.instance = new Canvas();
        }
        return Canvas.instance;
    }

    private resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBoundaries();
    }

    getContext(): CanvasRenderingContext2D {
        return this.ctx;
    }

    getBoundaries() {
        return {
            width: this.canvas.width,
            height: this.canvas.height,
            border: this.borderWidth
        };
    }
    // get center
    getCenter() {
        return {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        };
    }
    // get width
    getWidth() {
        return this.canvas.width;
    }
    // get height
    getHeight() {
        return this.canvas.height;
    }
}
