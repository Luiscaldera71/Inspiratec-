import React, { useState } from 'react';
import { BookOpen, Sparkles, Loader2, AlertCircle, GitFork, X, Check } from 'lucide-react';
import CurricularGraphView from '../CurricularGraphView';
import { mapearGradoAGrupo } from '../../utils/curricularGraphData';

export default function WizardStep3Estandares({
  wizardData,
  updateWizardData,
  isSuggestingStd = false,
  handleSuggestStandards,
  suggestionError = null
}) {
  const [showGraphModal, setShowGraphModal] = useState(false);
  const [notifReferente, setNotifReferente] = useState('');

  const initialGradoGrupo = mapearGradoAGrupo(wizardData?.grado || '');

  // Manejar incorporación directa de una competencia desde el Grafo al Planificador
  const handleIncorporarReferente = (node) => {
    const textoReferente = `[${node.codigo}] ${node.titulo}: ${node.descripcion}`;
    
    const actual = Array.isArray(wizardData.estandaresMEN) 
      ? wizardData.estandaresMEN.join('\n') 
      : (wizardData.estandaresMEN || '');

    // Evitar duplicar si ya estaba
    if (actual.includes(node.codigo)) {
      setNotifReferente(`La competencia ${node.codigo} ya está presente en el plan.`);
      setTimeout(() => setNotifReferente(''), 3000);
      return;
    }

    const nuevoTexto = actual.trim() ? `${actual.trim()}\n\n• ${textoReferente}` : `• ${textoReferente}`;
    updateWizardData({ estandaresMEN: [nuevoTexto] });

    setNotifReferente(`¡Competencia ${node.codigo} incorporada con éxito al planificador!`);
    setTimeout(() => setNotifReferente(''), 3500);
  };

  return (
    <div>
      <div className="wizard-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div className="wizard-group-title" style={{ margin: 0 }}>
            <BookOpen size={16} /> Estándares y referentes
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Botón para abrir el Grafo Ontológico de Prerrequisitos */}
            <button
              type="button"
              className="btn-outline"
              onClick={() => setShowGraphModal(true)}
              style={{ 
                padding: '6px 14px', 
                minHeight: '36px', 
                fontSize: '13px', 
                borderRadius: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Abrir mapa conceptual y red de prerrequisitos de la Guía 30 del MEN"
            >
              <GitFork size={15} color="#315B54" />
              <span>Grafo de Prerrequisitos (MEN)</span>
            </button>

            {/* Asistente IA */}
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleSuggestStandards} 
              disabled={isSuggestingStd} 
              style={{ padding: '6px 14px', minHeight: '36px', fontSize: '13px', borderRadius: '20px' }}
            >
              {isSuggestingStd ? <Loader2 size={16} className="spin" /> : <Sparkles size={15} color="var(--primary-active)" />} 
              <span>{isSuggestingStd ? 'Consultando...' : 'Sugerir estándares'}</span>
            </button>
          </div>
        </div>

        {suggestionError && (
          <div className="field-error-message" role="alert" style={{ marginBottom: '10px' }}>
            <AlertCircle size={14} /> {suggestionError}
          </div>
        )}

        {/* Notificación de incorporación desde el grafo */}
        {notifReferente && (
          <div 
            style={{ 
              marginBottom: '12px', 
              padding: '10px 14px', 
              backgroundColor: 'rgba(220, 252, 231, 0.85)', 
              color: '#166534', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontSize: '13px',
              border: '1px solid rgba(22, 163, 74, 0.30)'
            }}
          >
            <Check size={16} />
            <span>{notifReferente}</span>
          </div>
        )}

        <div className="input-group" style={{ margin: 0 }}>
          <label htmlFor="wizard-estandares">Estándares, DBA o referentes</label>
          <textarea 
            id="wizard-estandares"
            name="estandaresMEN" 
            value={Array.isArray(wizardData.estandaresMEN) ? wizardData.estandaresMEN.join('\n') : (wizardData.estandaresMEN || '')} 
            onChange={(e) => updateWizardData({ estandaresMEN: [e.target.value] })} 
            placeholder="Ej.: Estructuras de control en programación por bloques"
            style={{ minHeight: '140px' }}
          />
        </div>
      </div>

      {/* Modal / Panel Flotante del Grafo Curricular */}
      {showGraphModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="graph-modal-title"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(16, 36, 32, 0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowGraphModal(false);
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(255, 254, 250, 0.98)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.90)',
              boxShadow: '0 20px 60px rgba(16, 36, 32, 0.25)',
              width: '100%',
              maxWidth: '1040px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {/* Cabecera del Modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div className="editorial-badge" style={{ marginBottom: '4px' }}>
                  <GitFork size={13} color="#2B524A" />
                  <span>Modelo Ontológico del Dominio (STI Caro 2015 / Guía 30 MEN)</span>
                </div>
                <h2 id="graph-modal-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', color: '#142B25', margin: 0, fontWeight: 700 }}>
                  Grafo de prerrequisitos
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowGraphModal(false)}
                className="btn-outline"
                style={{ padding: '8px', borderRadius: '12px' }}
                aria-label="Cerrar mapa curricular"
              >
                <X size={18} />
              </button>
            </div>


            {/* Componente del Grafo SVG */}
            <CurricularGraphView
              initialGradoGrupo={initialGradoGrupo}
              onSelectReferente={(node) => {
                handleIncorporarReferente(node);
                setShowGraphModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
