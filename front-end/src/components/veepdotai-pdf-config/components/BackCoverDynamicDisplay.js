import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "src/components/ui/shadcn/pagination";
import BackCoverDisplay from './BackCoverDisplay';
import { useState } from "react";
import { Button } from "src/components/ui/shadcn/button";
import { t } from 'i18next';
import { updateLocale } from "moment/moment";
import icones from '../icons'

function BackCoverDynamicDisplay(props){
    let pages = props.pages

    const [activePage, setActive] = useState(1)
    

    const handlePageChange = (newPage) => {
        pages[newPage[0]-1] = newPage
        props.handleChange(pages)
    }

    const handlePageLoad = (number) => {
        if (number >= 1 && number <= pages.length){
            setActive(number)
        }
    }

    const addPage = () => {
        pages.push([pages.length+1, "./assets/images/nothing.png",t("DefaultBackCoverContent"),t("DefaultBackCoverTitle")])
        props.handleChange(pages)
        setActive(activePage)
    }

    const updatePagesNumber = () => {
        let count = 0
        pages.map(function(item){
            count += 1
            item[0] = count
        })
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
    }

    /*const movePageUp= () => {
        if (activePage < pages.length){
            let temp = pages[activePage-1]
            pages[activePage-1] = pages[activePage]
            pages[activePage] = temp

            setActive(activePage+1)
            updatePagesNumber()
            props.handleChange(pages)
        }
    }

    const movePageDown= () => {
        if (activePage > 1){
            let temp = pages[activePage-1]
            pages[activePage-1] = pages[activePage-2]
            pages[activePage-2] = temp

            setActive(activePage-1)
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
                                <PaginationLink className={(activePage == 1? "border-2":"")} onClick={() => {handlePageLoad(1)}}> 1 </PaginationLink>
                            </PaginationItem>

                            { pages.length > 2 ? 
                                (<PaginationItem>
                                    <PaginationLink className={(activePage == 2 && pages.length > 2? "border-2":"")} 
                                        onClick={() => {activePage > 2 ? (activePage == pages.length || activePage == pages.length-1 ? handlePageLoad(2) : handlePageLoad(activePage-1)) : (pages.length > 2 ? handlePageLoad(2) : "")}}
                                    > 
                                        {activePage > 2 ? (activePage == pages.length || activePage == pages.length-1 ? 2 : activePage-1) : (pages.length > 2 ? 2 : "")} 
                                    </PaginationLink>
                                </PaginationItem>)
                                : ""
                            }  


                            { pages.length > 4 ?
                            (<PaginationItem>
                                <PaginationLink className={(activePage != 1 && activePage != 2 && activePage != pages.length-1 && activePage != pages.length ? "border-2":"")} 
                                    onClick={()=> {activePage == 1 || activePage == 2 || activePage == pages.length || activePage == pages.length-1 ? ((activePage == 1 || activePage == 2) && pages.length > 4 ? handlePageLoad(3) : ((activePage == pages.length || activePage == pages.length-1) && pages.length > 4 ? handlePageLoad(pages.length-2) : "") ) : ""}}
                                > 
                                    {activePage == 1 || activePage == 2 || activePage == pages.length || activePage == pages.length-1 ? ((activePage == 1 || activePage == 2) && pages.length > 4 ? 3 : ((activePage == pages.length || activePage == pages.length-1) && pages.length > 4 ? pages.length-2 : "") ) : activePage} 
                                </PaginationLink>
                            </PaginationItem>)
                            : ""
                            }

                            { pages.length > 3 ? 
                            (<PaginationItem>
                                <PaginationLink className={(activePage == pages.length-1 && pages.length > 3? "border-2":"")} 
                                    onClick={() => {activePage < pages.length-2 ? (activePage == 2 || activePage == 1 ? handlePageLoad(pages.length-1) : handlePageLoad(activePage + 1)) : (pages.length > 3 ? handlePageLoad(pages.length-1) : "")}}
                                > 
                                    {activePage < pages.length-2 ? (activePage == 2 || activePage == 1 ? pages.length-1 : activePage + 1) : (pages.length > 3 ? pages.length-1 : "")} 
                                </PaginationLink>
                            </PaginationItem>)
                            : ""
                            }

                            <PaginationItem>
                                <PaginationLink className={(activePage == pages.length? "border-2":"")} onClick={() => handlePageLoad(pages.length)}> {pages.length} </PaginationLink>
                            </PaginationItem>

                            <PaginationItem>
                                <PaginationNext onClick={() => {handlePageLoad(activePage+1)}} />
                            </PaginationItem>
                        </PaginationContent>
                        </Pagination>
                    ) : (<> </>)
            }

            <Button className="mx-1 mt-1 px-0 h-9 w-9" onClick={addPage}> {icones.add} </Button> 
            <Button className={pages.length > 1 ? "mx-1 mt-1 flex-grow px-0 h-9 w-9" : "mx-1 mt-1 flex-grow hidden px-0 h-9 w-9"} onClick={deletePage}> {icones.trash} </Button>

            {pages.slice(0, pages.length-1).map(function(item){
                return (<div  className={item[0] == activePage? "flex-grow" : "flex-grow hidden"}><BackCoverDisplay number={item[0]} handleChange={handlePageChange} isLast={false} forceMount/> </div>)
            })}
            <div className={activePage == pages[pages.length-1][0]? "flex-grow" : "flex-grow hidden"}>
                <BackCoverDisplay number={pages[pages.length-1][0]} handleChange={handlePageChange} isLast={true} forceMount/>
            </div>

        </div>
    )
}

/*
<Button className={pages.length > 1 ? "mx-1 my-1 flex-grow" : "mx-1 my-1 flex-grow hidden"} onClick={movePageUp}>Déplacer la page après</Button>
<Button className={pages.length > 1 ? "mx-1 my-1 flex-grow" : "mx-1 my-1 flex-grow hidden"} onClick={movePageDown}>Déplacer la page avant</Button>
*/

/*
{pages.map(function(item){
                        if () {
                            return (
                                <PaginationItem>
                                    <PaginationLink className={(activePage == item[0]? "border-2":"")+(item[0] == 1 || item[0] == pages.length || item[0] == activePage || item[0] == activePage+1 || item[0] == activePage-1 ? "" : "hidden h-0 w-0" )} onClick={() => {handlePageLoad(item[0])}}  (Pour ne pas afficher certains numéros className={item[0] == 1 || item[0] == pages.length || item[0] == activePage || item[0] == activePage+1 || item[0] == activePage-1 ? "" : "hidden" }) >{item[0]}</PaginationLink>
                                    </PaginationItem>
                                )
                            }
                        })}
*/

export default BackCoverDynamicDisplay
