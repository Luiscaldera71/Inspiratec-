import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Star, 
  MessageSquare, 
  Send, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  Trash2, 
  GraduationCap, 
  BookOpen, 
  User, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { addCalificacionPlan, deleteCalificacionPlan, getCalificacionesPlan } from '../services/dbService';

export default function CalificacionExperienciaModal({
  isOpen,
  onClose,
  plan,
  currentUser,
  onCalificacionActualizada
}) {
  const [estrellas, setEstrellas] = useState(5);
  const [hoverEstrellas, setHoverEstrellas] = useState(0);
  const [comentario, setComentario] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [listaCalificaciones, setListaCalificaciones] = useState([]);

  // Cargar calificaciones iniciales del plan
  useEffect(() => {
    if (!plan) return;
    const iniciales = getCalificacionesPlan(plan.id, plan);
    setListaCalificaciones(iniciales);
    
    // Si el usuario actual ya había calificado, pre-cargamos sus datos
    const miCalificacion = iniciales.find(c => c.usuarioId === (currentUser?.uid || 'anon') && c.usuarioId !== 'anon');
    if (miCalificacion) {
      setEstrellas(miCalificacion.estrellas || 5);
      setComentario(miCalificacion.comentario || '');
    } else {
      setEstrellas(5);
      setComentario('');
    }
  }, [plan, currentUser]);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Estadísticas de calificación
  const stats = useMemo(() => {
    if (!listaCalificaciones || listaCalificaciones.length === 0) {
      return { promedio: 0, total: 0, desglose: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }
    const total = listaCalificaciones.length;
    const sum = listaCalificaciones.reduce((acc, curr) => acc + (Number(curr.estrellas) || 0), 0);
    const promedio = Number((sum / total).toFixed(1));
    const desglose = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    listaCalificaciones.forEach(c => {
      const e = Math.min(5, Math.max(1, Math.round(Number(c.estrellas) || 5)));
      desglose[e] = (desglose[e] || 0) + 1;
    });
    return { promedio, total, desglose };
  }, [listaCalificaciones]);

  const getTextoNivel = (num) => {
    switch (num) {
      case 1: return '⚠️ Difícil aplicación o muchas barreras de aula';
      case 2: return '⚙️ Requiere adaptaciones curriculares considerables';
      case 3: return '📘 Buena base conceptual y metodológica';
      case 4: return '✨ Muy efectiva, motivadora y dinámica en el aula';
      case 5: return '🏆 ¡Excelente transposición didáctica y resultados de aprendizaje!';
      default: return 'Selecciona una puntuación';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!plan || !plan.id) return;

    setIsSubmitting(true);
    setFeedbackMsg(null);

    const usuarioId = currentUser?.uid || 'anon';
    const usuarioNombre = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Docente Colega';

    try {
      const actualizadas = await addCalificacionPlan(plan.id, {
        usuarioId,
        usuarioNombre,
        estrellas,
        comentario: comentario.trim()
      });

      setListaCalificaciones(actualizadas);
      setFeedbackMsg({ type: 'success', text: '¡Tu valoración y experiencia han sido publicadas con éxito!' });
      
      if (onCalificacionActualizada) {
        onCalificacionActualizada(plan.id, actualizadas);
      }

      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err) {
      console.error('Error al guardar calificación:', err);
      setFeedbackMsg({ type: 'error', text: 'Ocurrió un error al guardar la valoración. Inténtalo de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (calificacionId) => {
    if (!plan || !plan.id) return;
    setIsDeletingId(calificacionId);
    try {
      const restantes = await deleteCalificacionPlan(plan.id, calificacionId);
      setListaCalificaciones(restantes);
      if (onCalificacionActualizada) {
        onCalificacionActualizada(plan.id, restantes);
      }
    } catch (err) {
      console.error('Error al eliminar calificación:', err);
    } finally {
      setIsDeletingId(null);
    }
  };

  if (!isOpen || !plan) return null;

  return createPortal(
    <AnimatePresence>
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}
      >
        {/* Backdrop de cristal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(16, 36, 32, 0.55)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        />

        {/* Modal Contenedor */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            boxShadow: '0 25px 60px -15px rgba(16, 36, 32, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            overflow: 'hidden'
          }}
        >
          {/* Cabecera del Modal */}
          <div 
            style={{
              padding: '20px 26px',
              borderBottom: '1px solid rgba(49, 91, 84, 0.12)',
              backgroundColor: 'rgba(240, 246, 243, 0.85)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '16px'
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#2B524A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                <Sparkles size={13} color="#D4AF37" />
                <span>Valoración de Práctica Docente</span>
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#142B25', margin: '0 0 6px 0', fontFamily: 'var(--font-heading)', lineHeight: '1.3' }}>
                {plan.tema || plan.metadata?.tema || 'Experiencia Pedagógica'}
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12.5px', color: '#477A72' }}>
                {plan.materia && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <BookOpen size={13} /> {plan.materia}
                  </span>
                )}
                {plan.grado && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <GraduationCap size={13} /> {plan.grado}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={13} /> Por: {plan.metadata?.autor || 'Docente'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(71, 122, 114, 0.2)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#477A72',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                flexShrink: 0
              }}
              aria-label="Cerrar modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cuerpo del Modal con Scroll */}
          <div style={{ padding: '22px 26px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Tarjeta de Resumen Estadístico */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderRadius: '16px',
                backgroundColor: 'rgba(49, 91, 84, 0.05)',
                border: '1px solid rgba(49, 91, 84, 0.14)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '32px', fontWeight: 800, color: '#142B25', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>
                    {stats.promedio > 0 ? stats.promedio : '—'}
                  </span>
                  <span style={{ fontSize: '11px', display: 'block', color: '#718096', fontWeight: 600, marginTop: '2px' }}>
                    de 5.0
                  </span>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '3px' }}>
                    {[1, 2, 3, 4, 5].map(starIndex => (
                      <Star
                        key={starIndex}
                        size={17}
                        fill={starIndex <= Math.round(stats.promedio) ? '#F59E0B' : 'none'}
                        color={starIndex <= Math.round(stats.promedio) ? '#F59E0B' : '#CBD5E1'}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '12px', color: '#477A72', fontWeight: 600 }}>
                    {stats.total > 0 
                      ? `${stats.total} ${stats.total === 1 ? 'docente ha valorado' : 'docentes han valorado'} esta experiencia`
                      : 'Aún no hay valoraciones registradas'}
                  </span>
                </div>
              </div>

              {stats.total > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: '120px' }}>
                  {[5, 4, 3, 2, 1].map(stars => {
                    const count = stats.desglose[stars] || 0;
                    const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                    return (
                      <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10.5px', color: '#718096' }}>
                        <span style={{ width: '12px', textAlign: 'right' }}>{stars}★</span>
                        <div style={{ flex: 1, height: '4px', backgroundColor: 'rgba(71, 122, 114, 0.15)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#F59E0B', borderRadius: '2px' }} />
                        </div>
                        <span style={{ width: '14px' }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Formulario de Calificación y Comentarios */}
            <form 
              onSubmit={handleSubmit}
              style={{
                padding: '18px 20px',
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(49, 91, 84, 0.18)',
                boxShadow: '0 4px 14px rgba(20, 42, 38, 0.05)'
              }}
            >
              <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#142B25', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={15} color="#D97706" />
                <span>¿Has aplicado este plan o deseas evaluarlo pedagógicamente?</span>
              </h3>

              {/* Selector Interactivo de Estrellas */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#477A72', marginBottom: '6px' }}>
                  Calificación de aplicabilidad y transposición didáctica:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map(num => {
                      const activa = (hoverEstrellas || estrellas) >= num;
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setEstrellas(num)}
                          onMouseEnter={() => setHoverEstrellas(num)}
                          onMouseLeave={() => setHoverEstrellas(0)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '3px',
                            cursor: 'pointer',
                            transform: activa ? 'scale(1.12)' : 'scale(1)',
                            transition: 'all 0.12s ease'
                          }}
                          aria-label={`Calificar con ${num} estrellas`}
                        >
                          <Star
                            size={24}
                            fill={activa ? '#F59E0B' : 'none'}
                            color={activa ? '#F59E0B' : '#CBD5E1'}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#D97706', marginLeft: '6px' }}>
                    {getTextoNivel(hoverEstrellas || estrellas)}
                  </span>
                </div>
              </div>

              {/* Textarea de Retroalimentación de Aula */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#477A72', marginBottom: '6px' }}>
                  Tu experiencia en el aula y recomendaciones pedagógicas:
                </label>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="¿Cómo te fue?"
                  rows={3}
                  maxLength={600}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    borderRadius: '12px',
                    border: '1px solid rgba(71, 122, 114, 0.28)',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    color: '#142B25',
                    backgroundColor: '#FFFFFF',
                    transition: 'border-color 0.15s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#315B54'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(71, 122, 114, 0.28)'}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '11px', color: '#A0AEC0', marginTop: '2px' }}>
                  {comentario.length}/600 caracteres
                </div>
              </div>

              {/* Alerta de Feedback */}
              {feedbackMsg && (
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontSize: '12.5px',
                    marginBottom: '12px',
                    backgroundColor: feedbackMsg.type === 'success' ? '#DEF7EC' : '#FDE8E8',
                    color: feedbackMsg.type === 'success' ? '#03543F' : '#9B1C1C'
                  }}
                >
                  {feedbackMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>{feedbackMsg.text}</span>
                </div>
              )}

              {/* Botón de Envío */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{
                    padding: '8px 18px',
                    fontSize: '13px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderRadius: '10px'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="spin" />
                      <span>Guardando valoración...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Publicar valoración y experiencia</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Listado de Comentarios y Experiencias de Otros Docentes */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#142B25', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MessageSquare size={16} color="#315B54" />
                  <span>Comentarios y Vivencias de Aula ({listaCalificaciones.length})</span>
                </h3>
              </div>

              {listaCalificaciones.length === 0 ? (
                <div 
                  style={{
                    textAlign: 'center',
                    padding: '30px 20px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(240, 246, 243, 0.6)',
                    border: '1px dashed rgba(71, 122, 114, 0.3)'
                  }}
                >
                  <MessageSquare size={28} style={{ color: '#477A72', margin: '0 auto 8px auto', opacity: 0.7 }} />
                  <p style={{ margin: '0 0 4px 0', fontSize: '13.5px', fontWeight: 600, color: '#142B25' }}>
                    Aún no hay comentarios sobre este plan
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#718096' }}>
                    Sé el primer docente en calificar y compartir tus observaciones pedagógicas.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {listaCalificaciones.map((cal) => {
                    const isMyComment = cal.usuarioId === (currentUser?.uid || 'anon') && cal.usuarioId !== 'anon';
                    const fechaTxt = cal.fecha ? new Date(cal.fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Reciente';

                    return (
                      <div 
                        key={cal.id}
                        style={{
                          padding: '14px 16px',
                          borderRadius: '14px',
                          backgroundColor: isMyComment ? 'rgba(240, 246, 243, 0.9)' : '#FAFCFA',
                          border: isMyComment ? '1px solid rgba(49, 91, 84, 0.25)' : '1px solid rgba(71, 122, 114, 0.15)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div 
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: isMyComment ? '#183630' : '#477A72',
                                color: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '11px',
                                fontWeight: 700
                              }}
                            >
                              {(cal.usuarioNombre || 'D').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span style={{ fontSize: '13px', fontWeight: 700, color: '#142B25' }}>
                                {cal.usuarioNombre}
                              </span>
                              {isMyComment && (
                                <span style={{ marginLeft: '6px', fontSize: '10px', padding: '1px 6px', borderRadius: '10px', backgroundColor: 'rgba(49, 91, 84, 0.15)', color: '#183630', fontWeight: 700 }}>
                                  Tú
                                </span>
                              )}
                              <span style={{ marginLeft: '8px', fontSize: '11px', color: '#A0AEC0' }}>
                                {fechaTxt}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ display: 'flex', gap: '2px' }}>
                              {[1, 2, 3, 4, 5].map(starIndex => (
                                <Star
                                  key={starIndex}
                                  size={13}
                                  fill={starIndex <= Number(cal.estrellas) ? '#F59E0B' : 'none'}
                                  color={starIndex <= Number(cal.estrellas) ? '#F59E0B' : '#CBD5E1'}
                                />
                              ))}
                            </div>

                            {isMyComment && (
                              <button
                                type="button"
                                onClick={() => handleDelete(cal.id)}
                                disabled={isDeletingId === cal.id}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#E53E3E',
                                  padding: '2px 4px',
                                  cursor: 'pointer',
                                  borderRadius: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '2px',
                                  fontSize: '11px'
                                }}
                                title="Eliminar mi valoración"
                              >
                                {isDeletingId === cal.id ? <Loader2 size={12} className="spin" /> : <Trash2 size={12} />}
                              </button>
                            )}
                          </div>
                        </div>

                        {cal.comentario ? (
                          <p style={{ margin: '6px 0 0 0', fontSize: '12.5px', color: '#2D3748', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                            {cal.comentario}
                          </p>
                        ) : (
                          <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', fontStyle: 'italic', color: '#A0AEC0' }}>
                            (Sin comentario de aula, solo calificación por estrellas)
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Pie del modal */}
          <div 
            style={{
              padding: '14px 26px',
              borderTop: '1px solid rgba(49, 91, 84, 0.1)',
              backgroundColor: 'rgba(250, 252, 251, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}
          >
            <button
              type="button"
              className="btn btn-primary"
              onClick={onClose}
              style={{ padding: '7px 20px', fontSize: '13px', borderRadius: '10px' }}
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
