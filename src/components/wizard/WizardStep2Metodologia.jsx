import React from 'react';
import { Compass, Sparkles, Loader2, AlertCircle } from 'lucide-react';

export default function WizardStep2Metodologia({
  wizardData,
  handleChange,
  isSuggestingObj = false,
  handleSuggestObjectives,
  suggestionError = null
}) {
  return (
    <div>
      <div className="wizard-group">
        <div className="wizard-group-title">
          <Compass size={16} /> Metodología de Enseñanza
        </div>
        <div className="input-group" style={{ margin: 0 }}>
          <label htmlFor="wizard-metodologia">Metodología</label>
          <select 
            id="wizard-metodologia"
            name="metodologiaSTEAM" 
            value={wizardData.metodologiaSTEAM} 
            onChange={handleChange}
          >
            <option value="">Seleccionar</option>
            <option value="Clase magistral">Clase magistral</option>
            <option value="Aprendizaje activo">Aprendizaje activo</option>
            <option value="Aprendizaje práctico">Aprendizaje práctico</option>
            <option value="Aprendizaje social y emocional">Aprendizaje social y emocional</option>
            <option value="DUA: Diseño Universal para el Aprendizaje">DUA: Diseño Universal para el Aprendizaje</option>
            <option value="Aprendizaje Basado en Casos">Aprendizaje Basado en Casos</option>
            <option value="Aprendizaje Basado en Indagación">Aprendizaje Basado en Indagación</option>
            <option value="Aprendizaje Basado en Investigación">Aprendizaje Basado en Investigación</option>
            <option value="Aprendizaje Basado en Problemas (ABP)">Aprendizaje Basado en Problemas (ABP)</option>
            <option value="Aprendizaje Basado en Proyectos (ABPro)">Aprendizaje Basado en Proyectos (ABPro)</option>
            <option value="Aprendizaje Basado en Retos">Aprendizaje Basado en Retos</option>
            <option value="Aprendizaje Colaborativo">Aprendizaje Colaborativo</option>
            <option value="Aprendizaje Invertido (Flipped Learning)">Aprendizaje Invertido (Flipped Learning)</option>
            <option value="Design Thinking">Design Thinking</option>
            <option value="Gamificación">Gamificación</option>
            <option value="Aprendizaje Servicio">Aprendizaje Servicio</option>
            <option value="Microlearning">Microlearning</option>
            <option value="STEAM">STEAM</option>
            <option value="Pensamiento Computacional">Pensamiento Computacional</option>
            <option value="Otra (describir en objetivos/contenido)">Otra (describir en objetivos/contenido)</option>
          </select>
        </div>
      </div>

      <div className="wizard-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div className="wizard-group-title" style={{ margin: 0 }}>
            <Sparkles size={16} /> Objetivos de Aprendizaje
          </div>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handleSuggestObjectives} 
            disabled={isSuggestingObj || !wizardData.metodologiaSTEAM} 
            style={{ padding: '6px 14px', minHeight: '36px', fontSize: '13px', borderRadius: '20px' }} 
            title={!wizardData.metodologiaSTEAM ? 'Debes seleccionar una metodología primero' : 'Sugerir objetivos pedagógicos con IA'}
          >
            {isSuggestingObj ? <Loader2 size={16} className="spin" /> : <Sparkles size={15} color="var(--primary-active)" />} 
            <span>{isSuggestingObj ? 'Generando...' : 'Sugerir con IA'}</span>
          </button>
        </div>

        {suggestionError && (
          <div className="field-error-message" role="alert" style={{ marginBottom: '10px' }}>
            <AlertCircle size={14} /> {suggestionError}
          </div>
        )}

        <div className="input-group" style={{ margin: 0 }}>
          <label htmlFor="wizard-objetivos">Objetivos</label>
          <textarea 
            id="wizard-objetivos"
            name="objetivos" 
            value={wizardData.objetivos} 
            onChange={handleChange} 
            placeholder="Ej.: Comprender el concepto de variable" 
            style={{ minHeight: '120px' }}
          />
        </div>
      </div>
    </div>
  );
}
