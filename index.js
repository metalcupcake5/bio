let organisms = [];

for (let i = 0; i < 10000; i++) {
    organisms.push({
        x: 200,
        y: 200,
        allele1: Math.floor(Math.random() * 2),
        allele2: Math.floor(Math.random() * 2),
    });
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

for (let i = 0; i < 20; i++) {
    let parentGen = [...organisms];
    let newGen = [];
    while (parentGen.length > 0) {
        let p1 = parentGen.splice(
            Math.floor(Math.random() * parentGen.length),
            1
        )[0];
        let p2 = parentGen.splice(
            Math.floor(Math.random() * parentGen.length),
            1
        )[0];
        newGen.push(reproduce(p1, p2), reproduce(p1, p2));
    }
    organisms = newGen;
    console.log(alleles());
}
