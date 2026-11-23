"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "@/app/lib/supabase";

const display = { fontVariationSettings: '"opsz" 144, "SOFT" 0, "WONK" 1' };

const SAVED = "Profile has been saved.";

export default function SettingsForm () {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<string | null>(null);
    const [userId, setUserId] = useState("")
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
            setUserId(data.user?.id ?? "")
            setEmail(data.user?.email ?? "")
            setDisplayName(meta?.display_name || "")
            setUsername(meta?.username || "")
            setAvatarUrl(meta?.avatar_url || "")
        }

        loadUser()
    }, [])

    // frees the temporary preview URL when it changes or the page closes
    useEffect(() => {
        return () => {
            if (avatarPreview) URL.revokeObjectURL(avatarPreview)
        }
    }, [avatarPreview])

    function handleAvatarChange (e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
            setStatus("Choose an image under 2MB.")
            return
        }

        setStatus(null)
        setAvatarFile(file)
        setAvatarPreview(URL.createObjectURL(file))
    }

    async function handleSavingProfile () {
        setSaving(true)
        setStatus(null)

        let newAvatarUrl = avatarUrl

        // 1. upload the new picture first (only if one was chosen)
        if (avatarFile) {
            const ext = avatarFile.name.split(".").pop()
            const path = `${userId}/avatar-${Date.now()}.${ext}`

            const { error: uploadError } = await supabase.storage.from("avatars").upload(path, avatarFile)

            if (uploadError) {
                setStatus(uploadError.message)
                setSaving(false)
                return
            }

            newAvatarUrl = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl
        }

        // 2. save everything in one go
        const { error } = await supabase.auth.updateUser({ data: { display_name: displayName.trim(), username: username.trim(), avatar_url: newAvatarUrl } })

        if (error) {
            setStatus(error.message)
        } else {
            setAvatarUrl(newAvatarUrl)
            setAvatarFile(null)
            setAvatarPreview("")
            setStatus(SAVED)
        }

        setSaving(false)
    }


    return (
        <div className="flex flex-col gap-6">
            <div>
                {status && <span className={status === SAVED ? "block bg-sage-base border border-sage text-sage-tint max-w-100 font-mono text-xs uppercase tracking-widest px-4 py-3" : "font-mono text-xs uppercase tracking-widest text-mute"}>{status}</span>}
            </div>

            <div className="flex flex-col gap-3">
                <span className="font-mono text-xs uppercase tracking-widest text-mute">Profile Picture</span>
                <div className="flex items-center gap-6">
                    <div className="size-24 shrink-0 overflow-hidden rounded-full border border-line bg-raised flex items-center justify-center font-display text-4xl text-mute">{(avatarPreview || avatarUrl) ? <Image src={avatarPreview || avatarUrl} alt="Your profile picture" width={96} height={96} unoptimized={!!avatarPreview} className="size-full object-cover" /> : (displayName || username || email).charAt(0).toUpperCase()}</div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="font-mono text-xs uppercase tracking-widest text-paper underline underline-offset-4 hover:text-mute transition-colors">Change photo</button>
                </div>
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
                <button type="button" disabled={saving} onClick={handleSavingProfile} className="self-start bg-paper text-ink font-mono text-xs uppercase tracking-widest px-6 py-3 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">{saving ? "Saving…" : "Confirm"}</button>
            </div>
        </div>
    )
}