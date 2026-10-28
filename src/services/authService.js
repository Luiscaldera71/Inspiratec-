import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { useAppStore } from '../store/useAppStore';
import { getDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  encryptSensitiveField, 
  decryptSensitiveField, 
  generateUserJwt, 
  saveSecureSessionToken, 
  clearSecureSession 
} from '../utils/security';

export const initAuth = () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      useAppStore.getState().setUserId(user.uid);
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        let profile = userDoc.exists() ? userDoc.data() : { nombre: 'Docente', rol: 'Docente' };
        
        // Usar el correo directamente de la autenticación de Firebase
        profile.email = user.email || profile.email || '';

        // Descifrar campo celular si viene encriptado para que la UI lo use limpiamente
        if (profile.celular) {
          profile.celularDesencriptado = decryptSensitiveField(profile.celular);
        } else {
          profile.celularDesencriptado = '';
        }

        // Forzar y corregir rol admin si el correo coincide
        const normalizedEmail = profile.email.toLowerCase().trim();
        if (normalizedEmail === 'danieltapiasacosta39@gmail.com') {
          profile.rol = 'Admin';
          // Intentar actualizar en DB si no estaba
          if (!userDoc.exists() || userDoc.data()?.rol !== 'Admin') {
            await setDoc(doc(db, 'users', user.uid), { rol: 'Admin', email: profile.email }, { merge: true });
          }
        }
        
        // Cargar API Key del usuario si existe
        if (profile.apiKey) {
          const decryptedApiKey = decryptSensitiveField(profile.apiKey);
          useAppStore.getState().setApiKey(decryptedApiKey);
        }
        
        // Generar y almacenar JWT de sesión verificado
        const jwtToken = generateUserJwt({
          uid: user.uid,
          email: profile.email,
          rol: profile.rol || 'Docente',
          nombre: profile.nombre || 'Docente'
        });
        saveSecureSessionToken(jwtToken);
        profile.jwtToken = jwtToken;

        useAppStore.getState().setUserProfile(profile);
      } catch(e) {
        console.error("Error loading profile", e);
      }
    } else {
      clearSecureSession();
      useAppStore.getState().setUserId(null);
      useAppStore.getState().setUserProfile(null);
    }
  });
};

export const registerUser = async (nombre, institucion, nivel, email, password, celular = '', termsAccepted = true, metodologiaInstitucional = '', ejeTransversal = '') => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Encriptar el celular para proteger datos sensibles (Habeas Data)
  const encryptedCelular = celular ? encryptSensitiveField(celular) : '';

  const profileData = {
    nombre,
    institucion,
    nivel,
    email,
    celular: encryptedCelular,
    metodologiaInstitucional: metodologiaInstitucional || 'Aprendizaje Basado en Proyectos (ABP)',
    ejeTransversal: ejeTransversal || 'Enfoque STEAM (Ciencia, Tecnología, Arte y Matemáticas)',
    termsAccepted: Boolean(termsAccepted),
    termsAcceptedAt: new Date().toISOString(),
    rol: 'Docente',
    bienvenidaCompletada: false,
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, 'users', user.uid), profileData);

  // Generar JWT para la sesión recién creada
  const jwtToken = generateUserJwt({
    uid: user.uid,
    email,
    rol: 'Docente',
    nombre
  });
  saveSecureSessionToken(jwtToken);

  return user;
};

/**
 * Actualiza la metodología institucional y configuración pedagógica del docente
 */
export const updateUserPedagogicalProfile = async (userId, data = {}) => {
  if (!userId) return false;
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error actualizando perfil pedagógico en Firestore:", error);
    return false;
  }
};

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Generar JWT
  const jwtToken = generateUserJwt({
    uid: user.uid,
    email: user.email,
    rol: 'Docente'
  });
  saveSecureSessionToken(jwtToken);

  return userCredential;
};

export const logoutUser = async () => {
  clearSecureSession();
  return await signOut(auth);
};

// Función para inicializar el admin solicitado
export const initAdminAccount = async () => {
  const adminEmail = 'Danieltapiasacosta39@gmail.com';
  const adminPass = '1234567890';
  try {
    await loginUser(adminEmail, adminPass);
    console.log("Admin ya existe y se ha logueado.");
  } catch (error) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      try {
        await registerUser("Daniel Tapias (Admin)", "INSPIRATEC", "Media", adminEmail, adminPass, "+573001234567", true);
        await setDoc(doc(db, 'users', auth.currentUser.uid), { rol: 'Admin' }, { merge: true });
        console.log("Admin account created successfully.");
      } catch(e) {
        console.log("Could not create admin:", e);
      }
    }
  }
};

export const changeUserPassword = async (currentPassword, newPassword) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No hay usuario autenticado.");
  
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  try {
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  } catch (error) {
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
      throw new Error('invalid-credential');
    }
    if (error.code === 'auth/weak-password') {
      throw new Error('weak-password');
    }
    if (error.code === 'auth/requires-recent-login') {
      throw new Error('requires-recent-login');
    }
    throw error;
  }
};

export const updateUserProfile = async (uid, data) => {
  const userRef = doc(db, 'users', uid);
  const dataToSave = { ...data };
  
  // Si se actualiza el celular, encriptarlo antes de persistir
  if (dataToSave.celular !== undefined) {
    dataToSave.celular = encryptSensitiveField(dataToSave.celular);
  }

  // Si se actualiza la apiKey, encriptarla
  if (dataToSave.apiKey !== undefined) {
    dataToSave.apiKey = encryptSensitiveField(dataToSave.apiKey);
  }
  
  await updateDoc(userRef, dataToSave);
};
