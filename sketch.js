let food = [];
let time = 0;
let organisms = [];
let generation = 0;

for (let i = 0; i < 5; i++) {
    food.push([
        Math.floor(Math.random() * 400),
        Math.floor(Math.random() * 400),
    ]);
}

function newPop() {
    for (let i = 0; i < 10; i++) {
        organisms.push({
            x: 200,
            y: 200,
            allele1: Math.floor(Math.random() * 2),
            allele2: Math.floor(Math.random() * 2),
        });
    }
}

function reproduce(p1, p2, type = 0) {
    let child = {
        x: 200,
        y: 200,
        allele1: 0,
        allele2: 0,
    };
    //hardy weinberg
    if (type == 0) {
        child.allele1 =
            Math.floor(Math.random() * 2) == 0 ? p1.allele1 : p2.allele1;
        child.allele2 =
            Math.floor(Math.random() * 2) == 0 ? p1.allele2 : p2.allele2;
    }

    return child;
}

function alleles() {
    // recessive = 0, dominant = 1
    let count = {
        recessive: 0,
        dominant: 0,
    };
    for (const o of organisms) {
        count[Object.keys(count)[o.allele1]]++;
        count[Object.keys(count)[o.allele2]]++;
    }
    return count;
}

function nearestFood(x, y) {
    let index = 0;
    let closest = 0;
    for (let i = 0; i < food.length; i++) {
        let distance = Math.sqrt(Math.pow(f[0] - x, 2) + Math.pow(f[1] - y, 2));
        if (distance < closest) {
            index = i;
            closest = distance;
        }
    }
    return food[index];
}

// drawing stuff starts here

function setup() {
    newPop();
    createCanvas(400, 400);
    frameRate(30);
}

function draw() {
    document.getElementById("time").innerText = `Generation Time: ${Math.floor(
        time / 30
    )}s`;
    document.getElementById("gen").innerText = `Generation: ${generation}`;
    background(220);
    let direction = [1, -1];
    for (const o of organisms) {
        let speed = o.allele1 == 1 || o.allele2 == 1 ? 0.5 : 0.1;
        if (time % 1 == 0) {
            o.x += 10 * speed * direction[Math.floor(Math.random() * 2)];
            o.y += 10 * speed * direction[Math.floor(Math.random() * 2)];
        }

        if (o.x < 0) o.x = 0;
        if (o.y < 0) o.y = 0;
        if (o.x > 400) o.x = 400;
        if (o.y > 400) o.y = 400;
        circle(o.x, o.y, 10);
        //text(`speed: ${Math.round(o.speed * 100)}`, o.x, o.y);
    }
    time++;
    //if (Math.floor(time / 30))
    push();
    fill(255, 204, 0);

    for (const f of food) {
        circle(f[0], f[1], 5);
    }

    pop();
}