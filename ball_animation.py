import simplekit as sk

# Initialize canvas
WIDTH = 800
HEIGHT = 600
canvas = sk.Canvas(WIDTH, HEIGHT)

# Ball properties
ball_x = WIDTH // 2
ball_y = HEIGHT // 2
ball_radius = 20
dx = 5  # x velocity
dy = 5  # y velocity
ball_color = "red"

def update():
    global ball_x, ball_y, dx, dy
    
    # Update ball position
    ball_x += dx
    ball_y += dy
    
    # Bounce off walls
    if ball_x + ball_radius > WIDTH or ball_x - ball_radius < 0:
        dx = -dx
    if ball_y + ball_radius > HEIGHT or ball_y - ball_radius < 0:
        dy = -dy
    
    # Clear canvas
    canvas.clear()
    
    # Draw ball
    canvas.circle(ball_x, ball_y, ball_radius, fill=ball_color)
    
    # Update display
    canvas.update()

# Start animation
sk.animate(update)
sk.run()
