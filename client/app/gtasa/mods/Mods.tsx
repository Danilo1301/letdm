import React from 'react';
import { homePageItems } from '../../home/homepageItems';
import { HomepageItemCategory } from '../../home/HomepageItem';
import { ListItemGroup } from '../../components/list/ListItemGroup';
import { ListItem } from '../../components/list/ListItem';

function Mods() {

    const items = homePageItems.filter(item => {
        if(item.hidden) return false;

        for(const category of item.categories)
        {
            if(category === HomepageItemCategory.GTA_SA_MODS) return true;
        }

        return false;
    })
    
    return (
        <>
            <div className="container mt-4">
                
                <div className="back">
                    <a href="/gtasa">Back</a>
                </div>

                <ListItemGroup title="GTA SA">
                    {items.map((item, index) => {
                        let pageUrl = item.pageUrl;

                        if(!pageUrl) pageUrl = `https://www.youtube.com/watch?v=${item.videoPreviewId}`;

                        if(!pageUrl) pageUrl = item.githubUrl;

                        if(!pageUrl) pageUrl = item.pageUrl;

                        return (<ListItem key={index} href={pageUrl} title={item.title} image={item.image} description={item.shortDescription}></ListItem>);
                    })}
                </ListItemGroup>
            </div>
        </>
    );
}

export default Mods;