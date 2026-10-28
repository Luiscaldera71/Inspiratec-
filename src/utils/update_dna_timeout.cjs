const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../services/pedagogicalDnaService.js');
let content = fs.readFileSync(filePath, 'utf8');

const hasCRLF = content.includes('\r\n');
if (hasCRLF) content = content.replace(/\r\n/g, '\n');

// 1. Agregar helper withTimeout
if (!content.includes('const withTimeout =')) {
  const targetHelper = `const getLocalStorageSafe = () => {`;
  const helperCode = `const withTimeout = (promise, ms = 2200) => {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Firestore timeout')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
};

const getLocalStorageSafe = () => {`;
  content = content.replace(targetHelper, helperCode);
}

// 2. Envolver getDoc y setDoc en withTimeout
content = content.replace(
  'const userSnap = await getDoc(userRef);',
  'const userSnap = await withTimeout(getDoc(userRef));'
);

content = content.replace(
  'const instSnap = await getDoc(instRef);',
  'const instSnap = await withTimeout(getDoc(instRef));'
);

content = content.replace(
  'await setDoc(userRef, {',
  'await withTimeout(setDoc(userRef, {'
);

content = content.replace(
  '}, { merge: true });\n    } catch (e)',
  '}, { merge: true }));\n    } catch (e)'
);

content = content.replace(
  'await setDoc(instRef, {',
  'await withTimeout(setDoc(instRef, {'
);

content = content.replace(
  '}, { merge: true });\n    } catch (e) {\n      console.warn("Error guardando ADN institucional',
  '}, { merge: true }));\n    } catch (e) {\n      console.warn("Error guardando ADN institucional'
);

if (hasCRLF) content = content.replace(/\n/g, '\r\n');

fs.writeFileSync(filePath, content, 'utf8');
console.log('pedagogicalDnaService.js actualizado con withTimeout');
