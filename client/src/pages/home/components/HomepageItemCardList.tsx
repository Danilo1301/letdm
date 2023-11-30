import React from 'react'

import { HomepageItemCategory } from '../HomepageItem'
import { homePageItems } from '../homepageItems'
import { HomepageItemCard } from './HomepageItemCard'

interface IHomepageItemCardListProps
{
    title: string
    category: HomepageItemCategory
}

export const HomepageItemCardList: React.FC<IHomepageItemCardListProps> = (props) =>
{
    const items = homePageItems.filter(item => {
        if(item.hidden) return false;

        for(const category of item.categories)
        {
            if(category === props.category) return true;
        }

        return false;
    })

    return (
        <>
            <ul className="list-group" style={{marginBottom: 120}}>

                <div className="p-2" style={{background: "#938ee3"}}>
                    <h5 className="text-light mb-1">{props.title}</h5>
                    <small className="text-light">{items.length} projects</small>
                </div>

                {items.map((homepageItem, idx) => (
                    <li key={idx} className="list-group-item p-2">
                        <HomepageItemCard homepageItem={homepageItem}></HomepageItemCard>
                    </li>
                ))}

            </ul>
        </>
    )
}

/*
             <ListGroup className="my-2 mt-5">
                <ListGroup.Item style={{backgroundColor: '#73b2f6'}}><b>{props.title}</b></ListGroup.Item>
            </ListGroup>

            <Row xs={1} md={3} className="g-4">
                {items.map((homepageItem, idx) => (
                <>
                    <HomepageItemCard homepageItem={homepageItem}></HomepageItemCard>
                </>
                ))}
            </Row>
            */