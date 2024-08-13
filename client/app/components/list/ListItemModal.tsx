import React, { useState } from 'react'
import { ListItem } from './ListItem'
import { Button, Modal } from 'react-bootstrap'
import { HomepageItem } from '../../home/HomepageItem'

interface ListItemModalProps {
    item: HomepageItem
}

export const ListItemModal: React.FC<ListItemModalProps> = ({item}) =>
{
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleViewPage = () => {
        let url = item.pageUrl;

        if(!url) url = item.githubUrl;

        if(!url)
        {
            console.warn("No url found for " + item.title);
            return;
        }

        if(item.openNewPage)
        {
            window.open(url, '_blank')?.focus()
            return;
        }

        window.location.href = url;
    }

    const handleViewGithub = () => {
        const url = item.githubUrl!
        window.open(url, '_blank')?.focus()
    }

    return (
        <>
            <ListItem title={item.title} image={item.image} description={item.shortDescription}>
                <div className="align-self-end row">
                {
                    item.videoPreviewId != undefined ?
                    <>
                    <div className="col-auto p-1">
                        <button className="btn flex btn-primary" onClick={handleShow}><i className="fa fa-youtube"></i> Show video</button>
                    </div>
                    </> : <></>
                }
                {
                    item.pageUrl != undefined ?
                    <>
                    <div className="col-auto p-1">
                        <button className="btn btn-secondary" onClick={handleViewPage}><i className="fa fa-file"></i> View page</button>
                    </div>
                    </> : <></>
                }
                {
                    item.githubUrl != undefined ?
                    <>
                    <div className="col-auto p-1">
                        <button className="btn btn-secondary" onClick={handleViewGithub}><i className="fa fa-github"></i> Github</button>
                    </div>
                    </> : <></>
                }
                </div>
            </ListItem>
            
            <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{item.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div> {item.shortDescription} </div>
                <div>
                    { item.videoPreviewId
                        ? <iframe width="100%" height="300px" className='mt-4' src={ "https://www.youtube.com/embed/" + item.videoPreviewId } title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe> 
                        : ""
                    }
                </div>

                {item.description}
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