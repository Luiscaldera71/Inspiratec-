import React from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[INSPIRATEC ErrorBoundary caught an error]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/home';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '520px',
            width: '100%',
            backgroundColor: 'rgba(255, 254, 250, 0.95)',
            border: '1px solid rgba(49, 91, 84, 0.2)',
            borderRadius: '20px',
            padding: '36px 28px',
            boxShadow: '0 12px 32px rgba(16, 36, 32, 0.12)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <AlertCircle size={30} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#142B25', marginBottom: '10px' }}>
              Ocurrió un error al cargar la vista
            </h2>
            <p style={{ fontSize: '14px', color: '#576864', lineHeight: 1.6, marginBottom: '24px' }}>
              {this.state.error?.message || 'Se produjo un problema inesperado al renderizar este módulo pedagógico.'}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => this.setState({ hasError: false, error: null })}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <RotateCcw size={16} /> Reintentar
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={this.handleReset}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Home size={16} /> Ir al Inicio
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
