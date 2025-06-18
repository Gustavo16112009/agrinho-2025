let estadoPlanta = 0; // 0: Semente, 1: Broto, 2: Jovem, 3: Flor
let nivelAgua = 50; // Começa com um nível médio de água
let nivelLuz = 50;  // Começa com um nível médio de luz
let saudePlanta = 100; // Saúde geral da planta
let gotasChuva = []; // Array para armazenar as gotas de chuva
let raiosSol = []; // Array para armazenar os raios de sol

function setup() {
  createCanvas(600, 400); // Tela maior
  frameRate(40); // Mais suave
}

function draw() {
  background(173, 216, 230); // Céu azul claro

  // Desenha o sol (sempre presente, mas pode ter raios quando ativado)
  fill(255, 200, 0);
  noStroke();
  ellipse(width - 70, 70, 80, 80);

  // Desenha o chão
  fill(139, 69, 19);
  noStroke();
  rect(0, height - 80, width, 80);

  // Exibe os níveis e saúde
  fill(0);
  textSize(14);
  textAlign(LEFT);
  text(`Água: ${int(nivelAgua)}%`, 20, 30);
  text(`Luz: ${int(nivelLuz)}%`, 20, 50);
  text(`Saúde: ${int(saudePlanta)}%`, 20, 70);

  // Instruções interativas
  textAlign(CENTER);
  fill(50);
  text("Clique na parte inferior para REGAR 💧", width / 2, height - 15);
  text("Clique na parte superior para DAR LUZ ☀️", width / 2, 45);

  // Lógica de decadência
  nivelAgua = max(0, nivelAgua - 0.05); // Água diminui lentamente
  nivelLuz = max(0, nivelLuz - 0.05);  // Luz diminui lentamente

  // Ajusta a saúde
  saudePlanta = (nivelAgua + nivelLuz) / 2;
  saudePlanta = constrain(saudePlanta, 0, 100);

  // Lógica de crescimento/regressão
  if (saudePlanta >= 80 && estadoPlanta < 3) {
    if (frameCount % 100 == 0) { // Cresce a cada 100 frames se a saúde estiver alta
      estadoPlanta++;
    }
  } else if (saudePlanta <= 30 && estadoPlanta > 0) {
    if (frameCount % 150 == 0) { // Regride a cada 150 frames se a saúde estiver baixa
      estadoPlanta--;
    }
  }

  // Desenha a planta de acordo com o estado
  desenhaPlanta(estadoPlanta);

  // Desenha e atualiza gotas de chuva
  for (let i = gotasChuva.length - 1; i >= 0; i--) {
    gotasChuva[i].update();
    gotasChuva[i].display();
    if (gotasChuva[i].isFinished()) {
      gotasChuva.splice(i, 1);
    }
  }

  // Desenha e atualiza raios de sol
  for (let i = raiosSol.length - 1; i >= 0; i--) {
    raiosSol[i].update();
    raiosSol[i].display();
    if (raiosSol[i].isFinished()) {
      raiosSol.splice(i, 1);
    }
  }

  // Indicadores visuais de necessidade da planta
  if (nivelAgua < 30) {
    // Desenha gotas de água flutuando acima da planta quando precisa de água
    fill(0, 100, 200, 150); // Azul transparente
    ellipse(width / 2 - 20, height - 150 + sin(frameCount * 0.1) * 5, 10, 15);
    ellipse(width / 2 + 20, height - 160 + cos(frameCount * 0.1) * 5, 10, 15);
  }

  if (nivelLuz < 30) {
    // Desenha pequenos brilhos de sol quando precisa de luz
    fill(255, 255, 0, 150); // Amarelo transparente
    let px = width / 2;
    let py = height - 150;
    for (let i = 0; i < 4; i++) {
      let angle = PI / 2 * i + frameCount * 0.05;
      line(px, py, px + cos(angle) * 20, py + sin(angle) * 20);
    }
  }
}

// Classe para as gotas de chuva
class GotaChuva {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velY = 5;
    this.lifetime = 255;
  }

  update() {
    this.y += this.velY;
    this.lifetime -= 5;
  }

  display() {
    stroke(0, 100, 200, this.lifetime);
    line(this.x, this.y, this.x, this.y + 10);
  }

  isFinished() {
    return this.lifetime < 0;
  }
}

// Classe para os raios de sol
class RaioSol {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = random(0, TWO_PI);
    this.length = random(10, 30);
    this.lifetime = 255;
  }

  update() {
    this.lifetime -= 5;
  }

  display() {
    stroke(255, 255, 0, this.lifetime);
    strokeWeight(2);
    line(this.x, this.y, this.x + cos(this.angle) * this.length, this.y + sin(this.angle) * this.length);
  }

  isFinished() {
    return this.lifetime < 0;
  }
}

// Função para desenhar a planta em diferentes estágios
function desenhaPlanta(estado) {
  let x = width / 2;
  let y = height - 80; // Posição base da planta no chão

  push(); // Salva as configurações de estilo
  translate(x, y); // Move o sistema de coordenadas para o centro da planta

  if (estado === 0) { // Semente
    fill(100, 50, 0);
    ellipse(0, 20, 15, 10);
  } else if (estado === 1) { // Broto
    fill(34, 139, 34);
    rect(-2, -10, 4, 30); // Caule pequeno
    ellipse(0, -20, 10, 15); // Folha pequena
  } else if (estado === 2) { // Planta Jovem
    fill(34, 139, 34);
    rect(-5, -50, 10, 60); // Caule maior
    fill(0, 128, 0);
    // Folhas maiores e mais elaboradas
    beginShape();
    vertex(-15, -30);
    bezierVertex(-30, -50, -30, -10, -15, -30);
    endShape(CLOSE);

    beginShape();
    vertex(15, -30);
    bezierVertex(30, -50, 30, -10, 15, -30);
    endShape(CLOSE);

  } else if (estado === 3) { // Flor
    fill(34, 139, 34);
    rect(-5, -80, 10, 90); // Caule grande
    fill(0, 128, 0);
    // Folhas bem desenvolvidas
    beginShape();
    vertex(-25, -50);
    bezierVertex(-45, -70, -45, -20, -25, -50);
    endShape(CLOSE);

    beginShape();
    vertex(25, -50);
    bezierVertex(45, -70, 45, -20, 25, -50);
    endShape(CLOSE);

    // Flor elaborada
    fill(255, 100, 100); // Pétalas
    for (let i = 0; i < 6; i++) {
      push();
      rotate(TWO_PI / 6 * i);
      ellipse(0, -90, 20, 40);
      pop();
    }
    fill(255, 200, 0); // Centro da flor
    ellipse(0, -90, 30, 30);
  }
  pop(); // Restaura as configurações de estilo
}

// Função chamada quando o mouse é clicado
function mousePressed() {
  if (mouseY > height / 2) {
    // Regar a planta
    nivelAgua += 25;
    nivelAgua = constrain(nivelAgua, 0, 100);
    for (let i = 0; i < 15; i++) { // Adiciona várias gotas de chuva
      gotasChuva.push(new GotaChuva(random(width / 2 - 50, width / 2 + 50), random(-50, 0)));
    }
  } else {
    // Dar luz à planta
    nivelLuz += 25;
    nivelLuz = constrain(nivelLuz, 0, 100);
    for (let i = 0; i < 10; i++) { // Adiciona vários raios de sol
      raiosSol.push(new RaioSol(width - 70 + random(-30, 30), 70 + random(-30, 30)));
    }
  }
}
