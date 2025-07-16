import React from 'react';

interface BasicModalProps {
    visible: boolean;
    onClose?: () => void;
    onAction1?: () => void;
    onAction2?: () => void;
    children?: React.ReactNode; // <- adicionar isso
}

const BasicModal: React.FC<BasicModalProps> = ({
    visible,
    onClose,
    children
}) => {

    const handleClose = () => {
      onClose?.();
    }

    if(!visible) return <></>;

    return (
        <div className='custom-modal visible text-dark' style={styles.overlay}>
            <div style={styles.content}>
                {/* Botão de fechar */}
                <button style={styles.closeButton} onClick={handleClose}>×</button>

                {/* Título */}
                <h2 style={styles.title}>{"titulo"}</h2>

                {/* Descrição */}
                <p style={styles.description}>{"description"}</p>

                {children}
            </div>
        </div>
    );
};

// Estilos inline (você pode converter pra CSS depois)
const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '600px',
    padding: '10px',
    position: 'relative' as const,
    boxShadow: '0 10px 20px rgba(0,0,0,0.25)'
  },
  closeButton: {
    position: 'absolute' as const,
    top: '10px',
    right: '10px',
    fontSize: '1.5rem',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer'
  },
  title: {
    marginBottom: '0.5rem',
    color: 'black'
  },
  description: {
    marginBottom: '1rem',
    color: '#444'
  }
};

export default BasicModal;