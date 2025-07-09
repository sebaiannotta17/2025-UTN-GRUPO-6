const apiUrl = 'https://gestionweb.frlp.utn.edu.ar';
const apiToken = '099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea';
//const apiUrl = 'http://localhost:1337';
//const apiToken = '';

axios.defaults.headers.common['Authorization'] = `Bearer ${apiToken}`;

const state = {
    carreras: [],
    materias: [],
    alumnos: []
};

const refs = {
    ulCarreras: document.getElementById('carreras'),
    tablaCarreras: document.getElementById('tabla-carreras'),
    tablaMaterias: document.getElementById('tabla-materias'),
    tablaAlumnos: document.getElementById('tabla-alumnos'),
    selectCarreraForMateria: document.getElementById('materia-carrera'),
    selectAlumnoAssign: document.getElementById('select-alumnos'),
    selectMateriaAssign: document.getElementById('select-materia'),
};

async function fetchCarreras() {
    const res = await axios.get(`${apiUrl}/api/carreras`);
    state.carreras = res.data.data;
    
    renderCarreras();
    fillCarreraSelects();
}

async function fetchMaterias() {
    const res = await axios.get(`${apiUrl}/api/materias?populate=*`);
    state.materias = res.data.data;

    renderMaterias();
    fillMateriaAssign();
}

async function fetchAlumnos() {
    const res = await axios.get(`${apiUrl}/api/alumnos`);
    state.alumnos = res.data.data;

    renderAlumnos();
    fillAlumnoAssign();
}

function renderCarreras() {
    refs.tablaCarreras.innerHTML = '';
    refs.ulCarreras.innerHTML = '';
    state.carreras.forEach(c => {
        const li = document.createElement('li');
        li.textContent = `${c.id} - ${c.nombre}`;
        refs.ulCarreras.append(li);

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <th>${c.id}</th>
          <td>${c.nombre}</td>
          <td><button class="btn btn-danger">Eliminar</button></td>`;
        tr.querySelector('button').addEventListener('click', () => deleteCarrera(c.documentId));
        refs.tablaCarreras.append(tr);
    });
}

function renderMaterias() {
    refs.tablaMaterias.innerHTML = '';
    state.materias.forEach(m => {
        const carreraNombre = m.carrera?.nombre || '';
        const alumnosCount = m.alumnos?.length || 0;
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <th>${m.id}</th>
          <td>${m.nombre}</td>
          <td>${carreraNombre}</td>
          <td>${alumnosCount}</td>
          <td><button class="btn btn-danger">Eliminar</button></td>`;
        tr.querySelector('button').addEventListener('click', () => deleteMateria(m.documentId));
        refs.tablaMaterias.append(tr);
    });
}

function renderAlumnos() {
    refs.tablaAlumnos.innerHTML = '';
    state.alumnos.forEach(a => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <th>${a.id}</th>
          <td>${a.nombre}</td>
          <td>${a.apellido}</td>
          <td>${a.legajo}</td>
          <td><button class="btn btn-danger">Eliminar</button></td>`;
        tr.querySelector('button').addEventListener('click', () => deleteAlumno(a.documentId));
        refs.tablaAlumnos.append(tr);
    });
}

function fillCarreraSelects() {
    refs.selectCarreraForMateria.innerHTML = `<option value="">Seleccione</option>` +
        state.carreras.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
}

function fillAlumnoAssign() {
    refs.selectAlumnoAssign.innerHTML = state.alumnos.map(a =>
        `<option value="${a.id}">${a.nombre} ${a.apellido}</option>`).join('');
}

function fillMateriaAssign() {
    refs.selectMateriaAssign.innerHTML = `<option value="">Seleccione</option>` +
        state.materias.map(m => `<option value="${m.documentId}">${m.nombre}</option>`).join('');
}

async function createCarrera(e) {
    e.preventDefault();
    const nombre = document.getElementById('carrera-nombre').value.trim();

    if (!nombre) return;

    await axios.post(`${apiUrl}/api/carreras`, { data: { nombre } });
    document.getElementById('carrera-nombre').value = '';

    fetchCarreras();
}

async function deleteCarrera(id) {
    await axios.delete(`${apiUrl}/api/carreras/${id}`);

    fetchCarreras();
}

async function createMateria(e) {
    e.preventDefault();
    const nombre = document.getElementById('materia-nombre').value.trim();
    const carrera = refs.selectCarreraForMateria.value;

    if (!nombre || !carrera) return;

    await axios.post(`${apiUrl}/api/materias`, { data: { nombre, carrera } });
    document.getElementById('materia-nombre').value = '';
    refs.selectCarreraForMateria.value = '';

    fetchMaterias();
}

async function deleteMateria(id) {
    await axios.delete(`${apiUrl}/api/materias/${id}`);

    fetchMaterias();
}

async function createAlumno(e) {
    e.preventDefault();
    const nombre = document.getElementById('alumno-nombre').value.trim();
    const apellido = document.getElementById('alumno-apellido').value.trim();
    const legajo = document.getElementById('alumno-legajo').value.trim();

    if (!nombre || !apellido || !legajo) return;
    
    await axios.post(`${apiUrl}/api/alumnos`, { data: { nombre, apellido, legajo } });
    document.getElementById('alumno-nombre').value = '';
    document.getElementById('alumno-apellido').value = '';
    document.getElementById('alumno-legajo').value = '';

    fetchAlumnos();
}

async function deleteAlumno(id) {
    await axios.delete(`${apiUrl}/api/alumnos/${id}`);

    fetchAlumnos();
    fetchMaterias();
}

async function assignAlumnoToMateria(e) {
    e.preventDefault();
    debugger;
    const alumnos = Array.from(refs.selectAlumnoAssign.selectedOptions).map(o => o.value);
    const materia = refs.selectMateriaAssign.value;

    if (!materia || alumnos.length === 0) return;
    
    await axios.put(`${apiUrl}/api/materias/${materia}`, { data: { alumnos } });
    refs.selectMateriaAssign.value = '';
    Array.from(refs.selectAlumnoAssign.options).forEach(o => o.selected = false);

    fetchMaterias();
}

document.getElementById('form-carrera').addEventListener('submit', createCarrera);
document.getElementById('form-materia').addEventListener('submit', createMateria);
document.getElementById('form-alumno').addEventListener('submit', createAlumno);
document.getElementById('form-assign').addEventListener('submit', assignAlumnoToMateria);

fetchCarreras();
fetchMaterias();
fetchAlumnos();
