import SettingsForm from "@/app/components/site-comp/settings-form";

const display = { fontVariationSettings: '"opsz" 144, "SOFT" 0, "WONK" 1' };

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-20 pb-20 max-w-6xl mx-auto w-full">
      <div>
        <h1 className="pt-15 font-display italic font-light text-8xl" style={display}>
          Settings.
        </h1>
        <p className="pt-5 text-xl font-sans text-mute">Make it yours.</p>
      </div>

      <SettingsForm />
    </div>
  );
}