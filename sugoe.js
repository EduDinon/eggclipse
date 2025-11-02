// SUGOE.js

const playerData = [];
let b = 0;

function soundEffect(src, volume=0.2) {
  const audio = document.createElement('audio');

  audio.src = src;
  audio.preload = 'auto';
  audio.volume = volume;
  audio.play();

  setTimeout(() => { audio.remove(); }, 1000);
}

function points() {
  const points = [...document.querySelectorAll('.points')];
  console.log(points);

  points.forEach(point => {
    point.addEventListener('click', () => {
      point.classList.toggle('active');

      soundEffect('UIPitch1.wav', 0.2);

      return;
    })
  }); 
}

function objectId (id) {
  this.name = id;
  this.value = 0;

  playerData.push(this);
}

function generateTable(data) {
  const table = document.getElementById('hader');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  table.appendChild(thead);
  table.appendChild(tbody);

  const tr1 = document.createElement('tr');
  const tr2 = document.createElement('tr');
  const th1 = document.createElement('th');
  const th2 = document.createElement('th');
  const h1 = document.createElement('h1');

  th1.colSpan = data.approaches.length * 2 + 1;
  h1.textContent = "AÇÕES";
  th2.textContent = "---";

  th1.appendChild(h1);
  tr1.appendChild(th1);
  tr2.appendChild(th2);

  thead.appendChild(tr1);
  thead.appendChild(tr2);

  data.approaches.forEach(approach => {
    const th = document.createElement('th');

    th.textContent = approach.name;
    th.colSpan = 2;
    tr2.appendChild(th);
  })

  data.domains.forEach(domain => { 
    const tr = document.createElement('tr');
    const th = document.createElement('th');

    th.textContent = domain.name;

    tbody.appendChild(tr);
    tr.appendChild(th);

    data.approaches.forEach(approach => {
      const td1 = document.createElement('td');
      const td2 = document.createElement('td');
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');

      div1.className = `points`;
      div2.className = `points`;

      id = `${approach.abbrev}${domain.abbrev}`;
      const object = new objectId(id);
      playerData.push(object);

      div1.id = `pt${id}1`;
      div2.id = `pt${id}2`;
      td2.textContent = `${data.actions.find(action => action.abbrev === id)?.description || '⸻'}`;

      td1.appendChild(div1);
      td1.appendChild(div2);

      tr.appendChild(td1);
      tr.appendChild(td2);
    })
  })

  points();
}

/// JSON Loading Function

async function loadJSON(url) {
  try {
    // 1. Faz a requisição HTTP para o arquivo
    const response = await fetch(url);

    // 2. Verifica se a requisição foi bem-sucedida
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    // 3. Converte a resposta para um objeto JavaScript (JSON.parse implícito)
    const data = await response.json();

    // 4. Agora 'dados' é um objeto/array JavaScript que pode ser usado
    console.log("Dados carregados:", data);

    // Exemplo de acesso: Se o JSON for um objeto com uma propriedade 'nome'
    // console.log("Nome:", dados.nome); 

    generateTable(data[0]);

    return data;
  } catch (error) {
    console.error("Falha ao carregar o arquivo JSON:", error);
    return null; // Retorna nulo ou trata o erro conforme necessário
  }
}

// Chame a função com o caminho do seu arquivo JSON
loadJSON('data.json');

/// Save and Load Functions

function savePlayerData() {
  playerData.forEach(item => {
    item.value = 0;
  })

  document.querySelectorAll('.points.active').forEach(point => {
    playerData.find(item => item.name === point.id.slice(2, -1)).value += 1;
  });

  const dataStr = JSON.stringify(playerData);
  
  localStorage.setItem('playerData', dataStr);

  soundEffect('savepoint.mp3', 0.2);
  console.log("saved");
}

function loadPlayerData() {
  const dataStr = JSON.parse(localStorage.getItem('playerData')) || [];
  playerData.length = 0;
  playerData.push(...dataStr);

  document.querySelectorAll('.points.active').forEach(point => {
    point.classList.remove('active');
  });

  playerData.forEach(item => {
    const points = document.querySelectorAll(`#pt${item.name}1, #pt${item.name}2`);

    if (points.length !== 0) {
      for (let i = 0; i < item.value; i++) {
      points[i].classList.add('active');
    }}
  });
  
  soundEffect('savepoint.mp3', 0.2);
  console.log("loaded");
}

function wipePlayerData() {
  localStorage.removeItem('playerData');
  console.log("wiped");
}

document.getElementById('save-button').addEventListener('click', savePlayerData);
document.getElementById('load-button').addEventListener('click', loadPlayerData);