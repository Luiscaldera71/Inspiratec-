import assert from 'node:assert';
import fs from 'node:fs';

console.log('🧪 Iniciando pruebas de la Bienvenida Narrativa...');

const code = fs.readFileSync('src/components/BienvenidaNarrativa.jsx', 'utf8');

// 1. Imagen única Bien.png
assert(code.includes("'/Bienvenida/Bien.png'"), 'Debe utilizar la imagen /Bienvenida/Bien.png');
assert(!code.includes("'/Bienvenida/INICIO.png'"), 'No debe contener INICIO.png');
assert(!code.includes("'/Bienvenida/PLANIFICACION.png'"), 'No debe contener PLANIFICACION.png');
assert(!code.includes("'/Bienvenida/MIS_PLANES.png'"), 'No debe contener MIS_PLANES.png');
assert(!code.includes("'/Bienvenida/BIBLIOTECA.png'"), 'No debe contener BIBLIOTECA.png');
assert(!code.includes("'/Bienvenida/FORO.png'"), 'No debe contener FORO.png');
console.log('✓ Verificación de imagen única Bien.png completada');

// 2. Apartados y novedades indispensables
assert(code.includes('adn-pedagogico') || code.includes('Mi ADN Pedagógico'), 'Debe incluir Mi ADN Pedagógico');
assert(code.includes('materiales-didacticos') || code.includes('Materiales Didácticos'), 'Debe incluir Materiales Didácticos');
assert(code.includes('planificador'), 'Debe incluir el Planificador');
assert(code.includes('editor'), 'Debe incluir el Editor');
assert(code.includes('mis-planes'), 'Debe incluir Mis Planes');
assert(code.includes('comunidad'), 'Debe incluir Comunidad');
assert(code.includes('configuracion_ia'), 'Debe incluir Configuración IA');
console.log('✓ Verificación de apartados indispensables completada');

console.log('🎉 Pruebas de la Bienvenida superadas con éxito.');
