'use client'

import { ReactMediaLibrary } from 'react-media-library'

export default function app() {
    return (
        <>
            <button onClick={function noRefCheck(){}}>
                Open Media Library
            </button>
            <ReactMediaLibrary
                defaultSelectedItemIds={[
                ''
                ]}
                fileLibraryList={[
                     {
    "_id": "6549e02fb0612d12ca163aaa",
    "title": "amet qui sunt",
    "description": "Deserunt et reprehenderit ut qui ea ex excepteur incididunt velit. Reprehenderit dolor dolor dolore non occaecat cillum aute fugiat ea nisi nostrud. Occaecat velit excepteur non aliquip nulla. Dolor consectetur ullamco consequat sint dolor Lorem dolor. Est laborum laborum esse duis dolor occaecat aliqua esse quis sit nulla qui ad irure. Incididunt excepteur aute mollit voluptate mollit veniam et nostrud deserunt voluptate.\r\n",
    "size": 187657,
    "fileName": "qui.jpg",
    "thumbnailUrl": "https://loremflickr.com/640/360?v=01",
    "createdAt": 1208133942801
  },
  {
    "_id": "6549e02feac54a219585b848",
    "title": "laboris excepteur voluptate",
    "description": "Proident ea aliquip ad sit et. Culpa ex qui ad qui proident aliquip veniam dolor deserunt eu nisi consequat esse cupidatat. Qui dolore aliqua magna est labore consectetur non elit. Culpa proident consectetur proident nostrud do sint velit dolor ullamco nisi est pariatur. Ex esse cupidatat tempor dolor quis sunt dolore in in proident eiusmod nisi proident quis. Veniam consectetur reprehenderit quis do dolor proident sint dolor. Ex irure sunt proident sunt.\r\n",
    "size": 119197,
    "fileName": "cillum.jpg",
    "thumbnailUrl": "https://loremflickr.com/640/360?v=02",
    "createdAt": 1136027683961
  },996
                ]}
                isOpen={true}
                fileUploadCallback={function noRefCheck(){
                    alert("File upload callback triggered");
                }}
                filesDeleteCallback={function noRefCheck(){}}
                filesSelectCallback={function noRefCheck(){
                    alert("Files select callback triggered");
                }}
                finishUploadCallback={function noRefCheck(){}}
                onClose={function noRefCheck(){}}
                />
        </>
    )
} 