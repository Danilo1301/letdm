import React, { useState } from 'react'

interface ListItemProps {
    image?: string
    title: string
    description: string
    href?: string
    children?: React.ReactNode;
}

export const ListItem: React.FC<ListItemProps> = ({image, title, description, href, children}) =>
{
    let titleSize = 16;
    let imageEl = <></>;
    if(image)
    {
        imageEl = <>
            <div className="col-auto p-0">
                <img src={"/" + image} className="bg-dark border float-left rounded" width="200px" alt="..."></img>
            </div>
        </>;
    }

    const onClickItem = () => {
        console.log("clicked item");

        if(href)
            window.location.href = href;
    };

    return (
        <>
            <li className="list-group-item" style={{paddingTop: "10px", paddingBottom: "10px"}}>
                <div className="row border p-0 m-0 item_selectable" onClick={onClickItem}>
                    {imageEl}
                    <div className="col">
                        <div className="row" style={{height: '100%'}}>
                            <div className="align-self-start p-2">
                                <b style={{fontSize: titleSize}}>{title}</b>
                                <div>{description}</div>
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        </>
    )
}

/*
<div className="bg-light" style={ {width: 200, height: 200} }>
    <img src={'imageSrc'} width="100%" height="100%"></img>
</div>
                */

/*
<Col>
<NavLink onClick={handleShow}>
    <Card>
        <Card.Img variant="top" src={homepageItem.image} />
        <Card.Body>
        <Card.Title>{homepageItem.title}</Card.Title>
        <Card.Text>
            {homepageItem.shortDescription}
        </Card.Text>
        </Card.Body>
    </Card>
</NavLink>
</Col>

<Modal show={show} onHide={handleClose}>
<Modal.Header closeButton>
    <Modal.Title>{homepageItem.title}</Modal.Title>
</Modal.Header>
<Modal.Body>
    {homepageItem.shortDescription}
    
    { homepageItem.videoPreviewId
        ? (<iframe width="100%" height="300px" src={ "https://www.youtube.com/embed/" + homepageItem.videoPreviewId } title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>) 
        : ""
    }

    {homepageItem.description}
</Modal.Body>
<Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>
        Close
    </Button>
    <Button variant="primary" onClick={handleViewPage}>
        View page
    </Button>
</Modal.Footer>
</Modal>
*/