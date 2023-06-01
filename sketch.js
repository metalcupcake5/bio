let food = [];
let time = 0;
let organisms = [];
let totalOrganisms = 200;
let generation = 0;
let speedMod = 20;
let sizeX = 1000;
let sizeY = 1000;
let reproductionType = 0;
let alleleHistory = [];
let alleleChart;
let performanceChart;

function reset() {
    food = [];
    generation = 0;
    time = 0;
    organisms = [];
    for (let i = 0; i < 5; i++) {
        food.push([
            Math.floor(Math.random() * sizeX),
            Math.floor(Math.random() * sizeY),
        ]);
    }
    for (let i = 0; i < totalOrganisms; i++) {
        organisms.push({
            x: Math.floor(Math.random() * sizeX),
            y: Math.floor(Math.random() * sizeY),
            alleles: [
                Math.floor(Math.random() * 2),
                Math.floor(Math.random() * 2),
            ],
            food: 0,
            destination: [0, 0],
            s: Math.random(),
        });
    }

    document.getElementById("gen").innerText = `Generation: ${generation}`;
}

function mate(p1, p2, type = 0) {
    let child = {
        x: Math.floor(Math.random() * sizeX),
        y: Math.floor(Math.random() * sizeX),
        alleles: [],
        food: 0,
        destination: [0, 0],
        s: 0,
    };
    child.alleles.push(p1.alleles[Math.floor(Math.random() * 2)]);
    child.alleles.push(p2.alleles[Math.floor(Math.random() * 2)]);
    child.s = Math.random();
    //child.s += Math.random() <= 0.5 ? p1.s : p2.s;
    return child;
}

function reproduce(type = 0) {
    let parentGen = [...organisms];
    organisms = [];
    let newGen = [];
    // hardy weinberg
    if (type == 0) {
        food = [];
        for (let i = 0; i < 5; i++) {
            food.push([
                Math.floor(Math.random() * sizeX),
                Math.floor(Math.random() * sizeY),
            ]);
        }

        while (newGen.length < totalOrganisms) {
            console.log("reproducing");
            let p1 = parentGen.splice(
                Math.floor(Math.random() * parentGen.length),
                1
            )[0];
            let p2 = parentGen.splice(
                Math.floor(Math.random() * parentGen.length),
                1
            )[0];
            newGen.push(mate(p1, p2), mate(p1, p2));
        }
    }

    // natural selection
    if (type == 1) {
        parentGen = parentGen.filter((o) => o.food > 0);
        parentGen.sort((a, b) => b.food - a.food);
        let highest = parentGen[0].food;
        let lowest = parentGen[parentGen.length - 1].food;
        parentGen = parentGen.filter(
            (o) => o.food > Math.floor(lowest + (highest - lowest) / 2)
        );
        while (newGen.length < totalOrganisms) {
            console.log("reproducing");
            let p1 = parentGen[Math.floor(Math.random() * parentGen.length)];
            let p2 = parentGen[Math.floor(Math.random() * parentGen.length)];
            newGen.push(mate(p1, p2), mate(p1, p2));
        }
    }
    organisms = newGen;
}

function alleles() {
    // recessive = 0, dominant = 1
    let count = {
        recessive: 0,
        dominant: 0,
    };
    for (const o of organisms) {
        count[Object.keys(count)[o.alleles[0]]]++;
        count[Object.keys(count)[o.alleles[1]]]++;
    }
    return count;
}

function genotypes() {
    let g = {
        homo_dom: 0,
        het: 0,
        homo_rec: 0,
    };
    for (const o of organisms) {
        if (o.alleles[0] == o.alleles[1]) {
            if (o.alleles[0] == 0) g.homo_rec++;
            else g.homo_dom++;
        } else {
            g.het++;
        }
    }

    return g;
}

function distance(x, y, x1, y1) {
    return Math.sqrt(Math.pow(x1 - x, 2) + Math.pow(y1 - y, 2));
}

function nearestFood(x, y) {
    let index = 0;
    if (food.length < 1) return [x, y];
    let closest = distance(x, y, food[0][0], food[0][1]);
    for (let i = 0; i < food.length; i++) {
        let dist = distance(x, y, food[i][0], food[i][1]);
        if (dist < closest) {
            index = i;
            closest = dist;
        }
    }
    return food[index];
}

// drawing stuff starts here

function setup() {
    reset();
    const canvas = createCanvas(sizeX, sizeY);
    canvas.parent("canvas");
    frameRate(30);

    const a = alleles();

    document.getElementById(
        "a-dom"
    ).innerText = `Dominant Alleles: ${a.dominant}`;
    document.getElementById(
        "a-rec"
    ).innerText = `Recessive Alleles: ${a.recessive}`;

    const g = genotypes();
    document.getElementById(
        "hom-dom"
    ).innerText = `Homozygous Dominant: ${g.homo_dom}`;
    document.getElementById(
        "hom-rec"
    ).innerText = `Homozygous Recessive: ${g.homo_rec}`;
    document.getElementById("het").innerText = `Heterozygous: ${g.het}`;

    alleleChart = new Chart(document.getElementById("chart-gens"), {
        type: "line",
        data: {
            labels: [0],
            datasets: [
                {
                    label: "dominant",
                    data: [a.dominant],
                    borderWidth: 1,
                },
                {
                    label: "recessive",
                    data: [a.recessive],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });

    performanceChart = new Chart(document.getElementById("chart-perf"), {
        type: "bar",
        data: {
            labels: [...Array(totalOrganisms).keys()],
            datasets: [
                {
                    label: "food",
                    data: Array(totalOrganisms).fill(0),
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

function draw() {
    // set display variables
    document.getElementById("time").innerText = `Generation Time: ${Math.floor(
        time / 30
    )}s`;

    background(220);

    // spawn new food + draw food
    push();
    fill(255, 204, 0);

    if (time % 10 == 0) {
        for (let i = 0; i < Math.floor(totalOrganisms/3); i++) {
            food.push([
                Math.floor(Math.random() * sizeX),
                Math.floor(Math.random() * sizeY),
            ]);
        }
    }

    for (const f of food) {
        circle(f[0], f[1], 5);
    }

    pop();

    // draw/move organisms
    let direction = [1, -1];
    for (const o of organisms) {
        let speed = o.alleles[0] == 1 || o.alleles[1] == 1 ? 0.5 : 0.1;

        if (o.x < 0) o.x = 0;
        if (o.y < 0) o.y = 0;
        if (o.x > sizeX) o.x = sizeX;
        if (o.y > sizeY) o.y = sizeY;
        circle(o.x, o.y, 10);
        for (let i = 0; i < food.length; i++) {
            if (distance(o.x, o.y, food[i][0], food[i][1]) < 5) {
                food.splice(i, 1);
                o.food++;
                performanceChart.data.datasets[0].data[organisms.indexOf(o)]++;
                performanceChart.update();
            }
        }
        o.destination = nearestFood(o.x, o.y);
        text(o.food, o.x, o.y);
        let movement = speedMod * speed * o.s;
        //console.log(movement);
        if (o.x < o.destination[0]) {
            if (o.x > o.destination[0] - movement) {
                o.x = o.destination[0];
            } else {
                o.x += movement;
            }
        } else if (o.x > o.destination[0]) {
            if (o.x < o.destination[0] + movement) {
                o.x = o.destination[0];
            } else {
                o.x -= movement;
            }
        }
        if (o.y < o.destination[1]) {
            if (o.y > o.destination[1] - movement) {
                o.y = o.destination[1];
            } else {
                o.y += movement;
            }
        } else if (o.y > o.destination[1]) {
            if (o.y < o.destination[1] + movement) {
                o.y = o.destination[1];
            } else {
                o.y -= movement;
            }
        }
    }
    time++;
    if (
        document.getElementById("evolve").checked &&
        Math.floor(time / 30) >= 10
    ) {
        reproduce(reproductionType);
        console.log(reproductionType);
        generation++;
        document.getElementById("gen").innerText = `Generation: ${generation}`;
        time = 0;
        const a = alleles();
        alleleChart.data.datasets[0].data.push(a.dominant);
        alleleChart.data.datasets[1].data.push(a.recessive);
        alleleChart.data.labels.push(generation);
        alleleChart.update();
        performanceChart.data.datasets[0].data = Array(totalOrganisms).fill(0);
        performanceChart.update();

        document.getElementById(
            "a-dom"
        ).innerText = `Dominant Alleles: ${a.dominant}`;
        document.getElementById(
            "a-rec"
        ).innerText = `Recessive Alleles: ${a.recessive}`;

        const g = genotypes();
        document.getElementById(
            "hom-dom"
        ).innerText = `Homozygous Dominant: ${g.homo_dom}`;
        document.getElementById(
            "hom-rec"
        ).innerText = `Homozygous Recessive: ${g.homo_rec}`;
        document.getElementById("het").innerText = `Heterozygous: ${g.het}`;
    }
}

function switchEvolutionType() {
    reset();
    alleleChart.data.labels = [0];
    const a = alleles();
    alleleChart.data.datasets[0].data = [a.dominant];
    alleleChart.data.datasets[1].data = [a.recessive];
    alleleChart.update();

    performanceChart.data.datasets[0].data = Array(totalOrganisms).fill(0);
    performanceChart.update();

    document.getElementById(
        "a-dom"
    ).innerText = `Dominant Alleles: ${a.dominant}`;
    document.getElementById(
        "a-rec"
    ).innerText = `Recessive Alleles: ${a.recessive}`;

    const g = genotypes();
    document.getElementById(
        "hom-dom"
    ).innerText = `Homozygous Dominant: ${g.homo_dom}`;
    document.getElementById(
        "hom-rec"
    ).innerText = `Homozygous Recessive: ${g.homo_rec}`;
    document.getElementById("het").innerText = `Heterozygous: ${g.het}`;

    let hwRadio = document.getElementById("hw").checked;
    if (hwRadio) {
        reproductionType = 0;
        document.getElementById("reproType").innerText =
            "Reproduction Type: Hardy Weinberg";
    } else {
        reproductionType = 1;
        document.getElementById("reproType").innerText =
            "Reproduction Type: Natural Selection";
    }
}
