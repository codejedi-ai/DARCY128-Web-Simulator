import { startSimpleKit } from "simplekit/canvas-mode";
import { Canvas } from './canvas';
import { Ball } from './ball';
import { ThreeBodySimulation, Body, Vector2D} from './physics';
// Initialize canvas
startSimpleKit();
const canvas = Canvas.getInstance();
// Anti-aliasing settings
// draw the balls
const ctx = canvas.getContext();
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

// make a ball object
//const ball = new Ball(100, 100);
// draw the ball
//ball.draw(canvas.getContext());
// animate teh ball to move back and forth smoothly and slowly

// make three balls
const d = 50
const center = canvas.getCenter();
const ball1 = new Ball(center.x, center.y, 5, 'red');
const body1 = new Body(ball1.getX(), ball1.getY(), 0,0,10, ball1.getRadius());
const ball2 = new Ball(center.x+3*d, center.y,5, 'blue');
const body2 = new Body(ball2.getX(), ball2.getY(),0,0, 10, ball2.getRadius());
const ball3 = new Ball(center.x, center.y+4*d,5, 'green');
// make three body objects


const body3 = new Body(ball3.getX(), ball3.getY(),0,0, 10, ball3.getRadius());
// make a simulation object
const bodyarray = [body1, body2, body3]
const balls = [ball1, ball2, ball3];
const paths: Path[] = [[], [], []];


const simulation = new ThreeBodySimulation(bodyarray);

// animate the simulation



ball1.draw(canvas.getContext());
ball2.draw(canvas.getContext());
ball3.draw(canvas.getContext());
// make the three balls in a list


type Path = { x: number; y: number }[];

const MAX_PATH_LENGTH = 500;


function animate() {
    // Method 1: Full clear (standard)
    //ctx.clearRect(0, 0, canvas.getWidth(), canvas.getHeight());
    // Method 2: Transparent trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.getWidth(), canvas.getHeight());
    
    simulation.step();
    for (let i = 0; i < simulation.getBodies().length; i++) {
        const body = simulation.getBodies()[i];
        const ball = balls[i];
        const path = paths[i];
        path.push({ x: body.position.x, y: body.position.y });
        // Maintain maximum path length
        if (path.length > MAX_PATH_LENGTH) {
            path.shift();
        }
        // Draw path
        ctx.beginPath();
        ctx.strokeStyle = ball.getColor();
        ctx.lineWidth = 1;
        for (let j = 0; j < path.length - 1; j++) {
            ctx.moveTo(path[j].x, path[j].y);
            ctx.lineTo(path[j + 1].x, path[j + 1].y);
        }
        ctx.stroke();
        ball.setX(body.position.x);
        ball.setY(body.position.y);
        ball.draw(ctx);
    }

    requestAnimationFrame(animate);
}
animate();