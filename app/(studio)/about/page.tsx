import { DeskDoodle } from "@/components/desk-doodle";
import { messages } from "@/lib/messages";
import { getLocale } from "@/lib/session";

export default async function AboutPage() {
  const locale = await getLocale();
  const t = messages[locale];

  return (
    <div className="grid gap-12 py-10 md:grid-cols-2">
      <div className="space-y-5">
        <h1 className="font-heading text-4xl">{t.aboutTitle}</h1>
        <p className="leading-7 text-muted-foreground">{t.aboutBody}</p>
        <p className="leading-7 text-muted-foreground">{t.credit}</p>
        <p className="text-sm text-muted-foreground">{t.demoHint}</p>
        <a
          className="inline-block text-sm underline underline-offset-4"
          href="https://github.com/aws-samples/aws-mlu-explain"
          target="_blank"
          rel="noreferrer"
        >
          aws-samples/aws-mlu-explain
        </a>
      </div>
      <DeskDoodle className="max-w-sm text-foreground" />
    </div>
  );
}
