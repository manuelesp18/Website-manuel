const formulario = document.getElementById('formulario');
const inputs = document.querySelectorAll('#formulario input');

const expresiones = {
	nombre: /^[a-zA-ZÀ-ÿ\s]{1,80}$/ , // Letras y espacios, pueden llevar acentos.
    dni:  /^\d{4,14}$/, // 4 a 14 numeros.
    phone: /^\d{11}$/,// 11 numeros.
	email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    banco: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    referencia:  /^\d{4,30}$/, // 4 a 30 numeros.
    total:  /^\d{4,30}$/ // 4 a 30 numeros.
}

const campos = {
    nombre: false,
    dni: false,
    phone: false,
    email: false,
    banco: false,
    referencia: false,
    total: false
}

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "nombre":
            validarCampo(expresiones.nombre, e.target, 'nombre');
        break;
        case "dni":
            validarCampo(expresiones.dni, e.target, 'dni');
        break;
        case "phone":
            validarCampo(expresiones.phone, e.target, 'phone');
        break;
        case "email":
            validarCampo(expresiones.email, e.target, 'email');
        break;
        case "banco":
            validarCampo(expresiones.banco, e.target, 'banco');
        break;
        case "referencia":
            validarCampo(expresiones.referencia, e.target, 'referencia');
        break;
        case "total":
            validarCampo(expresiones.total, e.target, 'total');
        break;
    }
}

const validarCampo = (expresion, input, campo) => {
    if(expresion.test(input.value)) {
        document.getElementById(`grupo_${campo}`).classList.remove('formulario_grupo-incorrecto');
        document.getElementById(`grupo_${campo}`).classList.add('formulario_grupo-correcto');
        document.querySelector(`#grupo_${campo} i`).classList.add('fa-check-circle');
        document.querySelector(`#grupo_${campo} i`).classList.remove('fa-times-circle');
        document.querySelector(`#grupo_${campo} .formulario_input-error`).classList.remove('formulario_input-error-activo');
        campos[campo] = true;
    } else {
        document.getElementById(`grupo_${campo}`).classList.add('formulario_grupo-incorrecto');
        document.getElementById(`grupo_${campo}`).classList.remove('formulario_grupo-correcto');
        document.querySelector(`#grupo_${campo} i`).classList.add('fa-times-circle');
        document.querySelector(`#grupo_${campo} i`).classList.remove('fa-check-circle');
        document.querySelector(`#grupo_${campo} .formulario_input-error`).classList.add('formulario_input-error-activo');
        campos[campo] = false;
    }
}

inputs.forEach((input) => {
    input.addEventListener('keyup', validarFormulario);
    input.addEventListener('blur', validarFormulario);
});

formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    if(campos.nombre && campos.dni && campos.phone && campos.email && campos.banco && campos.referencia && campos.total) {


        document.getElementById('formulario_mensaje-exito').classList.add('formulario_mensaje-exito-activo');
        setTimeout(() => {
            document.getElementById('formulario_mensaje-exito').classList.remove('formulario_mensaje-exito-activo');
        }, 5000);

        document.querySelectorAll('.formulario_grupo-correcto').forEach((icono) => {
            icono.classList.remove('formulario_grupo-correcto');
        });
    } else {
        document.getElementById('formulario_mensaje').classList.add('formulario_mensaje-activo');
    }
    
});