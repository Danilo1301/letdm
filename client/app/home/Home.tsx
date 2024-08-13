import React from 'react';
import { HomepageItemCardList } from './components/HomepageItemCardList';
import { HomepageItem, HomepageItemCategory } from './HomepageItem';

/*
<HomepageItemCardList title="Main Projects" category={HomepageItemCategory.PRINCIPAL}></HomepageItemCardList>
<HomepageItemCardList title="Games" category={HomepageItemCategory.GAMES}></HomepageItemCardList>
<HomepageItemCardList title="Projects" category={HomepageItemCategory.PROJECTS}></HomepageItemCardList>
<HomepageItemCardList title="GTA SA Mods" category={HomepageItemCategory.GTA_SA_MODS}></HomepageItemCardList>
<HomepageItemCardList title="Scratch" category={HomepageItemCategory.SCRATCH}></HomepageItemCardList>
*/

function Home() {

    return (
        <>
            <div className="container mt-4">
                <HomepageItemCardList title="Projects" category={HomepageItemCategory.MAIN_PROJECTS}></HomepageItemCardList>
            </div>
        </>
    );
}

export default Home;