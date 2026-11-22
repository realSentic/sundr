import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      <div>
        <h1 className="pt-15 font-display italic font-light text-8xl" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 0, "WONK" 1' }}>Good evening.</h1>
        <p className="pt-5 text-xl font-sans text-mute">Enjoy some tunes, dawg.</p>
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className="font-display italic font-light text-4xl" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 0, "WONK" 1' }}>Recently played</h3>
        <span className="font-mono text-xs uppercase tracking-widest text-mute"><Link href="#">See all →</Link></span>
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className="font-display italic font-light text-4xl" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 0, "WONK" 1' }}>Trending</h3>
        <span className="font-mono text-xs uppercase tracking-widest text-mute"><Link href="#">See all →</Link></span>
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className="font-display italic font-light text-4xl" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 0, "WONK" 1' }}>Challenges</h3>
        <span className="font-mono text-xs uppercase tracking-widest text-mute"><Link href="#">See all →</Link></span>
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className="font-display italic font-light text-4xl" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 0, "WONK" 1' }}>Browse Genre</h3>
        <span className="font-mono text-xs uppercase tracking-widest text-mute"><Link href="#">See all →</Link></span>
      </div>
    </div>
  )
}