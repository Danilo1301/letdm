import React, { useContext, useEffect, useState } from 'react';
import { projects as allProjects, ProjectType } from '../components/project/projects';
import { ProjectItem } from '../components/project/ProjectItem';
import Divider from '../components/Divider';

const Projects: React.FC = () => {
    
    const projects = allProjects.filter(p => p.type.includes(ProjectType.Projects));
    
    return (
        <>
            <div className='container mt-2'>

                {projects.map((project, index) => {
                    return <div key={index}>
                        <ProjectItem
                            project={project}
                        />
                        <Divider></Divider>
                    </div>
                })}
            </div>
        </>
    );
}

export default Projects;