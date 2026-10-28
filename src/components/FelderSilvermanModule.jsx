import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { updateUserProfile } from '../services/authService';
import { 
  FELDER_PREGUNTAS, 
  FELDER_DIMENSIONES, 
  FELDER_META, 
  calcularResultadosFelder 
} from '../utils/felderSilvermanData';
import FelderSilvermanRadar from './FelderSilvermanRadar';
import { 
  Compass, 
  CheckCircle, 
  RotateCcw, 
  Save, 
  Info, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  AlertTriangle,
  Lightbulb,
  Edit3
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function FelderSilvermanModule() {
  const { userId, userProfile, setUserProfile } = useAppStore();

  // Cargar estado inicial persistido previamente (si existe)
  const savedProfileData = userProfile?.felderSilverman || (() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const local = localStorage.getItem('inspiratec_felder_silverman');
        return local ? JSON.parse(local) : null;
      } catch {
        return null;
      }
    }
    return null;
  })();

  // Estado local del cuestionario (NO se guarda automáticamente en backend)
  const [respuestas, setRespuestas] = useState(() => savedProfileData?.respuestas || {});
  const [modoEdicion, setModoEdicion] = useState(!savedProfileData);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error
  const [statusMessage, setStatusMessage] = useState('');

  // Detectar si hay cambios no guardados respecto a la versión persistida
  const hayCambiosSinGuardar = Boolean(
    savedProfileData && 
    JSON.stringify(respuestas) !== JSON.stringify(savedProfileData.respuestas || {})
  );

  // Calcular resultados en tiempo real sobre las respuestas locales
  const diagnosticoActual = calcularResultadosFelder(respuestas);
  const contestadas = diagnosticoActual.contestadas;
  const esCompleto = diagnosticoActual.esCompleto;

  // Manejar selección de opción (sin autoguardado en base de datos)
  const handleSeleccionarOpcion = (preguntaId, poloId) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: poloId
    }));
    setSaveStatus('idle');
  };

  // Guardado voluntario explícito por parte del docente
  const handleGuardarVoluntario = async () => {
    if (!esCompleto) {
      setStatusMessage('Por favor completa las 8 preguntas antes de guardar tus resultados.');
      setSaveStatus('error');
      return;
    }

    setSaveStatus('saving');
    setStatusMessage('');

    const payloadToSave = {
      respuestas,
      diagnostico: diagnosticoActual,
      actualizadoEl: new Date().toISOString(),
      versionInstrumento: FELDER_META.version
    };

    try {
      // 1. Guardar en almacenamiento local como respaldo seguro
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('inspiratec_felder_silverman', JSON.stringify(payloadToSave));
      }

      // 2. Persistir en Firestore si el docente tiene sesión activa
      if (userId) {
        await updateUserProfile(userId, { felderSilverman: payloadToSave });
      }

      // 3. Actualizar estado global en Zustand
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          felderSilverman: payloadToSave
        });
      }

      setSaveStatus('saved');
      setStatusMessage('¡Tus resultados han sido guardados voluntariamente en tu perfil docente!');
      setModoEdicion(false);
    } catch (err) {
      console.error('Error al guardar autodiagnóstico Felder-Silverman:', err);
      setSaveStatus('error');
      setStatusMessage('Ocurrió un error al guardar en la nube, pero se conservó localmente.');
    }
  };

  // Descartar cambios locales y volver a lo guardado
  const handleDescartarCambios = () => {
    if (savedProfileData?.respuestas) {
      setRespuestas(savedProfileData.respuestas);
      setModoEdicion(false);
      setSaveStatus('idle');
    }
  };

  // Restablecer cuestionario para comenzar desde cero
  const handleReiniciarCuestionario = () => {
    if (window.confirm('¿Deseas reiniciar todas las respuestas del cuestionario?')) {
      setRespuestas({});
      setModoEdicion(true);
      setSaveStatus('idle');
      setStatusMessage('');
    }
  };

  return (
    <div className="fs-module-container" style={{ display: 'flex', flexDirection: 'column', gap: '22px', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      
      {/* 1. Panel de Rigor Académico y Advertencia Metodológica */}
      <section 
        className="mgmt-card fs-module-card fs-rigor-card" 
        style={{
          boxSizing: 'border-box',
          width: '100%',
          maxWidth: '100%'
        }}
        aria-labelledby="fs-metodologia-title"
      >
        <div className="fs-card-header-row" style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', width: '100%', boxSizing: 'border-box' }}>
          <div 
            style={{ 
              backgroundColor: 'rgba(71, 122, 114, 0.14)', 
              color: '#183630', 
              borderRadius: '12px', 
              padding: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Info size={22} />
          </div>
          <div style={{ minWidth: 0, flex: 1, maxWidth: '100%', boxSizing: 'border-box' }}>
            <div className="editorial-badge" style={{ marginBottom: '6px' }}>
              <BookOpen size={13} color="#2B524A" />
              <span>Marco Teórico & Rigor Científico</span>
            </div>
            <h2 id="fs-metodologia-title" style={{ fontSize: '18px', fontFamily: 'var(--font-heading)', color: '#142B25', margin: '0 0 8px 0', fontWeight: 700, wordBreak: 'break-word' }}>
              Prototipo Exploratorio de Autorreflexión Docente
            </h2>
            <p style={{ fontSize: '14px', color: '#2B453E', lineHeight: '1.6', margin: '0 0 10px 0', wordBreak: 'break-word' }}>
              Este cuestionario de <strong>8 reactivos</strong> ha sido estructurado a partir del modelo de 4 dimensiones continuas de <em>Felder & Silverman (1988)</em>. 
              <strong> Importante:</strong> El instrumento psicométrico formal y validado internacionalmente es el <em>Index of Learning Styles (ILS)</em> de 44 reactivos (Felder & Soloman, 1997).
            </p>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.70)', borderLeft: '3px solid #315B54', padding: '10px 14px', borderRadius: '4px 10px 10px 4px', fontSize: '13px', color: '#1E3B33', lineHeight: '1.5', wordBreak: 'break-word', boxSizing: 'border-box' }}>
              <strong>Principio de no etiquetado:</strong> Los resultados no representan etiquetas rígidas ni limitaciones cognitivas, sino <em>gradientes flexibles de preferencia didáctica</em> para orientar la diversificación de estrategias en concordancia con el Diseño Universal para el Aprendizaje (DUA).
            </div>
          </div>
        </div>
      </section>

      {/* 2. Barra de Estado / Modo de Visualización */}
      {savedProfileData && !modoEdicion && (
        <section 
          className="mgmt-card fs-module-card fs-status-card" 
          style={{
            backgroundColor: 'rgba(224, 237, 233, 0.70)',
            border: '1px solid rgba(49, 91, 84, 0.25)',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: '1 1 240px' }}>
            <CheckCircle size={22} style={{ color: '#166534', flexShrink: 0 }} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <strong style={{ fontSize: '15px', color: '#142B25', display: 'block', wordBreak: 'break-word' }}>
                Perfil Pedagógico Guardado en tu Cuenta
              </strong>
              <span style={{ fontSize: '13px', color: '#2B453E', wordBreak: 'break-word' }}>
                Última actualización: {savedProfileData.actualizadoEl ? new Date(savedProfileData.actualizadoEl).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Reciente'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setModoEdicion(true)}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px 18px', fontSize: '13.5px', boxSizing: 'border-box' }}
            >
              <Edit3 size={15} />
              <span>Modificar Respuestas</span>
            </button>
          </div>
        </section>
      )}

      {/* 3. Cuestionario de las 8 Preguntas (Visible en modo edición o cuando no hay respuestas guardadas) */}
      {modoEdicion && (
        <motion.section 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mgmt-card fs-module-card fs-cuestionario-card"
          style={{
            boxSizing: 'border-box',
            width: '100%',
            maxWidth: '100%'
          }}
          aria-labelledby="fs-cuestionario-title"
        >
          <div className="fs-cuestionario-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '22px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ minWidth: 0, flex: '1 1 240px' }}>
              <div className="editorial-badge" style={{ marginBottom: '6px' }}>
                <Compass size={13} color="#2B524A" />
                <span>Cuestionario Docente</span>
              </div>
              <h2 id="fs-cuestionario-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '21px', color: '#142B25', margin: 0, fontWeight: 700, wordBreak: 'break-word' }}>
                Exploración de Preferencias de Enseñanza y Aprendizaje
              </h2>
            </div>

            <div className="fs-progress-container" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E3B33' }}>
                Progreso: {contestadas} de 8 respondidas
              </span>
              <div style={{ width: '80px', height: '8px', backgroundColor: 'rgba(49, 91, 84, 0.16)', borderRadius: '999px', overflow: 'hidden', flexShrink: 0 }}>
                <div 
                  style={{ 
                    width: `${(contestadas / 8) * 100}%`, 
                    height: '100%', 
                    backgroundColor: '#315B54', 
                    borderRadius: '999px', 
                    transition: 'width 0.3s ease' 
                  }} 
                />
              </div>
            </div>
          </div>

          <p style={{ color: '#2B453E', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px', wordBreak: 'break-word' }}>
            Selecciona para cada situación la opción que mejor describa tu inclinación espontánea habitual. No existen respuestas correctas o incorrectas.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); handleGuardarVoluntario(); }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', boxSizing: 'border-box' }}>
              {FELDER_PREGUNTAS.map((pregunta, idx) => {
                const dimensionInfo = FELDER_DIMENSIONES[pregunta.dimension];
                const seleccionActual = respuestas[pregunta.id];

                return (
                  <fieldset 
                    key={pregunta.id}
                    className="fs-fieldset"
                    style={{
                      border: '1px solid rgba(49, 91, 84, 0.14)',
                      borderRadius: '16px',
                      padding: '18px 20px',
                      backgroundColor: seleccionActual ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.50)',
                      transition: 'border-color 0.2s ease, background-color 0.2s ease',
                      width: '100%',
                      boxSizing: 'border-box',
                      minWidth: 0
                    }}
                  >
                    <legend className="fs-legend" style={{ padding: '0 8px', fontSize: '11.5px', fontWeight: 700, color: '#315B54', textTransform: 'uppercase', letterSpacing: '0.04em', wordBreak: 'break-word', maxWidth: '100%' }}>
                      Reactivo {idx + 1} de 8 — Eje: {dimensionInfo?.nombre}
                    </legend>

                    <p style={{ fontSize: '14.5px', color: '#142B25', fontWeight: 600, margin: '6px 0 16px 0', lineHeight: '1.5', wordBreak: 'break-word' }}>
                      {pregunta.enunciado}
                    </p>

                    <div className="fs-options-grid" style={{ display: 'grid', gap: '12px', width: '100%', boxSizing: 'border-box' }}>
                      {pregunta.opciones.map((opcion) => {
                        const estaSeleccionada = seleccionActual === opcion.polo;

                        return (
                          <label
                            key={opcion.id}
                            className="fs-option-label"
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '12px',
                              padding: '12px 14px',
                              borderRadius: '12px',
                              border: estaSeleccionada ? '2px solid #315B54' : '1.5px solid rgba(49, 91, 84, 0.18)',
                              backgroundColor: estaSeleccionada ? 'rgba(224, 237, 233, 0.85)' : 'rgba(255, 255, 255, 0.90)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              boxShadow: estaSeleccionada ? '0 4px 12px rgba(49, 91, 84, 0.12)' : 'none',
                              boxSizing: 'border-box',
                              minWidth: 0,
                              wordBreak: 'break-word'
                            }}
                          >
                            <input
                              type="radio"
                              name={`pregunta_${pregunta.id}`}
                              value={opcion.polo}
                              checked={estaSeleccionada}
                              onChange={() => handleSeleccionarOpcion(pregunta.id, opcion.polo)}
                              style={{ marginTop: '3px', accentColor: '#315B54', cursor: 'pointer', flexShrink: 0 }}
                            />
                            <div style={{ fontSize: '13.5px', color: estaSeleccionada ? '#142B25' : '#2B453E', lineHeight: '1.45', fontWeight: estaSeleccionada ? 600 : 400, wordBreak: 'break-word', minWidth: 0 }}>
                              {opcion.texto}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                );
              })}
            </div>

            {/* Aviso de no autoguardado */}
            <div style={{ marginTop: '22px', padding: '12px 16px', backgroundColor: 'rgba(255, 251, 235, 0.85)', borderRadius: '12px', border: '1px solid rgba(217, 119, 6, 0.25)', display: 'flex', alignItems: 'center', gap: '10px', boxSizing: 'border-box', width: '100%' }}>
              <ShieldCheck size={18} style={{ color: '#D97706', flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: '#92400E', lineHeight: '1.4', wordBreak: 'break-word' }}>
                <strong>Privacidad y control docente:</strong> Tus respuestas no se guardan automáticamente ni se comparten. Se almacenarán únicamente cuando hagas clic en el botón inferior.
              </span>
            </div>

            {/* Botonera de acciones voluntarias */}
            <div className="fs-actions-bar" style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginTop: '22px', width: '100%', boxSizing: 'border-box' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!esCompleto || saveStatus === 'saving'}
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 22px', fontSize: '14px', boxSizing: 'border-box' }}
              >
                <Save size={16} />
                <span>{saveStatus === 'saving' ? 'Guardando perfil...' : 'Guardar Resultados en mi Perfil'}</span>
              </button>

              {hayCambiosSinGuardar && (
                <button
                  type="button"
                  onClick={handleDescartarCambios}
                  className="btn-outline"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px 18px', fontSize: '13px', boxSizing: 'border-box' }}
                >
                  <span>Descartar Cambios</span>
                </button>
              )}

              {savedProfileData && (
                <button
                  type="button"
                  onClick={() => setModoEdicion(false)}
                  className="btn-outline"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px 18px', fontSize: '13px', boxSizing: 'border-box' }}
                >
                  <span>Cerrar Edición</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleReiniciarCuestionario}
                className="btn-outline fs-restart-btn"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px 16px', fontSize: '13px', color: '#78350F', boxSizing: 'border-box' }}
                title="Limpiar todas las respuestas seleccionadas"
              >
                <RotateCcw size={14} />
                <span>Reiniciar Cuestionario</span>
              </button>
            </div>
          </form>

          {/* Mensajes de confirmación / error */}
          {statusMessage && (
            <div 
              style={{ 
                marginTop: '18px', 
                padding: '12px 16px', 
                backgroundColor: saveStatus === 'saved' ? 'rgba(220, 252, 231, 0.85)' : 'rgba(254, 226, 226, 0.85)',
                color: saveStatus === 'saved' ? '#166534' : '#991B1B',
                borderRadius: '12px',
                border: `1px solid ${saveStatus === 'saved' ? 'rgba(22, 163, 74, 0.35)' : 'rgba(220, 38, 38, 0.35)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '13.5px',
                wordBreak: 'break-word',
                boxSizing: 'border-box',
                width: '100%'
              }}
            >
              {saveStatus === 'saved' ? <CheckCircle size={18} style={{ flexShrink: 0 }} /> : <AlertTriangle size={18} style={{ flexShrink: 0 }} />}
              <span>{statusMessage}</span>
            </div>
          )}
        </motion.section>
      )}

      {/* 4. Visualización de Resultados: Gráfico Radial SVG y Gradientes DUA */}
      {(contestadas > 0 || savedProfileData) && (
        <section 
          className="mgmt-card fs-module-card fs-results-card" 
          style={{
            boxSizing: 'border-box',
            width: '100%',
            maxWidth: '100%'
          }}
          aria-labelledby="fs-resultados-title"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <Sparkles size={20} style={{ color: 'var(--primary-active)', flexShrink: 0 }} />
            <h2 id="fs-resultados-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '21px', color: '#142B25', margin: 0, fontWeight: 700, wordBreak: 'break-word' }}>
              Interpretación del Perfil y Gráfico Radial
            </h2>
          </div>
          <p style={{ color: '#2B453E', fontSize: '14px', lineHeight: '1.6', marginBottom: '22px', wordBreak: 'break-word' }}>
            Los resultados se proyectan en un espacio radial de 8 polos y 4 dimensiones continuas. Úsalos como una guía reflexiva para diversificar tus mediaciones pedagógicas.
          </p>

          <div className="fs-results-grid" style={{ display: 'grid', width: '100%', boxSizing: 'border-box' }}>
            
            {/* Columna Izquierda: Gráfico Radial SVG Accesible */}
            <div className="fs-radar-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
              <FelderSilvermanRadar dimensiones={diagnosticoActual.dimensiones} />
            </div>

            {/* Columna Derecha: Barras de Gradientes Continuos y Lectura DUA */}
            <div className="fs-gradients-col" style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
              {Object.values(diagnosticoActual.dimensiones).map((dim) => {
                const pctA = dim.poloA.porcentaje;
                const pctB = dim.poloB.porcentaje;

                return (
                  <div 
                    key={dim.id}
                    className="fs-dimension-card"
                    style={{
                      padding: '16px 18px',
                      backgroundColor: 'rgba(255, 255, 255, 0.80)',
                      borderRadius: '16px',
                      border: '1px solid rgba(49, 91, 84, 0.16)',
                      boxShadow: '0 2px 8px rgba(16, 36, 32, 0.04)',
                      width: '100%',
                      boxSizing: 'border-box',
                      minWidth: 0
                    }}
                  >
                    {/* Encabezado de la dimensión */}
                    <div className="fs-dimension-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px', width: '100%', boxSizing: 'border-box' }}>
                      <strong className="fs-dim-title" style={{ fontSize: '14px', color: '#142B25', wordBreak: 'break-word' }}>{dim.nombre}</strong>
                      <span className="fs-dim-score" style={{ fontSize: '12px', fontWeight: 700, color: '#315B54', wordBreak: 'break-word' }}>
                        {dim.poloA.nombre} ({pctA}%) vs {dim.poloB.nombre} ({pctB}%)
                      </span>
                    </div>

                    {/* Barra de gradiente continuo de polo a polo */}
                    <div 
                      className="fs-gradient-bar"
                      style={{ 
                        height: '10px', 
                        width: '100%', 
                        backgroundColor: 'rgba(49, 91, 84, 0.15)', 
                        borderRadius: '999px', 
                        display: 'flex', 
                        overflow: 'hidden',
                        position: 'relative',
                        marginBottom: '10px',
                        boxSizing: 'border-box'
                      }}
                      role="progressbar"
                      aria-label={`Gradiente continuo en ${dim.nombre}: ${pctA}% ${dim.poloA.nombre} contra ${pctB}% ${dim.poloB.nombre}`}
                      aria-valuenow={pctA}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div 
                        style={{ 
                          width: `${pctA}%`, 
                          height: '100%', 
                          backgroundColor: '#315B54', 
                          transition: 'width 0.4s ease' 
                        }} 
                      />
                      <div 
                        style={{ 
                          width: `${pctB}%`, 
                          height: '100%', 
                          backgroundColor: '#71A098', 
                          transition: 'width 0.4s ease' 
                        }} 
                      />
                    </div>

                    {/* Interpretación pedagógica flexible */}
                    <p className="fs-dim-desc" style={{ fontSize: '13px', color: '#2B453E', lineHeight: '1.45', margin: '0 0 8px 0', wordBreak: 'break-word' }}>
                      {dim.interpretacionGradiente}
                    </p>

                    {/* Sugerencia DUA de articulación */}
                    <div className="fs-dua-pill" style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12px', color: '#1E3B33', backgroundColor: 'rgba(224, 237, 233, 0.50)', padding: '6px 10px', borderRadius: '8px', wordBreak: 'break-word', boxSizing: 'border-box' }}>
                      <Lightbulb size={14} style={{ color: '#315B54', flexShrink: 0, marginTop: '2px' }} />
                      <span>
                        <strong>Sugerencia DUA:</strong> {pctA >= pctB ? dim.poloA.estrategiaDUA : dim.poloB.estrategiaDUA}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recordatorio de autonomía docente */}
          <div style={{ marginTop: '22px', paddingTop: '16px', borderTop: '1px solid rgba(49, 91, 84, 0.14)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', width: '100%', boxSizing: 'border-box' }}>
            <span style={{ fontSize: '12.5px', color: '#4A635B', wordBreak: 'break-word' }}>
              Este autodiagnóstico es un recurso consultivo para fortalecer tu criterio pedagógico. No altera la autonomía de tus planes de clase.
            </span>
          </div>
        </section>
      )}

    </div>
  );
}
