import React from 'react';
import { GTAModType, HomepageItemCategory } from '../../home/HomepageItem';
import { ListItemGroup } from '../../components/list/ListItemGroup';
import { ListItemModal } from '../../components/list/ListItemModal';
import { tutorialItems } from './tutorialItems';

function Tutorials() {

    const items = tutorialItems.filter(item => {
        if(item.hidden) return false;

        return true;
    })
    
    return (
        <>
            <div className="container mt-4">
                
                <div className="back">
                    <a href="/gtasa">Back</a>
                </div>

                <ListItemGroup title="Tutorials">
                    {items.map((item, index) => {
                        let pageUrl = item.pageUrl;

                        if(!pageUrl) pageUrl = `https://www.youtube.com/watch?v=${item.videoPreviewId}`;

                        if(!pageUrl) pageUrl = item.githubUrl;

                        if(!pageUrl) pageUrl = item.pageUrl;

                        return (<ListItemModal selectable={true} item={item}></ListItemModal>);

                        //return (<ListItem key={index} href={pageUrl} title={item.title} image={item.image} description={item.shortDescription}></ListItem>);
                    })}
                </ListItemGroup>
            </div>
        </>
    );
}

export default Tutorials;