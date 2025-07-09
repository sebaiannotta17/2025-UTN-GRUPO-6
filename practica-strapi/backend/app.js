var app = new Vue({
    el: '#app',
    data: {
        carreras: [],
        materias: [],
        alumnos: [],
        carrera: {
        	nombre: ''
        },
        materia: {
        	nombre: '',
        	carrera: null
        },
        alumno: {
        	nombre: '',
        	apellido: '',
        	legajo: ''
        },
        alumnoMateria: {
            alumnos: [],
            materia: null
        }
    },
    methods: {
        getCarreras() {
            axios.get('http://localhost:81/carreras')
                .then(response => {
                    this.carreras = response.data.data;
                });
        },
        getMaterias() {
            axios.get('http://localhost:81/materias')
                .then(response => {
                    this.materias = response.data.data;
                });
        },
        getAlumnos() {
            axios.get('http://localhost:81/alumnos')
                .then(response => {
                    this.alumnos = response.data.data;
                });
        },
        createCarrera() {
        	let data = {
        		nombre: this.carrera.nombre
        	};

            axios.post('http://localhost:81/carreras', data)
                .then(response => {
                    this.getCarreras();

                    this.carrera.nombre = '';
                });
        },
        deleteCarrera(carrera) {
			axios.delete('http://localhost:81/carreras/' + carrera.documentId)
                .then(response => {
                    this.getCarreras();
                });
        },
        createMateria() {
        	let data = {
        		nombre: this.materia.nombre,
        		carrera: this.materia.carrera
        	};

            axios.post('http://localhost:81/materias', data)
                .then(response => {
                    this.getMaterias();

                    this.materia.nombre = '';
                    this.materia.carrera = '';
                });
        },
        deleteMateria(materia) {
			axios.delete('http://localhost:81/materias/' + materia.documentId)
                .then(response => {
                    this.getMaterias();
                });
        },
        createAlumno() {
            let data = {
                nombre: this.alumno.nombre,
                apellido: this.alumno.apellido,
                legajo: this.alumno.legajo
            };

            axios.post('http://localhost:81/alumnos', data)
                .then(response => {
                    this.getAlumnos();
                    this.alumno.nombre = '';
                    this.alumno.apellido = '';
                    this.alumno.legajo = '';
                });
        },
        deleteAlumno(alumno) {
            axios.delete('http://localhost:81/alumnos/' + alumno.documentId)
                .then(response => {
                    this.getAlumnos();
                    this.getMaterias();
                });
        },
        assignAlumnoToMateria() {
            let data = {
                alumnos: this.alumnoMateria.alumnos
            };

            axios.put('http://localhost:81/materias/' +  this.alumnoMateria.materia, data)
                .then(response => {
                    this.getMaterias();

                    this.alumnoMateria.alumnos = [];
                    this.alumnoMateria.materia = null;
                });
        }
    },
    mounted() {
        this.getCarreras();
        this.getMaterias();
        this.getAlumnos();
    }
})
