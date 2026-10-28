import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAppStore } from '../store/useAppStore';
import { updateUserPedagogicalProfile } from '../services/authService';
import { savePedagogicalDna, getPedagogicalDna } from '../services/pedagogicalDnaService';
import { Sparkles, Dna, Compass, CheckCircle2, X, Sliders } from 'lucide-react';

const PREDEFINED_METODOLOGIAS = [
  'Aprendizaje Basado en Proyectos (ABP)',
  'Enseñanza para la Comprensión (EpC)',
  'Flipped Classroom (Aula Invertida)',
  'Aprendizaje Basado en Problemas (ABPr)',
  'Gamificación y Aprendizaje Lúdico',
  'Escuela Nueva / Metodologías Activas'
];

const PREDEFINED_EJES = [
  'Enfoque STEAM (Ciencia, Tecnología, Arte y Matemáticas)',
  'Educación Ambiental y Sostenibilidad (PRAE)',
  'Convivencia, Paz y Habilidades Ciudadanas',
  'Alfabetización Digital & Ciudadanía Crítica',
  'Inclusión y Diversidad Cultural (DUA)',
  'Emprendimiento, Innovación y Pensamiento Creativo',
  'Salud, Bienestar y Educación Socioemocional'
];

export default function ModalCalibracionDocente() {
  const { user, userProfile, setUserProfile } = useAppStore();
  const userId = user?.uid;

  const [isOpen, setIsOpen] = useState(false);
  const [metodologia, setMetodologia] = useState('Aprendizaje Basado en Proyectos (ABP)');
  const [otraMetodologia, setOtraMetodologia] = useState('');
  const [ejeTransversal, setEjeTransversal] = useState('Enfoque STEAM (Ciencia, Tecnología, Arte y Matemáticas)');
  const [otroEjeTransversal, setOtroEjeTransversal] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // Si el usuario ya tiene registrada su metodología institucional en Firestore, no solicitarla
    if (userProfile?.metodologiaInstitucional && userProfile.metodologiaInstitucional.trim() !== '') {
      setIsOpen(false);
      return;
    }

    // Si está en pantalla la bienvenida narrativa, esperar con cortesía a que el docente la finalice
    const checkBienvenidaInterval = setInterval(() => {
      const isBienvenidaActive = typeof window !== 'undefined' && Boolean(document.querySelector('.bienvenida-narrativa-overlay'));
      if (!isBienvenidaActive) {
        clearInterval(checkBienvenidaInterval);
        // Desplegar modal para completar la calibración obligatoria de perfil
        setIsOpen(true);
      }
    }, 800);

    return () => clearInterval(checkBienvenidaInterval);
  }, [userId, userProfile?.metodologiaInstitucional]);

  // Escuchar evento manual para abrir o recalibrar desde cualquier parte del sistema
  useEffect(() => {
    const handleOpenCalibracion = () => {
      if (userProfile?.metodologiaInstitucional) {
        if (PREDEFINED_METODOLOGIAS.includes(userProfile.metodologiaInstitucional)) {
          setMetodologia(userProfile.metodologiaInstitucional);
        } else {
          setMetodologia('Otra');
          setOtraMetodologia(userProfile.metodologiaInstitucional);
        }
      }
      if (userProfile?.ejeTransversal) {
        if (PREDEFINED_EJES.includes(userProfile.ejeTransversal)) {
          setEjeTransversal(userProfile.ejeTransversal);
        } else {
          setEjeTransversal('Otro');
          setOtroEjeTransversal(userProfile.ejeTransversal);
        }
      }
      setIsOpen(true);
    };
    window.addEventListener('open-calibracion-docente', handleOpenCalibracion);
    return () => window.removeEventListener('open-calibracion-docente', handleOpenCalibracion);
  }, [userProfile]);

  const handleClose = () => {
    // Si se cierra temporalmente sin guardar, NO se marca como completado definitivo
    // para recordar al docente registrarlo en su próximo ingreso.
    setIsOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    const metFinal = metodologia === 'Otra'
      ? (otraMetodologia || 'Aprendizaje Activo Personalizado').trim()
      : metodologia;

    const ejeFinal = ejeTransversal === 'Otro'
      ? (otroEjeTransversal || 'Proyecto Transversal Personalizado').trim()
      : ejeTransversal;

    try {
      // 1. Guardar en perfil de Firestore
      await updateUserPedagogicalProfile(userId, {
        metodologiaInstitucional: metFinal,
        ejeTransversal: ejeFinal
      });

      // 2. Calibrar su ADN Pedagógico inicial en Firestore
      const currentDna = await getPedagogicalDna(userId);
      const updatedDna = {
        ...currentDna,
        memoriaExito: {
          ...(currentDna.memoriaExito || {}),
          metodologiasFrecuentes: [{ name: metFinal, count: 1 }]
        },
        matrizTransversalidad: {
          ...(currentDna.matrizTransversalidad || {}),
          ejesInstitucionales: [
            ejeFinal,
            ...((currentDna.matrizTransversalidad?.ejesInstitucionales || []).filter(e => e !== ejeFinal))
          ]
        }
      };
      await savePedagogicalDna(userId, updatedDna, false);

      // 3. Marcar completado en localStorage
      localStorage.setItem(`inspiratec_calibracion_metodologia_done_${userId}`, 'true');

      // 4. Actualizar store global reactivo
      if (setUserProfile && userProfile) {
        setUserProfile({
          ...userProfile,
          metodologiaInstitucional: metFinal,
          ejeTransversal: ejeFinal
        });
      }

      window.dispatchEvent(new CustomEvent('docente-calibracion-updated', {
        detail: { metodologiaInstitucional: metFinal, ejeTransversal: ejeFinal }
      }));

      setIsOpen(false);
    } catch (err) {
      console.error("Error calibrando identidad docente:", err);
      setIsOpen(false);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-glass-backdrop" onClick={handleClose}>
      <div 
        className="modal-glass-panel" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '540px',
          borderRadius: '24px',
          backgroundColor: 'rgba(255, 254, 250, 0.96)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 20px 60px rgba(16, 36, 32, 0.22)',
          border: '1px solid rgba(255, 255, 255, 0.98)',
          padding: '28px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(22, 163, 74, 0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534' }}>
              <Dna size={22} />
            </div>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', color: '#166534', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <Sparkles size={12} />
                <span>Calibración Curricular Día 0</span>
              </div>
              <h3 style={{ margin: '2px 0 0 0', fontSize: '19px', fontWeight: 800, color: '#142B25' }}>
                ¡Bienvenido a INSPIRATEC, Profe!
              </h3>
            </div>
          </div>
          <button className="btn-icon" onClick={handleClose} aria-label="Cerrar modal" style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#4A655D' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '13.5px', color: '#3A544C', lineHeight: 1.5, margin: '0 0 20px 0' }}>
          Para que la Inteligencia Artificial adapte sus sugerencias y secuencias didácticas al contexto de tu colegio, cuéntanos brevemente qué metodología lidera en tu institución:
        </p>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Metodología Institucional */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#142B25' }}>
              Metodología o Modelo Pedagógico Institucional
            </label>
            <select
              value={metodologia}
              onChange={(e) => setMetodologia(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '12px',
                border: '1px solid rgba(49, 91, 84, 0.24)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                fontSize: '13.5px',
                color: '#142B25',
                outline: 'none',
                fontWeight: 600
              }}
            >
              <option value="Aprendizaje Basado en Proyectos (ABP)">Aprendizaje Basado en Proyectos (ABP)</option>
              <option value="Enfoque STEAM Interdisciplinario">Enfoque STEAM Interdisciplinario</option>
              <option value="Aprendizaje Cooperativo y Socrático">Aprendizaje Cooperativo y Socrático</option>
              <option value="Aula Invertida (Flipped Classroom)">Aula Invertida (Flipped Classroom)</option>
              <option value="Enseñanza para la Comprensión (EpC)">Enseñanza para la Comprensión (EpC)</option>
              <option value="Socioformativo o por Competencias">Socioformativo o por Competencias</option>
              <option value="Constructivismo y Aprendizaje Significativo">Constructivismo y Aprendizaje Significativo</option>
              <option value="Escuela Nueva / Metodologías Activas">Escuela Nueva / Metodologías Activas</option>
              <option value="Otra">Otra metodología (escribir)...</option>
            </select>
          </div>

          {metodologia === 'Otra' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#166534' }}>
                Escribe el nombre de la metodología:
              </label>
              <input
                type="text"
                value={otraMetodologia}
                onChange={(e) => setOtraMetodologia(e.target.value)}
                required
                placeholder="Ej.: Pedagogía dialogante"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(22, 163, 74, 0.35)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  fontSize: '13px',
                  color: '#142B25',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          {/* Eje Transversal */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#142B25' }}>
              Proyecto Transversal Prioritario en tu Colegio
            </label>
            <select
              value={ejeTransversal}
              onChange={(e) => setEjeTransversal(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '12px',
                border: '1px solid rgba(49, 91, 84, 0.24)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                fontSize: '13.5px',
                color: '#142B25',
                outline: 'none',
                fontWeight: 600
              }}
            >
              <option value="Enfoque STEAM (Ciencia, Tecnología, Arte y Matemáticas)">Enfoque STEAM (Ciencia, Tecnología, Arte y Matemáticas)</option>
              <option value="Educación Ambiental y Sostenibilidad (PRAE)">Educación Ambiental y Sostenibilidad (PRAE)</option>
              <option value="Convivencia, Paz y Habilidades Ciudadanas">Convivencia, Paz y Habilidades Ciudadanas</option>
              <option value="Alfabetización Digital & Ciudadanía Crítica">Alfabetización Digital & Ciudadanía Crítica</option>
              <option value="Inclusión y Diversidad Cultural (DUA)">Inclusión y Diversidad Cultural (DUA)</option>
              <option value="Emprendimiento, Innovación y Pensamiento Creativo">Emprendimiento, Innovación y Pensamiento Creativo</option>
              <option value="Salud, Bienestar y Educación Socioemocional">Salud, Bienestar y Educación Socioemocional</option>
              <option value="Otro">Otro proyecto transversal (escribir)...</option>
            </select>
          </div>

          {ejeTransversal === 'Otro' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#166534' }}>
                Escribe el nombre del proyecto transversal de tu colegio:
              </label>
              <input
                type="text"
                value={otroEjeTransversal}
                onChange={(e) => setOtroEjeTransversal(e.target.value)}
                required
                placeholder="Ej.: Cátedra de Paz"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(22, 163, 74, 0.35)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  fontSize: '13px',
                  color: '#142B25',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', marginTop: '12px', paddingTop: '14px', borderTop: '1px solid rgba(49, 91, 84, 0.12)' }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#576864',
                fontSize: '13px',
                cursor: 'pointer',
                fontWeight: 600,
                padding: '8px 14px'
              }}
            >
              Omitir por ahora
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                fontSize: '13.5px',
                borderRadius: '12px'
              }}
            >
              <CheckCircle2 size={16} />
              <span>{saving ? 'Calibrando...' : 'Calibrar mi ADN Pedagógico'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
