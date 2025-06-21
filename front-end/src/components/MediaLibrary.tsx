import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'

import { Logger } from 'react-logger-lib'
import { ReactMediaLibrary } from 'react-media-library'

import { t } from 'src/components/lib/utils'

import { UtilsGraphQL } from 'src/api/utils-graphql'

import Loading from 'src/components/common/Loading'

import { Constants } from 'src/constants/Constants'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/shadcn/tabs'
import { Card, /*CardAction,*/ CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { get } from 'http'

export default function MediaLibrary() {
    const log = Logger.of(MediaLibrary.name)

    const graphqlURI = Constants.WORDPRESS_GRAPHQL_ENDPOINT
    const [cookies] = useCookies(['JWT'])

    const [itemsList, setItemsList] = useState([])

    function getReactMediaLibrary(mediaItems) {
        return (
            <ReactMediaLibrary
                defaultSelectedItemIds={[]}
                fileLibraryList={mediaItems}
                isOpen={true}
                fileUploadCallback={() => {
                    log.trace('File upload callback triggered');
                }}
                filesDeleteCallback={() => {
                    log.trace('File delete callback triggered');
                }}
                filesSelectCallback={() => {
                    log.trace('Files select callback triggered');
                }}
                finishUploadCallback={() => {
                    log.trace('Finish upload callback triggered');
                }}
                onClose={() => {}}
            />
        )

    }

    function getTabsList(mediaItems) {
        return (
            <TabsList>
                <TabsTrigger value="all">{t('All')}</TabsTrigger>
                <TabsTrigger value="images">{t('Images')}</TabsTrigger>
                <TabsTrigger value="videos">{t('Videos')}</TabsTrigger>
                <TabsTrigger value="audio">{t('Audio')}</TabsTrigger>
                <TabsTrigger value="documents">{t('Documents')}</TabsTrigger>
            </TabsList>
        )
    }

    function getMediaItemDefaultView(mediaItem) {
        return (
            <div key={mediaItem.id} className="media-item w-[256px] h-[256px] p-4 border rounded-lg shadow-md">
                <img src={mediaItem.thumbnailUrl} alt={mediaItem.title} />
                <h3>{mediaItem.title}</h3>
                <p>{mediaItem.description}</p>
                <p>{mediaItem.size} bytes</p>
                <p>Created at: {new Date(mediaItem.createdAt).toLocaleDateString()}</p>
            </div>
        )
    }
    
    function getImageViewer(mediaItem) {
        return (
            <img src={mediaItem.thumbnailUrl} alt={mediaItem.title} />
        )
    }

    function getVideoViewer() {
        return (
            <video alt={mediaItem.title} controls autoplay muted className="w-full h-full rounded-lg shadow-md">
                <source src={mediaItem.thumbnailUrl} type={mediaItem.mimeType} />
            </video>
        )
    }
    
    function getAudioViewer() {
        return (
            <audio controls className="w-full h-full rounded-lg shadow-md">
                <source src={mediaItem.thumbnailUrl} type={mediaItem.mimeType} />
                Your browser does not support the audio element.
            </audio>
        )
    }
    
    function getDocumentViewer() {
        return (
            <object data={mediaItem.thumbnailUrl + "#toolbar=1"}
                type={mediaItem.mimeType}
                width='100%' height='256px'
                className="w-full h-full rounded-lg shadow-md"
            >
            </object>
        )
        /*
            <PDFViewer className="w-full h-full rounded-lg shadow-md">
                <Document file={mediaItem.thumbnailUrl}>
                    <Page pageNumber={1} />
                </Document>
            </PDFViewer>
        */
    }

    function getMediaItemView(mediaItem) {
        let width = mediaItem.width || 256
        let height = mediaItem.height || 256
        let cn = `w-[${width}] h-[${height}] p-4 border rounded-lg shadow-md`

        return (
            <Card key={mediaItem.id} className={cn}>
                <CardHeader>
                    <CardTitle>{mediaItem.title}</CardTitle>
                    <CardDescription>{mediaItem.description}</CardDescription>
                    {/*<CardAction>Card Action</CardAction>*/}
                </CardHeader>
                <CardContent>
                    { "image" === mediaItem.mediaType && getImageViewer(mediaItem) }
                    { "video" === mediaItem.mediaType && getVideoViewer(mediaItem) }
                    { "audio" === mediaItem.mediaType && getAudioViewer(mediaItem) }
                    { "file" === mediaItem.mediaType && getDocumentViewer(mediaItem) }
                </CardContent>
                <CardFooter className='flex flex-col gap-2'>
                    <div>{mediaItem.description}</div>
                    <div>{mediaItem.size} bytes</div>
                    <div>Created at: {mediaItem.createdAt}</div>
                    <div>MimeType: {mediaItem.mimeType}</div>
                    <div>MediaType: {mediaItem.mediaType}</div>
                </CardFooter>
            </Card>
        )
    }

    function getTabsContent(mediaItems) {
        return (
            <>
                <TabsContent value="all">
                    <div class="grid grid-cols-4 gap-1">
                    {
                        mediaItems.map((mediaItem) =>
                            getMediaItemView(mediaItem)
                        )
                    }
                    </div>
                </TabsContent>
                <TabsContent value="images">
                    Images
                </TabsContent>
                <TabsContent value="videos">
                    Vidéos
                </TabsContent>
                <TabsContent value="audio">
                    Audios
                </TabsContent>
                <TabsContent value="documents">
                    Documents
                </TabsContent>
            </>
        )
    }

    function getTabView(mediaItems) {
        let selectors = getTabsList(mediaItems)
        let content = getTabsContent(mediaItems)

        return (
            <div className="media-library-container">
                <Tabs defaultValue="all" className="w-full">
                    {selectors}
                    {content}
                </Tabs>
            </div>
        )
    }

    function getShadcnMediaLibrary(mediaItems) {
        return getTabView(mediaItems)
    }

    useEffect(() => {
        UtilsGraphQL.getMediaItems(graphqlURI, cookies)
            .then((nodes) => {
                log.trace("useEffect: Media items fetched successfully", nodes)
                let result = []
                result = nodes.map((node) => {
                    let media = {
                        "id": node.id,
                        "databaseId": node.databaseId,
                        "title": node.title || '',
                        "description": node.description || '',
                        "size": node.fileSize || 0,
                        "fileName": node.mediaDetails?.file || '',
                        "date": node.date || '',
                        "width": node.mediaDetails?.width || '',
                        "height": node.mediaDetails?.height || '',
                        "thumbnailUrl":  node.mediaItemUrl || '',
                        "createdAt": node.dateGmt,
                        "mimeType": node.mimeType || '',
                        "mediaType": node.mediaType || '',
                    }
                    log.trace("useEffect: Media item processed", media)
                    return media
                })
                log.trace("useEffect:", result)
                setItemsList(result)
            })
            .catch((error) => {
                log.trace('Error fetching media items', error)
            })
    }, [])

    //let viewType = 'react-media-library'
    let viewType = 'shadcn-media-library'

    return (
        <>
            { itemsList.length > 0 ?
                    <>
                        {"react-media-library" === viewType && getReactMediaLibrary(itemsList)}
                        {"shadcn-media-library" === viewType && getShadcnMediaLibrary(itemsList)}
                    </>
                :
                    <Loading />
}
        </>
    )
}