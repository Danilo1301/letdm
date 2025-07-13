import React, { useContext, useEffect, useState } from 'react';
import { projects as allProjects, ProjectType } from '../../components/project/projects';
import Divider from '../../components/Divider';
import { ProjectItem } from '../../components/project/ProjectItem';

const Mods: React.FC = () => {
    
    const projects = allProjects.filter(p => p.type.includes(ProjectType.GTASA_Mods_Mobile));
    
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

export default Mods;