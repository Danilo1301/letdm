import React, { useState } from 'react'
import { HomepageItem, } from '../HomepageItem'
import { Button, Modal } from 'react-bootstrap'

/*
* Homepage Item Card
*/

interface IHomepageItemCardProps
{
    homepageItem: HomepageItem
}

export const HomepageItemCard: React.FC<IHomepageItemCardProps> = (props) =>
{
    const homepageItem = props.homepageItem

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleViewPage = () => {
        const url = homepageItem.pageUrl!

        if(props.homepageItem.openNewPage)
        {
            window.open(url, '_blank')?.focus()
        } else {
            window.location.href = url;
        }
    }

    const handleViewGithub = () => {
        const url = homepageItem.githubUrl!
        window.open(url, '_blank')?.focus()
    }

    return (
        <>
            <div className="row border p-0 m-0">
                <div className="col-auto p-0">
                    <img src={homepageItem.image} className="bg-dark border float-left rounded" width="300px" alt="..."></img>
                </div>
                <div className="col">
                    <div className="row" style={{height: '100%'}}>
                        <div className="align-self-start p-2">
                            <h2>{homepageItem.title}</h2>
                            <div>{homepageItem.shortDescription}</div>
                            <div>{homepageItem.description}</div>
                        </div>
                        <div className="align-self-end row">
                            {
                                homepageItem.videoPreviewId != undefined ?
                                <>
                                <div className="col-auto p-1">
                                    <button className="btn flex btn-primary" onClick={handleShow}><i className="fa fa-youtube"></i> Show video</button>
                                </div>
                                </> : <></>
                            }
                            {
                                homepageItem.pageUrl != undefined ?
                                <>
                                <div className="col-auto p-1">
                                    <button className="btn btn-secondary" onClick={handleViewPage}><i className="fa fa-file"></i> View page</button>
                                </div>
                                </> : <></>
                            }
                            {
                                homepageItem.githubUrl != undefined ?
                                <>
                                <div className="col-auto p-1">
                                    <button className="btn btn-secondary" onClick={handleViewGithub}><i className="fa fa-github"></i> Github</button>
                                </div>
                                </> : <></>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{homepageItem.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div> {homepageItem.shortDescription} </div>
                <div>
                    { homepageItem.videoPreviewId
                        ? <iframe width="100%" height="300px" className='mt-4' src={ "https://www.youtube.com/embed/" + homepageItem.videoPreviewId } title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe> 
                        : ""
                    }
                </div>

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