"use client";

import { supabase } from "@/app/lib/supabase";
import { useEffect, useState } from "react";

const splash = ["Enjoy some tunes dawg.", "Stream No Punctuation!", "Wanna create a playlist?", "Anything fun tonight?", "I'm in your walls."]

export default function WelcomeMessage () {
    const [displayName, setDisplayName] = useState("");
    const [random, setRandom] = useState("")

    useEffect(() => {
        async function LoadUser() {
            const { data } = await supabase.auth.getUser()
            const meta = data.user?.user_metadata;
            setDisplayName(meta?.display_name || "Newcomer")
            setRandom(splash[Math.floor(Math.random() * splash.length)])
        }
        LoadUser()
    }, [])
    
    return (
        <>
            <h1 className="pt-15 font-display italic font-light text-8xl" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 0, "WONK" 1' }}>Good day, {displayName}!</h1>
            <p className="pt-5 text-xl font-sans text-mute">{random}</p>
        </>
        
    )
}