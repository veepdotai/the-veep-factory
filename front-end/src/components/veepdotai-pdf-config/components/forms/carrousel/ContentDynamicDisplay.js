import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "src/components/ui/shadcn/pagination";
import { useRef, useState } from "react";
import { Button } from "src/components/ui/shadcn/button";
import { t } from 'i18next';
import { updateLocale } from "moment/moment";
import icones from '../../../icons'
import { Input } from "src/components/ui/shadcn/input";

function ContentDynamicDisplay(props){
    let pages = props.pages

    const [activePage, setActive] = useState(1)

    const handlePageLoad = (number) => {
        if (number >= 1 && number <= pages.length){
            setActive(number)
        }
    }

    const handleChangeBackground = (newBackground) => {
        try{pages[activePage-1][3] = URL.createObjectURL(newBackground.target.files[0])
        props.handleChange(pages)}
        catch{}
    }
    const handleChangeImage = (newImage) => {
        try{pages[activePage-1][4] = URL.createObjectURL(newImage.target.files[0])
        props.handleChange(pages)}
        catch{}
    }

    /*
    const handlePageChange = (newPage) => {
        pages[newPage[0]-1] = newPage
        props.handleChange(pages)
    }
    
    const updatePagesNumber = () => {
        let count = 0
        pages.map(function(item){
            count += 1
            item[0] = count
        })
    }

    const addPage = () => {
        pages.push([pages.length+1, "./assets/images/nothing.png",t("DefaultBackCoverContent"),t("DefaultBackCoverTitle")])
        props.handleChange(pages)
        setActive(activePage)
    }

    const deletePage = () => {
        if (pages.length > 1){
            pages = pages.slice(0, activePage-1).concat(pages.slice(activePage))
            if (pages.length < activePage && activePage > 1){
                setActive(activePage-1)
            }

            updatePagesNumber()

            props.handleChange(pages)
        }
    }*/
    

    return (
        <div>
            {pages.length > 1 ? (
                        <Pagination className={pages.length > 1 ? "w-full" : "hidden"}>
                        <PaginationContent className="">
                            <PaginationItem>
                                <PaginationPrevious onClick={() => {handlePageLoad(activePage-1)}} />
                            </PaginationItem>
                            
                            <PaginationItem>
                                <PaginationLink className={(activePage == 1? "border-2":"")} onClick={() => {handlePageLoad(1)}}> {1 + props.startingPage} </PaginationLink>
                            </PaginationItem>

                            { pages.length > 2 ? 
                                (<PaginationItem>
                                    <PaginationLink className={(activePage == 2 && pages.length > 2? "border-2":"")} 
                                        onClick={() => {activePage > 2 ? (activePage == pages.length || activePage == pages.length-1 ? handlePageLoad(2) : handlePageLoad(activePage-1)) : (pages.length > 2 ? handlePageLoad(2) : "")}}
                                    > 
                                        {activePage > 2 ? (activePage == pages.length || activePage == pages.length-1 ? 2 + props.startingPage : activePage-1 + props.startingPage) : (pages.length > 2 ? 2 + props.startingPage : "")} 
                                    </PaginationLink>
                                </PaginationItem>)
                                : ""
                            }  


                            { pages.length > 4 ?
                            (<PaginationItem>
                                <PaginationLink className={(activePage != 1 && activePage != 2 && activePage != pages.length-1 && activePage != pages.length ? "border-2":"")} 
                                    onClick={()=> {activePage == 1 || activePage == 2 || activePage == pages.length || activePage == pages.length-1 ? ((activePage == 1 || activePage == 2) && pages.length > 4 ? handlePageLoad(3) : ((activePage == pages.length || activePage == pages.length-1) && pages.length > 4 ? handlePageLoad(pages.length-2) : "") ) : ""}}
                                > 
                                    {activePage == 1 || activePage == 2 || activePage == pages.length || activePage == pages.length-1 ? ((activePage == 1 || activePage == 2) && pages.length > 4 ? 3 + props.startingPage : ((activePage == pages.length || activePage == pages.length-1) && pages.length > 4 ? pages.length-2 + props.startingPage : "") ) : activePage + props.startingPage} 
                                </PaginationLink>
                            </PaginationItem>)
                            : ""
                            }

                            { pages.length > 3 ? 
                            (<PaginationItem>
                                <PaginationLink className={(activePage == pages.length-1 && pages.length > 3? "border-2":"")} 
                                    onClick={() => {activePage < pages.length-2 ? (activePage == 2 || activePage == 1 ? handlePageLoad(pages.length-1) : handlePageLoad(activePage + 1)) : (pages.length > 3 ? handlePageLoad(pages.length-1) : "")}}
                                > 
                                    {activePage < pages.length-2 ? (activePage == 2 || activePage == 1 ? pages.length-1 + props.startingPage : activePage + 1 + props.startingPage) : (pages.length > 3 ? pages.length-1 + props.startingPage : "")} 
                                </PaginationLink>
                            </PaginationItem>)
                            : ""
                            }

                            <PaginationItem>
                                <PaginationLink className={(activePage == pages.length? "border-2":"")} onClick={() => handlePageLoad(pages.length)}> {pages.length + props.startingPage} </PaginationLink>
                            </PaginationItem>

                            <PaginationItem>
                                <PaginationNext onClick={() => {handlePageLoad(activePage+1)}} />
                            </PaginationItem>
                        </PaginationContent>
                        </Pagination>
                    ) : (<> </>)
            }

            {pages.map(function(item){
                let logoChoisit = item[3] == "./assets/images/nothing.png" ? useRef(null) : useRef(item[3])
                let imageChoisit = item[4] == "./assets/images/nothing.png" ? useRef(null) : useRef(item[3])

                return (<div className={item[0] == activePage? "flex-grow" : "flex-grow hidden"} forcemount>
                            <h2>Fond de la page de contenu numéro : {item[0] + props.startingPage}</h2>
                            <Input type="file" onChange={handleChangeBackground} ref={logoChoisit}/>
                            <Button className='my-1 mx-1 px-0 h-9 w-9' onClick={() => {
                                pages[activePage-1][3] = "./assets/images/nothing.png"
                                logoChoisit.current.value = ""
                                props.handleChange(pages)
                            }}>
                                {icones.trash}
                            </Button>
                            <h2>Image supplémentaire de la page de contenu numéro : {item[0] + props.startingPage}</h2>
                            <Input type="file" onChange={handleChangeImage} ref={imageChoisit}/>
                            <Button className='my-1 mx-1 px-0 h-9 w-9' onClick={() => {
                                pages[activePage-1][4] = "./assets/images/nothing.png"
                                imageChoisit.current.value = ""
                                props.handleChange(pages)
                            }}>
                                {icones.trash}
                            </Button>
                        </div>)
            })}

        </div>
    )
}

export default ContentDynamicDisplay
