import React from 'react';
import { homePageItems } from '../../home/homepageItems';
import { GTAModType, HomepageItemCategory } from '../../home/HomepageItem';
import { ListItemGroup } from '../../components/list/ListItemGroup';
import { ListItem } from '../../components/list/ListItem';
import { ListItemModal } from '../../components/list/ListItemModal';

function ModsPC() {

    const items = homePageItems.filter(item => {
        if(item.hidden) return false;

        for(const category of item.categories)
        {
            if(category === HomepageItemCategory.GTA_SA_MODS)
            {
                if(item.gtaModType == GTAModType.PC || item.gtaModType == GTAModType.BOTH)
                {
                    return true;
                }
            }
        }

        return false;
    })
    
    return (
        <>
            <div className="container mt-4">
                
                <div className="back">
                    <a href="/gtasa">Back</a>
                </div>

                <ListItemGroup title="GTA SA - Mods PC">
                    {items.map((item, index) => {
                        let pageUrl = item.pageUrl;

                        if(!pageUrl) pageUrl = `https://www.youtube.com/watch?v=${item.videoPreviewId}`;

                        if(!pageUrl) pageUrl = item.githubUrl;

                        if(!pageUrl) pageUrl = item.pageUrl;

                        return (<ListItemModal selectable={true} item={item}></ListItemModal>);
                    })}
                </ListItemGroup>
            </div>
        </>
    );
}

export default ModsPC;