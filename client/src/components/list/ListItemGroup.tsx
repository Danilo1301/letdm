import React from 'react'

interface ListItemGroupProps {
    title: string
    itemsName?: string
    children: React.ReactNode;
}

export const ListItemGroup: React.FC<ListItemGroupProps> = ({ title, itemsName, children }) =>
{
    let itemsText = <></>;

    if(itemsName !== undefined)
    {
        itemsText = <><small className="text-light">{0} {itemsName}</small></>;
    }

    return (
        <>
            <ul className="list-group" style={{marginBottom: 120}}>
                <div className="p-2" style={{background: "#7192ff"}}>
                    <h5 className="text-light mb-1">{title}</h5>
                    {itemsText}
                </div>

                {children}
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