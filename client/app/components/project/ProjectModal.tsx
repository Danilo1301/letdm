import React from 'react';
import { IProject } from './projects';

interface ProjectModalProps {
    visible: boolean;
    project: IProject;
    onClose: () => void;
    onAction1?: () => void;
    onAction2?: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
    visible,
    project,
    onClose
}) => {

    const handleClose = () => {
      onClose();
    }

    const handleClickGithub = () => {
      location.href = project.githubUrl || "/";
    }

    //styles.overlay.display = visible ? "box" : "none";

    if(!visible) return <></>;

    return (
        <div className='custom-modal visible' style={styles.overlay}>
            <div style={styles.content}>
            {/* Botão de fechar */}
            <button style={styles.closeButton} onClick={handleClose}>×</button>

            {/* Título */}
            <h2 style={styles.title}>{project.name}</h2>

            {/* Descrição */}
            <p style={styles.description}>{project.description}</p>

            {/* Vídeo (iframe) */}
            <div style={styles.videoWrapper}>
              <iframe width="auto" height="315" src={"https://www.youtube.com/embed/" + project.videoId} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
            </div>

            {
              project.githubUrl != undefined ? 
              <>
                <div style={styles.actions}>
                  <button onClick={handleClickGithub}>Ver github</button>
                </div>
              </> :
              <>
              </>
            }
            
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
  },
  videoWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '315px', // ou qualquer altura que quiser
    marginBottom: '1rem',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem'
  }
};

export default ProjectModal;