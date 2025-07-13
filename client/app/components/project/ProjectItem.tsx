import React, { useState } from 'react';
import { HomeItemProps } from '../../home/Home';
import ProjectModal from './ProjectModal';
import { IProject } from './projects';

export interface ProjecItemtProps {
    project: IProject
}

export const ProjectItem: React.FC<ProjecItemtProps> = (props) => {

    const project = props.project;

    const [isVisible, setVisible] = useState(false);

    const handleClick = () => {
        setVisible(true);
    }

    let imageUrl = project.image;
    if(!imageUrl.includes("http"))
    {
        imageUrl = "\\assets\\projectThumbs\\" + project.image;
    }

    return <>
        <div
            onClick={handleClick}
            className="home_item"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                padding: '1rem',
            }}
        >

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ margin: 0 }}>{project.name}</h4>
                <p style={{ margin: 0, color: '#666' }}>{project.description}</p>
            </div>

            {/* LADO DIREITO: imagem */}
            <img
                src={imageUrl}
                alt="imagem"
                style={{
                width: 'auto',
                height: '130px',
                borderRadius: '8px',
                objectFit: 'cover',
                }}
            />
        </div>
        <ProjectModal
            visible={isVisible}
            project={project}
            onClose={function () {
                setVisible(false);
            } }
        />
    </>
}