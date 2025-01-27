# Three Bodies Gravitational Simulation

A physics simulation that demonstrates the gravitational interactions between three bodies in 2D space, implemented using TypeScript and HTML5 Canvas.

## Features

- Real-time simulation of gravitational forces between three bodies
- Visual trails showing the path of each body
- Color-coded bodies with customizable properties
- Collision detection between bodies
- Smooth animation using requestAnimationFrame

## Physics Implementation

The simulation uses:
- Newton's law of universal gravitation
- Numerical integration with time steps
- Elastic collisions between bodies
- Vector-based force calculations

## Getting Started

1. Install dependencies:
```bash
npm install

npm run dev
```
http://localhost:3000

Controls
	- The simulation starts automatically when the page loads
	- Each body is represented by a colored circle
	- Trailing paths show the movement history of each body
Technical Details
 - Written in TypeScript
 - Rendered using HTML5 Canvas
- Uses Vite for development and building