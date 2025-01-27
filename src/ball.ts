export class Ball {
    private x: number;
    private y: number;
    private radius: number;
    private color: string;
    constructor(x: number, y: number, radius: number = 20, color: string = 'red') {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }
    setX(x: number) {
        this.x = x;
    }
    setY(y: number) {
        this.y = y;
    }
    getRadius(): number {
        return this.radius;
    }
    getColor(): string {    
        return this.color;
    }
}