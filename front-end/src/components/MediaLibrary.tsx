import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { Logger } from 'react-logger-lib'
import PubSub from 'pubsub-js'
import { ReactMediaLibrary } from 'react-media-library'

import { cn } from '@/lib/utils'
import { t, Utils, guv } from 'src/components/lib/utils'

import { UtilsGraphQL } from 'src/api/utils-graphql'

import Loading from 'src/components/common/Loading'

import { Constants } from 'src/constants/Constants'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/shadcn/tabs'
import { Card, /*CardAction,*/ CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from './ui/shadcn/button'
import { Checkbox } from './ui/shadcn/checkbox'
import { Badge } from './ui/shadcn/badge'
import { Icons, getIcon } from '@/constants/Icons'
import DynamicForm from './screens/forms/DynamicForm'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "src/components/ui/shadcn/dialog"


export default function MediaLibrary({fieldName, embeddingType = "nomodal"}) {
    const log = (...args) => Logger.of(MediaLibrary.name).trace(args)
    
    const _guv = (name, defaultValue = null) => guv("MediaLibrary_" + name);

    const graphqlURI = Constants.WORDPRESS_GRAPHQL_ENDPOINT
    const [cookies] = useCookies(['JWT'])

    const [loading, setLoading] = useState(true)
    const [timestamp, setTimestamp] = useState(Date.now())
    const [objectViewType, setObjectViewType] = useState('object-cover')
    const [viewSize, setViewSize] = useState({
        width: parseInt(_guv("WIDTH")),
        height: parseInt(_guv("HEIGHT")),
        metadataHeight: parseInt(_guv("METADATA_HEIGHT"))
    })

    const [itemsList, setItemsList] = useState([])

    function getReactMediaLibrary(mediaItems) {
        return (
            <ReactMediaLibrary
                defaultSelectedItemIds={[]}
                fileLibraryList={mediaItems}
                isOpen={true}
                fileUploadCallback={() => {
                    log('File upload callback triggered');
                }}
                filesDeleteCallback={() => {
                    log('File delete callback triggered');
                }}
                filesSelectCallback={() => {
                    log('Files select callback triggered');
                }}
                finishUploadCallback={() => {
                    log('Finish upload callback triggered');
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
                <TabsTrigger className="mx-2" value="upload">{t('Upload')}</TabsTrigger>
            </TabsList>
        )
    }

    function getObjectSelectors() {
        //let objectViewTypes = ["object-contain", "object-cover", "object-fill", "object-none"]
        let objectViewTypes = ["object-fill", "object-none"]

        function setOvt(ovt) {
            log("setOvt: before: ovt:", ovt)
            setObjectViewType(ovt)
        }

        return (
            <div className="">
                {objectViewTypes.map((ovt) => ovt === objectViewType ?
                        <Button className="disabled border-black" variant="outline" size="icon">{getIcon(ovt)}</Button>
                    :
                        <Button className="" variant="ghost" size="icon" onClick={() => setOvt(ovt)}>{getIcon(ovt)}</Button>
                )}
            </div>
        )
    }

    function getViewSizeSelectors() {
        return (
            <div className="flex flex-row gap-1">
                <div>{viewSize.width} x {viewSize.height} px</div>
                <Button key="plus" variant="ghost" size="icon" onClick={() =>
                    setViewSize({
                        width: viewSize.width + parseInt(_guv("WIDTH_INCREASE")),
                        height: viewSize.height + parseInt(_guv("HEIGHT_INCREASE")),
                        metadataHeight: viewSize.metadataHeight
                    })}>{getIcon("plus")}</Button>
                <Button key="minus" variant="ghost" size="icon" onClick={() =>
                    setViewSize({
                        width: viewSize.width - parseInt(_guv("WIDTH_INCREASE")),
                        height: viewSize.height - parseInt(_guv("HEIGHT_INCREASE")),
                        metadataHeight: viewSize.metadataHeight
                    })}>{getIcon("minus")}</Button>
            </div>
        )        
    }

    function getGenericCN(objectViewType2) {
        return cn('_w-full _h-full rounded-lg', objectViewType)
    }

    function getImageViewer(mediaItem, objectViewType) {
        return (
            <>
                {/*<img src={mediaItem.thumbnailUrl} width={mediaItem.width} height={mediaItem.height} alt={mediaItem.title} className="" />*/}
                <img src={mediaItem.thumbnailUrl} width={viewSize.width} height={viewSize.height} alt={mediaItem.title} className={getGenericCN(objectViewType)} />
            </>
        )
    }

    function getVideoViewer(mediaItem, objectViewType) {
        return (
            <video alt={mediaItem.title} controls width={viewSize.width} height={viewSize.height} className={getGenericCN(objectViewType)}>
                <source src={mediaItem.thumbnailUrl} type={mediaItem.mimeType} />
                Your browser does not support the video element.
            </video>
        )
    }
    
    function getAudioViewer(mediaItem, objectViewType) {
        return (
            <audio controls className={getGenericCN(objectViewType)}>
                <source src={mediaItem.thumbnailUrl} type={mediaItem.mimeType} />
                Your browser does not support the audio element.
            </audio>
        )
    }
    
    function getDocumentViewer(mediaItem, objectViewType) {
        /*
            <PDFViewer className="w-full h-full rounded-lg shadow-md">
                <Document file={mediaItem.thumbnailUrl}>
                    <Page pageNumber={1} />
                </Document>
            </PDFViewer>
        */
        return (
            <object data={mediaItem.thumbnailUrl}
                type={mediaItem.mimeType}
                width='100%' height={`${viewSize.height}px`}
                className={getGenericCN(objectViewType)}
            >
            </object>
        )
    }

    function getMediaItemView(mediaItem, objectViewType) {
        let outerCN = `relative m-1 p-1 border rounded-lg shadow-md`
 
        let contentWidth = viewSize.width
        let contentHeight = viewSize.height + viewSize.metadataHeight + 20
        let contentCN = `w-[${contentWidth}px] h-[${contentHeight}px] m-1 p-1`
 
        let metadataWidth = viewSize.width
        let metadataHeight = viewSize.metadataHeight
        let metadataCN = `w-[${metadataWidth}px] h-[${metadataHeight}px] absolute bottom-0 m-1 p-1 flex flex-col text-xs items-start`

        let mediaType = mediaItem.mediaType
        let mimeType = mediaItem.mimeType

        log("getMediaItemView: mediaItem:", mediaItem)
        log("getMediaItemView: mimeType:", mimeType, " startsWith application:", mimeType.startsWith("application"))

        function selectMediaItem(mediaItem) {
            log("selectMediaItem: mediaItem:", mediaItem)
            PubSub.publish("MEDIA_ITEM_SELECTED_" + fieldName, mediaItem)
        }

        return (
            <Card key={mediaItem.id} className={outerCN}>
                {false &&
                    <CardHeader>
                        <CardTitle>{mediaItem.title}</CardTitle>
                        <CardDescription>{mediaItem.description}</CardDescription>
                        {/*<CardAction>Card Action</CardAction>*/}
                    </CardHeader>
                }
                <CardContent className={contentCN}>
                    <div onClick={() => selectMediaItem(mediaItem)} className="">
                        { "image" === mediaType && getImageViewer(mediaItem, objectViewType) }
                        { ("video" === mediaType || mimeType.startsWith("video")) && getVideoViewer(mediaItem, objectViewType) }
                        { ("audio" === mediaType || mimeType.startsWith("audio")) && getAudioViewer(mediaItem, objectViewType) }
                        { mimeType.startsWith("application") && getDocumentViewer(mediaItem, objectViewType) }
                    </div>
                </CardContent>
                <CardFooter className={metadataCN}>
                    <p className="font-bold overflow-x">{mediaItem?.fileName?.replace(/.*([^\\]*)$/, "$1")?.substr(0, 30)}</p>
                    {false && <div>Description: {mediaItem?.description}</div>}
                    <div className="flex flex-row gap-1 justify-start items-center">
                        <div>{Math.round(parseInt(mediaItem?.size)/1024)}Kb</div>
                        <div>{mediaItem?.createdAt}</div>
                    </div>
                    <div><Badge>{mediaItem?.mimeType}</Badge></div>
                    {false && <div>MediaType: {mediaItem.mediaType}</div>}
                </CardFooter>
            </Card>
        )
    }

    function getTabContent(mediaItems, objectViewType, selectedViewType = 'all') {
        if (!mediaItems || mediaItems.length === 0) {
            return <div className="text-center p-4">{t('No media items found')}</div>
        }

        if (["image", "video", "audio"].includes(selectedViewType)) {
            mediaItems = mediaItems.filter((item) => item.mediaType === selectedViewType || item.mimeType.startsWith(selectedViewType))
        } else if (selectedViewType === 'file') {
            mediaItems = mediaItems.filter((item) => item.mediaType === 'file' && ! item.mimeType.startsWith('video') && ! item.mimeType.startsWith('audio'))
        }
        
        return (
            <div className="flex flex-wrap gap-1">
                {
                    mediaItems.map((mediaItem) =>
                        getMediaItemView(mediaItem, objectViewType)
                    )
                }
            </div>
        )
    }

    function getTabsContent(mediaItems, objectViewType) {
        return (
            <>
                <TabsContent value="all">
                    {getTabContent(mediaItems, objectViewType, 'all')}
                </TabsContent>
                <TabsContent value="images">
                    {getTabContent(mediaItems, objectViewType, 'image')}
                </TabsContent>
                <TabsContent value="videos">
                    {getTabContent(mediaItems, objectViewType, 'video')}
                </TabsContent>
                <TabsContent value="audio">
                    {getTabContent(mediaItems, objectViewType, 'audio')}
                </TabsContent>
                <TabsContent value="documents">
                    {getTabContent(mediaItems, objectViewType, 'file')}
                </TabsContent>
                <TabsContent value="upload">
                    <DynamicForm type="upload" importButton={false} />
                </TabsContent>
            </>
        )
    }

    function getTabView(mediaItems, objectViewType) {
        let tabSelectors = getTabsList(mediaItems)
        let objectSelectors = getObjectSelectors()
        let viewSizeSelectors = getViewSizeSelectors()
        let content = getTabsContent(mediaItems, objectViewType)

        return (
            <div className="media-library-container">
                <Tabs defaultValue="images" className="w-full m-2">
                    <div className="flex flex-row justify-between items-center mb-4">
                        {tabSelectors}
                        {objectSelectors}
                        { false && viewSizeSelectors}
                        <div className="me-1">
                            {loading ? "Loading" : <Button variant="ghost" size="icon" onClick={refresh}>{getIcon("refresh")}</Button>}
                        </div>
                    </div>
                    {content}
                </Tabs>
            </div>
        )
    }

    function getShadcnMediaLibrary(mediaItems, objectViewType) {
        return getTabView(mediaItems, objectViewType)
    }

    function refresh() {
        setLoading(true)
        setTimestamp(Date.now())
    }

    function update() {
        UtilsGraphQL.getMediaItems(graphqlURI, cookies)
            .then((nodes) => {
                log("useEffect: Media items fetched successfully", nodes)
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
                    log("useEffect: Media item processed", media)
                    return media
                })
                log("useEffect:", result)
                setItemsList(result)
                setLoading(false)
            })
            .catch((error) => {
                log('Error fetching media items', error)
            })
    }

    function getModal(mediaLibrary) {
        alert('Entering getModal')
        log("getModal: mediaLibrary:", mediaLibrary)
        PubSub.publish("PROMPT_DIALOG", {
            title: t('Media Library'),
            description: t('Select or upload media items'),
            content: mediaLibrary,
            actions: [
                {
                    label: t('Close'),
                }
            ],
            outerCN: "max-w-3xl"
        })
    }

    function getMediaLibrary(viewType, itemsList, objectViewType) {
        return (
            <div className="overflow-y-auto">
                {"react-media-library" === viewType && getReactMediaLibrary(itemsList)}
                {"shadcn-media-library" === viewType && getShadcnMediaLibrary(itemsList, objectViewType)}
            </div>
        )
    }

    useEffect(() => {
        update()
    }, [timestamp])

    //let viewType = 'react-media-library'
    let viewType = 'shadcn-media-library'
    log("MediaLibrary: viewType:", viewType, " embeddingType:", embeddingType)

    return (
        <>
        { embeddingType === "nomodal" ?
                itemsList.length > 0 && objectViewType ?
                        getMediaLibrary(viewType, itemsList, objectViewType)
                    :
                        <Loading />
            :
                itemsList.length > 0 && objectViewType ?
                        getModal(getMediaLibrary(viewType, itemsList, objectViewType))
                    :
                        <Loading />
        }
        </>
    )
}