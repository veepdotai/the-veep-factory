import { useEffect, useState } from 'react'

import { Logger } from 'react-logger-lib'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import PubSub from 'pubsub-js'

import { t } from 'i18next'
import { Container } from 'react-bootstrap'
import { useCookies } from 'react-cookie'

import { Constants } from '@/constants/Constants'
import { UtilsGraphQL } from "src/api/utils-graphql"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "src/components/ui/shadcn/card"
import { Button } from 'src/components/ui/shadcn/button'

export default function Dashboard() {
    const log = Logger.of(Dashboard.name);

    const graphqlURI = Constants.WORDPRESS_GRAPHQL_ENDPOINT;
    const [cookies] = useCookies(['JWT']);

    function setDocumentationURL(href) {
        log.trace("setDocumentationURL: href: " + href)
        //PubSub.publish("COVER_DOCUMENTATION", href)
    }
  
    function getCard({ title, description, name, href }) {
        return (
            <Card style={{backgroundImage: "linear-gradient(45deg, #00d4ff, #090979)"}} className="rounded-2 m-2 w-96 text-white">
                <CardHeader className="mb-3">
                    <CardTitle className="text-4xl font-sans">{title}</CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent className="text-md h-16">
                    {description}
                </CardContent>
                <CardFooter>
                    {/*<Button onClick={() => setDocumentationURL(href)} class="bg-black text-white rounded-md px-3 h-8">{name}</Button>*/}
                    <Button asChild><a className="button" target="_blank" href={href}>{name}</a></Button>
                </CardFooter>
            </Card>
        )
    }

    useEffect(() => {
    }, [])

    return (
        <div>
            <div className="p-4">
                <div className="ps-3 font-bold">Get Started With Veep Usage</div>
                <div className="p-2 flex">
                    {getCard({
                        title: "Discover Veep Usage",
                        description: "Veep acts as an Authentic Content Factory.",
                        name: "Discover",
                        href: "https://docs.veep.ai/getting_started/gs-user-quickstart"
                    })}
                    {getCard({
                        title: "Tailor Veep to Your Business",
                        description: "Create content that's on-brand and uses your unique tone and voice.",
                        name: "Define Your Brand Voice",
                        href: "https://docs.veep.ai/getting_started/gs-user-overview"
                    })}
                </div>
            </div>

            <div className="p-4">
                <div className="ps-3 font-bold">Get Started With Veep Configuration</div>
                <div className="flex p-2">
                    {getCard({
                        title: "Discover Veep Configuration",
                        description: "Veep can be configured to create specific assistants' catalog.",
                        name: "Discover",
                        href: "https://docs.veep.ai/getting_started/gs-expert-quickstart"
                    })}
                    {getCard({
                        title: "Tailor Configuration",
                        description: "Configure an assistant (veeplet)",
                        name: "Configure",
                        href: "https://docs.veep.ai/getting_started/gs-expert-overview"
                    })}
                </div>
            </div>

            {/*
            <div className="p-4">
                <div className="ps-3 font-bold">Get Started With Chat</div>
                <div className="flex p-2">
                    {getCard({
                        title: "Discover Chat",
                        description: "Chat acts as your AI assistant to help you with everyday tasks like writing, brainstorming, researching, and much more.",
                        name: "Discover",
                        href: "https://www.google.com"
                    })}
                    {getCard({
                        title: "Tailor Chat to your Brand Voice",
                        description: "Create content that's on-brand and uses your unique tone and voice.",
                        name: "Define Your Brand Voice",
                        href: "https://www.google.com"
                    })}
                </div>
            </div>
            */}
        </div>
    )
}

