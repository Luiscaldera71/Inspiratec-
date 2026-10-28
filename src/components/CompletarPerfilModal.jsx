import React, { useEffect, useState } from 'react';
import { User, Building2, GraduationCap, ArrowRight, Loader2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { updateUserPedagogicalProfile } from '../services/authService';
import '../styles/auth.css';
import '../styles/profile-modal.css';

const METODOLOGIAS = [
  'Aprendizaje Basado en Proyectos (ABP)',
  'Enfoque STEAM Interdisciplinario',
  'Aprendizaje Cooperativo y Socrático',
  'Aula Invertida (Flipped Classroom)',
  'Enseñanza para la Comprensión (EpC)',
  'Socioformativo o por Competencias',
  'Constructivismo y Aprendizaje Significativo',
  'Escuela Nueva / Metodologías Activas'
];

const esVacio = (v) => !v || !String(v).trim();

/**
 * Pide al docente los datos de registro que no se pudieron obtener de su cuenta
 * (típicamente al entrar con Google): nombre, institución, nivel y metodología.
 * Se muestra solo si falta alguno y se cierra al guardarlos.
 */
export default function CompletarPerfilModal() {
  const { userId, userProfile, setUserProfile } = useAppStore();

  const nombreInicial = userProfile?.nombre && userProfile.nombre !== 'Docente' ? userProfile.nombre : '';
  const [form, setForm] = useState({
    nombre: nombreInicial,
    institucion: userProfile?.institucion || '',
    nivel: userProfile?.nivel || '',
    metodologiaInstitucional: userProfile?.metodologiaInstitucional || METODOLOGIAS[0],
    otraMetodologia: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [bienvenidaActiva, setBienvenidaActiva] = useState(false);

  const faltaPerfil = Boolean(
    userId && userProfile && (esVacio(userProfile.nombre) || userProfile.nombre === 'Docente' || esVacio(userProfile.institucion) || esVacio(userProfile.nivel))
  );

  // Si el perfil llega después (carga asíncrona), precarga el nombre de Google
  useEffect(() => {
    if (!userProfile) return;
    setForm((prev) => ({
      ...prev,
      nombre: prev.nombre || (userProfile.nombre && userProfile.nombre !== 'Docente' ? userProfile.nombre : ''),
      institucion: prev.institucion || userProfile.institucion || '',
      nivel: prev.nivel || userProfile.nivel || ''
    }));
  }, [userProfile]);

  // Espera a que termine la bienvenida narrativa antes de pedir los datos
  useEffect(() => {
    if (!faltaPerfil) return undefined;
    const revisar = () => setBienvenidaActiva(Boolean(document.querySelector('.mini-tour-layer')));
    revisar();
    const id = setInterval(revisar, 700);
    return () => clearInterval(id);
  }, [faltaPerfil]);

  if (!faltaPerfil || bienvenidaActiva) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const nombre = form.nombre.trim();
    const institucion = form.institucion.trim();
    if (!nombre || !institucion || !form.nivel) {
      setError('Completa tu nombre, institución y nivel para continuar.');
      return;
    }
    const metodologia = form.metodologiaInstitucional === 'Otra'
      ? (form.otraMetodologia || 'Aprendizaje Activo Personalizado').trim()
      : form.metodologiaInstitucional;

    const datos = { nombre, institucion, nivel: form.nivel, metodologiaInstitucional: metodologia };
    setSaving(true);
    try {
      const ok = await updateUserPedagogicalProfile(userId, datos);
      if (!ok) throw new Error('No se pudo guardar tu perfil. Revisa tu conexión e inténtalo de nuevo.');
      setUserProfile({ ...userProfile, ...datos });
    } catch (err) {
      setError(err.message || 'No se pudo guardar tu perfil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="perfil-overlay" role="dialog" aria-modal="true" aria-labelledby="perfil-title">
      <form className="perfil-card" onSubmit={handleSubmit}>
        <div className="perfil-head">
          <img className="perfil-logo" src="/images/logo-inspiratec.png" alt="InspiraTEC" draggable={false} />
          <h2 id="perfil-title">¡Bienvenido/a{form.nombre ? `, ${form.nombre.split(' ')[0]}` : ''}!</h2>
          <p>Completa tu perfil docente para personalizar tus planes de clase. Solo te tomará un minuto.</p>
        </div>

        {error && <div className="auth-error" role="alert">{error}</div>}

        <div className="auth-form">
          <label className="auth-field">
            <span className="auth-label">Nombre completo</span>
            <span className="auth-input-wrap">
              <User size={18} className="auth-input-icon" />
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Ej. Profe María Pérez" autoComplete="name" />
            </span>
          </label>

          <label className="auth-field">
            <span className="auth-label">Institución educativa</span>
            <span className="auth-input-wrap">
              <Building2 size={18} className="auth-input-icon" />
              <input type="text" name="institucion" value={form.institucion} onChange={handleChange} required placeholder="Nombre de tu colegio" autoComplete="organization" />
            </span>
          </label>

          <label className="auth-field">
            <span className="auth-label">Nivel en el que enseñas</span>
            <span className="auth-input-wrap">
              <GraduationCap size={18} className="auth-input-icon" />
              <select name="nivel" value={form.nivel} onChange={handleChange} required>
                <option value="">Selecciona…</option>
                <option value="Primaria">Primaria</option>
                <option value="Secundaria">Secundaria</option>
                <option value="Media">Media</option>
              </select>
            </span>
          </label>

          <label className="auth-field">
            <span className="auth-label">Metodología o enfoque institucional</span>
            <span className="auth-input-wrap auth-select-wrap">
              <select name="metodologiaInstitucional" value={form.metodologiaInstitucional} onChange={handleChange} required>
                {METODOLOGIAS.map((m) => <option key={m} value={m}>{m}</option>)}
                <option value="Otra">Otra metodología (especificar)…</option>
              </select>
            </span>
          </label>

          {form.metodologiaInstitucional === 'Otra' && (
            <label className="auth-field">
              <span className="auth-label">Escribe la metodología de tu colegio</span>
              <span className="auth-input-wrap auth-select-wrap">
                <input type="text" name="otraMetodologia" value={form.otraMetodologia} onChange={handleChange} required placeholder="Ej.: Pedagogía dialogante" />
              </span>
            </label>
          )}

          <button type="submit" className="auth-submit" disabled={saving}>
            <span>{saving ? 'Guardando…' : 'Guardar y continuar'}</span>
            <span className="auth-submit-icon">
              {saving ? <Loader2 size={18} className="auth-spin" /> : <ArrowRight size={18} />}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
