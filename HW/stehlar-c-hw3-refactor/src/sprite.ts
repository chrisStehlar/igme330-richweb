export class Sprite {
    x: number;
    y: number;
    image: HTMLImageElement;
    velocity: { x: number; y: number };

    constructor(x: number, y: number, imageSrc: string, velocity: number) {
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = imageSrc;
        this.velocity = { x: velocity, y: -velocity };
        console.log("Sprite created at position:", x, y);
    }

    update = () => {
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        if (this.y > 300 || this.y < -100) {
            this.velocity.y = -this.velocity.y;
        }

        if (this.x > 600 || this.x < -100) {
            this.x = Math.floor(Math.random() * 401);
            this.velocity.x = -this.velocity.x;
        }
    };

    draw = (ctx: CanvasRenderingContext2D) => {
        ctx.drawImage(this.image, this.x, this.y);
    };
}
