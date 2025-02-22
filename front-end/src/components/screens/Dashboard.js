import { useEffect, useState } from 'react'

import { Logger } from 'react-logger-lib'

import { t } from 'i18next'
import { useCookies } from 'react-cookie'

import { Constants } from '@/constants/Constants'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "src/components/ui/shadcn/card"
import { Button } from 'src/components/ui/shadcn/button'
import { Icons } from '@/constants/Icons'
import { cn } from '@/lib/utils'

export default function Dashboard() {
    const log = Logger.of(Dashboard.name);

    const graphqlURI = Constants.WORDPRESS_GRAPHQL_ENDPOINT;
    const [cookies] = useCookies(['JWT']);

    const lang = ""

    const configuration = {
        css: {
            level1: {
                title: "ps-3 font-extrabold text-2xl",
                subtitle: "ps-3 font-semibold text-xl",
                description: "ps-3 font-normal",
            },
            level2: {
                lst: {backgroundImage: "linear-gradient(45deg,rgb(172, 153, 226),rgb(29, 9, 146))"},
                lcn: "rounded-2 m-2 w-[300px] text-white",
                //title: "ps-3 font-extrabold text-2xl",
                title: "ps-3 font-extrabold text-2xl",
                subtitle: "ps-3 font-semibold text-xl",
                description: "ps-3 font-normal",
            },
        },
        cheatSheetsSet: [
            {
                id: "veep-usage",
                //className: "ps-3 font-bold",
                css: {
                    title: "ps-3 font-extrabold text-2xl",
                    subtitle: "ps-3 font-semibold text-xl",
                    description: "ps-3 font-normal",

                },
                title: "Get Started With Content Creation",
                subtitle: "",
                description: "",
                content: [
                    {
                        id: "tailor-usage-discover",
                        title: "Create Content",
                        subtitle: "",
                        description: "Veep acts as a Content Factory. You can create all sort of contents",
                        css: {
                            //title: "ps-3 font-extrabold text-2xl",
                            title: "text-2xl font-sans",
                            subtitle: "text-1xl font-sans",
                            description: "font-normal",
                        },
                        icon: "right",
                        href: `https://docs.veep.ai/getting_started/gs-user-overview`
                    },
                    {
                        id: "tailor-usage-business",
                        title: "Tailor Veep to Your Business",
                        subtitle: "",
                        description: "Create content that's on-brand and uses your unique tone and voice.",
                        href: "https://docs.veep.ai/getting_started/gs-user-overview"
                    }
                ]
            },
            {
                id: "veep-configuration",
                title: "Get Started With Veep Configuration",
                className: "ps-3 font-bold",
                subtitle: "",
                description: "",
                content: [
                    {
                        id: "tailor-configuration-help",
                        title: "Discover Veep Configuration",
                        subtitle: "",
                        description: "Veep can be configured to create specific assistants' catalog.",
                        href: "https://docs.veep.ai/getting_started/gs-expert-quickstart"
                    },
                    {
                        id: "tailor-configuration-assistant",
                        title: "Tailor Configuration",
                        subtitle: "",
                        description: "Configure an assistant (veeplet)",
                        href: "https://docs.veep.ai/getting_started/gs-expert-overview"
                    }
                ]
            },
            {
                id: "tailor-tools",
                title: "Get Started With Tools",
                subtitle: "",
                description: "",
                content: [
                    {
                        id: "tailor-tools-chat",
                        title: "Discover Chat",
                        subtitle: "",
                        description: "Chat acts as your AI assistant to help you with everyday tasks like writing, brainstorming, researching, and much more.",
                        href: "https://www.google.com"
                    },
                    {
                        id: "tailor-tools-brand-voice",
                        title: "Tailor Chat to your Brand Voice",
                        subtitle: "",
                        description: "Create content that's on-brand and uses your unique tone and voice.",
                        href: "https://www.google.com"
                    }
                ]
            }
        ]
    }

    function setDocumentationURL(href) {
        log.trace("setDocumentationURL: href: " + href)
        //PubSub.publish("COVER_DOCUMENTATION", href)
    }
  
    /**
     * Returns item value of current if present or default one otherwise
     */
    function getValueOrDefault(item, current, level, configuration) {
        log.trace("item:", item)
        log.trace("current:", current)
        log.trace("level:", level)
        log.trace("configuration:", configuration)
        log.trace("result1:", current[item]?.css)
        log.trace("result2:", configuration?.css[level][item])
        return (current && current.css && current.css[item]) ?? configuration?.css[level][item]
    }

    /**
     * 
     * @param {*} lst local style
     *  
     * @returns 
     */
    //function getCard({id, title, subtitle, description, label, href}) {
    function getCard(cheatSheet) {
        return (
            <Card key={cheatSheet.id} id={cheatSheet.id} style={getVOD2("lst", cheatSheet)} className={cn("d-flex flex-col", getVOD2("lcn", cheatSheet))}>
                <div class="flex-1">
                    <CardHeader className="mb-2">
                        <CardTitle className={getVOD2("title", cheatSheet)}>{cheatSheet.title}</CardTitle>
                        {cheatSheet.subtitle && <CardSubtitle className={getVOD2("subtitle", cheatSheet)}>{cheatSheet.subtitle}</CardSubtitle>}
                        {/*cheatSheet.description && <CardDescription className={getVOD2("description", cheatSheet)}></CardDescription>*/}
                    </CardHeader>
                    <CardContent className="text-md h-16">
                        {cheatSheet.description}
                    </CardContent>
                </div>
                <CardFooter className="justify-end">
                    <Button asChild>
                        <a className="button" target="_blank" href={cheatSheet.href}>
                            {cheatSheet?.icon ? Icons[cheatSheet.icon] : Icons["right"]}{cheatSheet?.label}
                        </a>
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    useEffect(() => {
    }, [])

    let getVOD1 = (item, current) => getValueOrDefault(item, current, "level1", configuration)
    let getVOD2 = (item, current) => getValueOrDefault(item, current, "level2", configuration)

    return (
        <div className=''>
            {configuration?.cheatSheetsSet.map((cheatSheets) =>
                <div key={cheatSheets.id} id={cheatSheets.id} className="p-4">
                    <div className={getVOD1("title", cheatSheets)}>{cheatSheets.title}</div>
                    {cheatSheets?.subtitle && <div className={getVOD1("subtitle", cheatSheets)}>{cheatSheets?.subtitle}</div>}
                    {cheatSheets?.description && <div className={getVOD1("description", cheatSheets)}>{cheatSheets?.description}</div>}
                    <div className="p-2 flex flex-wrap">
                        {cheatSheets?.content?.map((cheatSheet) => getCard(cheatSheet))}
                    </div>
                </div>
            )}
        </div>
    )
}

