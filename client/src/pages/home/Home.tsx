import React from 'react';
import { HomepageItemCardList } from './components/HomepageItemCardList';
import { HomepageItem, HomepageItemCategory } from './HomepageItem';

function Home() {

    const [homepageItem, setHomepageItem] = React.useState<HomepageItem>();

    return (
        <>
            <div className="container mt-4">
                <HomepageItemCardList title="Main Projects" category={HomepageItemCategory.PRINCIPAL}></HomepageItemCardList>
                <HomepageItemCardList title="Games" category={HomepageItemCategory.GAMES}></HomepageItemCardList>
                <HomepageItemCardList title="Projects" category={HomepageItemCategory.PROJECTS}></HomepageItemCardList>
                <HomepageItemCardList title="GTA SA Mods" category={HomepageItemCategory.GTA_SA_MODS}></HomepageItemCardList>
                <HomepageItemCardList title="Scratch" category={HomepageItemCategory.SCRATCH}></HomepageItemCardList>
            </div>

            <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Title={homepageItem?.title}</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        body
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Save changes</button>
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;