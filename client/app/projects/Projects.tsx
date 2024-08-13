import React from 'react';
import { HomepageItemCardList } from '../home/components/HomepageItemCardList';
import { HomepageItemCategory } from '../home/HomepageItem';

function Projects() {

    return (
        <>
            <div className="container mt-4">
                
                <div className="back">
                    <a href="/">Back</a>
                </div>

                <HomepageItemCardList title="Main Projects" category={HomepageItemCategory.PRINCIPAL}></HomepageItemCardList>
                <HomepageItemCardList title="Games" category={HomepageItemCategory.GAMES}></HomepageItemCardList>
                <HomepageItemCardList title="Projects" category={HomepageItemCategory.PROJECTS}></HomepageItemCardList>
                <HomepageItemCardList title="GTA SA Mods" category={HomepageItemCategory.GTA_SA_MODS}></HomepageItemCardList>
                <HomepageItemCardList title="Scratch" category={HomepageItemCategory.SCRATCH}></HomepageItemCardList>
            </div>
        </>
    );
}

export default Projects;