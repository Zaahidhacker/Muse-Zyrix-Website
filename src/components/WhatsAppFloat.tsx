import { CONTACT } from "@/lib/content";

export default function WhatsAppFloat() {
  return (
    <a
      href={CONTACT.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Zyrix on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-navy shadow-[0_8px_24px_rgba(130,176,219,0.35)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 active:scale-[0.98]"
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5Z"
          fill="currentColor"
        />
        {/* Dots in the button's own yellow (the --p-accent token):
            negative-space chat dots punched out of the navy bubble. */}
        <circle cx="8" cy="12" r="1.3" fill="var(--p-accent)" />
        <circle cx="12" cy="12" r="1.3" fill="var(--p-accent)" />
        <circle cx="16" cy="12" r="1.3" fill="var(--p-accent)" />
      </svg>
    </a>
  );
}
