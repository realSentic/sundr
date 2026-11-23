"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function SettingsForm () {
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<string | null>(null);
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");

    const [avatarUrl, setAvatarUrl] = useState("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState("");

    useEffect(() => {
        async function loadUser() {
            const { data } = await supabase.auth.getUser()
            const meta = data.user?.user_metadata;
            setEmail(data.user?.email ?? "")
            setDisplayName(meta?.display_name || "")
            setUsername(meta?.username || "")
        }

        loadUser()
    }, [])
    
    useEffect(() => {
        return () => {
            if (avatarPreview) URL.revokeObjectURL(avatarPreview)
        }
    }, [avatarPreview])

    function handleAvatarProfile (e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
            setStatus("Set an image under 2MB.")
            return
        }

        setStatus(null)
        setAvatarFile(file)
        setAvatarPreview(URL.createObjectURL(file))
    }

    async function handleSavingProfile () {
        setSaving(true)
        setStatus(null)

        const { error } = await supabase.auth.updateUser({ data: { display_name: displayName.trim(), username: username.trim() } })

        setStatus(error ? error.message : "Profile has been saved.")
        setSaving(false)
    }


    return (
        <div className="flex flex-col gap-6">
            <div>
                {status && <span className={status === "Profile has been saved." ? "block bg-sage-base border border-sage text-sage-tint max-w-100 font-mono text-xs uppercase tracking-widest px-4 py-3" : "font-mono text-xs uppercase tracking-widest text-mute"}>{status}</span>}
            </div>

            <div className="flex flex-col gap-3">
                <span className="font-mono text-xs uppercase tracking-widest text-mute">Display Name</span>
                <input type="text" value={displayName} onChange={(e) => {setDisplayName(e.target.value)}} className="w-full max-w-md bg-raised text-paper font-sans text-lg px-4 py-3 border border-line placeholder:text-dim focus:outline-none focus:border-paper transition-colors"/>
                
            </div>

            <div className="flex flex-col gap-3">
                <span className="font-mono text-xs uppercase tracking-widest text-mute">Email</span>
                <input type="text" value={email} onChange={(e) => {setEmail(e.target.value)}} className="w-full max-w-md bg-raised text-paper font-sans text-lg px-4 py-3 border border-line placeholder:text-dim focus:outline-none focus:border-paper transition-colors"/>
            </div>

            <div className="flex flex-col gap-3">
                <span className="font-mono text-xs uppercase tracking-widest text-mute">Username</span>
                <input type="text" value={username} onChange={(e) => {setUsername(e.target.value)}} className="w-full max-w-md bg-raised text-paper font-sans text-lg px-4 py-3 border border-line placeholder:text-dim focus:outline-none focus:border-paper transition-colors"/>
            </div>

            <div>
                <button type="submit" disabled={saving} onClick={handleSavingProfile} className="self-start bg-paper text-ink font-mono text-xs uppercase tracking-widest px-6 py-3 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">Confirm</button>
            </div>
        </div>
    )
}