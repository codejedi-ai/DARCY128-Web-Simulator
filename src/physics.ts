interface Vector2D {
    x: number;
    y: number;
}

class Body{
    position: Vector2D;
    velocity: Vector2D;
    mass: number;
    radius: number;

    constructor(
        x: number, 
        y: number, 
        vx: number, 
        vy: number, 
        mass: number, 
        radius: number
    ) {
       this.position = { x, y };
        this.velocity = { x: vx, y: vy };
        this.mass = mass;
        this.radius = radius;
    }
}
class ThreeBodySimulation {
    private readonly G: number = 6.67430e4;
    private readonly dt: number = 0.01;
    private bodies: Body[];
    private bodycount: number = 3;
    constructor(bodies: Body[]) {
        if (bodies.length !== 3) {
            throw new Error("Must provide exactly 3 bodies");
        }
        this.bodies = bodies;
        this.bodycount = bodies.length;
    }
    // the force is acted on body1 by body2
    private calculateGravitationalForce(body1: Body, body2: Body): Vector2D {
        const dx = body2.position.x - body1.position.x;
        const dy = body2.position.y - body1.position.y;
        const distanceSquared = dx * dx + dy * dy;
        const distance = Math.sqrt(distanceSquared);
        
        const force = this.G * body1.mass * body2.mass / distanceSquared;
        
        return {
            x: (force * dx) / distance,
            y: (force * dy) / distance
        };
    }

    step(): void {
        const forces: Vector2D[] = this.bodies.map(() => ({ x: 0, y: 0 }));

        // Calculate forces between each pair
        for (let i = 0; i < this.bodycount; i++) {
            for (let j = i + 1; j < this.bodycount; j++) {
                const force = this.calculateGravitationalForce(
                    this.bodies[i],
                    this.bodies[j]
                );

                // Apply force to both bodies (action-reaction)
                forces[i].x += force.x;
                forces[i].y += force.y;
                forces[j].x -= force.x;
                forces[j].y -= force.y;
            }
        }

        // Update positions and velocities
        for (let i = 0; i < this.bodycount; i++) {
            const body = this.bodies[i];
            const force = forces[i];

            // Update velocity (F = ma)
            const ax = force.x / body.mass;
            const ay = force.y / body.mass;
            body.velocity.x += ax * this.dt;
            body.velocity.y += ay * this.dt;

            // Update position
            body.position.x += body.velocity.x * this.dt;
            body.position.y += body.velocity.y * this.dt;
        }
        // check is there any crashes
        for (let i = 0; i < this.bodycount; i++) {
            for (let j = i + 1; j < this.bodycount; j++) {
                const dx = this.bodies[i].position.x - this.bodies[j].position.x;
                const dy = this.bodies[i].position.y - this.bodies[j].position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.bodies[i].radius + this.bodies[j].radius) {
                    // crash
                    console.log('crash');
                    this.bodies[i].velocity.x = -this.bodies[i].velocity.x;
                    this.bodies[i].velocity.y = -this.bodies[i].velocity.y;
                    this.bodies[j].velocity.x = -this.bodies[j].velocity.x;
                    this.bodies[j].velocity.y = -this.bodies[j].velocity.y;
                }
            }
        }
    }

    getBodies(): Body[] {
        return this.bodies;
    }
}

export { ThreeBodySimulation, Body };
export type { Vector2D };