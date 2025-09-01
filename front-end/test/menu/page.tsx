"use client"

import MenuVertical from "@/layout/MenuVertical"

export default function App() {
    let profile = {}
    return (
        <>
            <h1>Coucou</h1>
            <div style={{height: "100%", overflowY: "auto"}} className="bg-light vh-100 border-end" md={3} xl={2}>
                <MenuVertical id="menu" direction="vertical" isManager={true} profile={false}/>
            </div>
        </>
    )
}