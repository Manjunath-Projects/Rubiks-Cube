// === getCubeSvg() ===
function getCubeSvg(colorString) {
  const container = document.getElementById('cube-display');
  const faceSize = 9;
  const faces = [
    { name: 'U', start: 0 },
    { name: 'R', start: 9 },
    { name: 'F', start: 18 },
    { name: 'D', start: 27 },
    { name: 'L', start: 36 },
    { name: 'B', start: 45 },
  ];
  let html = '<div class="cube">';
  faces.forEach(face => {
    html += `<div class="face"><h4>${face.name}</h4><div class="grid">`;
    for (let i = 0; i < faceSize; i++) {
      const color = colorString[face.start + i];
      html += `<div class="sticker ${color}"></div>`;
    }
    html += '</div></div>';
  });
  html += '</div><hr>';
  container.innerHTML += html;
}

class Cube {
  constructor() {
    this.faces = {
      U: Array(9).fill('w'),
      D: Array(9).fill('y'),
      L: Array(9).fill('o'),
      R: Array(9).fill('r'),
      F: Array(9).fill('g'),
      B: Array(9).fill('b')
    };
    this.scrambleMoves = [];
    this.render();
  }

  rotateFaceClockwise(face) {
    const f = this.faces[face];
    this.faces[face] = [f[6], f[3], f[0], f[7], f[4], f[1], f[8], f[5], f[2]];
  }

  rotateFaceCounterClockwise(face) {
    const f = this.faces[face];
    this.faces[face] = [f[2], f[5], f[8], f[1], f[4], f[7], f[0], f[3], f[6]];
  }

  rotate(move) {
    const face = move.replace("'", "");
    const prime = move.includes("'");
    if (prime) {
      this.rotateFaceCounterClockwise(face);
    } else {
      this.rotateFaceClockwise(face);
    }
    this.rotateSideEdges(face, prime);
  }

  rotateSideEdges(face, prime) {
    let temp;
    if (face === 'F') {
      if (!prime) {
        temp = this.faces.U.slice(6, 9);
        this.faces.U[6] = this.faces.L[8];
        this.faces.U[7] = this.faces.L[5];
        this.faces.U[8] = this.faces.L[2];

        this.faces.L[2] = this.faces.D[0];
        this.faces.L[5] = this.faces.D[1];
        this.faces.L[8] = this.faces.D[2];

        this.faces.D[0] = this.faces.R[6];
        this.faces.D[1] = this.faces.R[3];
        this.faces.D[2] = this.faces.R[0];

        this.faces.R[0] = temp[0];
        this.faces.R[3] = temp[1];
        this.faces.R[6] = temp[2];
      } else {
        temp = this.faces.U.slice(6, 9);
        this.faces.U[6] = this.faces.R[0];
        this.faces.U[7] = this.faces.R[3];
        this.faces.U[8] = this.faces.R[6];

        this.faces.R[0] = this.faces.D[2];
        this.faces.R[3] = this.faces.D[1];
        this.faces.R[6] = this.faces.D[0];

        this.faces.D[0] = this.faces.L[2];
        this.faces.D[1] = this.faces.L[5];
        this.faces.D[2] = this.faces.L[8];

        this.faces.L[2] = temp[2];
        this.faces.L[5] = temp[1];
        this.faces.L[8] = temp[0];
      }
    }
  }

  scramble(times = 5) {
    const moves = ['F', "F'"];
    this.scrambleMoves = [];
    for (let i = 0; i < times; i++) {
      const move = moves[Math.floor(Math.random() * moves.length)];
      this.rotate(move);
      this.scrambleMoves.push(move);
    }
    document.getElementById('cube-display').innerHTML = '';
    this.render();
  }

  solve() {
    const solution = [...this.scrambleMoves].reverse().map(m =>
      m.includes("'") ? m.replace("'", "") : m + "'");

    document.getElementById('cube-display').innerHTML = '';

    let i = 0;
    const interval = setInterval(() => {
      if (i >= solution.length) {
        clearInterval(interval);
        this.scrambleMoves = [];
        return;
      }
      this.rotate(solution[i]);
      this.render();
      i++;
    }, 500);
  }

  getColorString() {
    return this.faces.U.join('') + this.faces.R.join('') + this.faces.F.join('') + this.faces.D.join('') + this.faces.L.join('') + this.faces.B.join('');
  }

  render() {
    getCubeSvg(this.getColorString());
  }
}

const cube = new Cube();

document.getElementById('scrambleBtn').addEventListener('click', () => {
  cube.scramble();
});

document.getElementById('solveBtn').addEventListener('click', () => {
  cube.solve();
});
