import { createClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_DATA_API
const key = process.env.NEXT_PUBLIC_SUPABASE_API_KEY

if (!url || !key) {
    throw new Error("Missing supabase environment variables!")
}

export const supabase = createClient(url, key)