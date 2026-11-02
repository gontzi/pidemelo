import { notFound } from "next/navigation";
import { Panel } from "@/components/ui/panel";
import { getDictionary } from "@/i18n";
import { getOwnedBoard } from "../data";
import TagsManager from "../TagsManager";
import { DangerZone, GeneralSettingsForm, NotifyToggle } from "./BoardSettingsForms";

export const dynamic = 'force-dynamic';

function Section({ title, description, children, danger = false }: {
    title: string;
    description?: string;
    children: React.ReactNode;
    danger?: boolean;
}) {
    return (
        <Panel tone="card" padding="none" className={danger ? 'border-destructive/30' : undefined}>
            <div className="grid gap-4 p-4 md:grid-cols-[220px_1fr] md:gap-8 md:p-6">
                <div className="space-y-1">
                    <h2 className={`font-heading text-base font-bold ${danger ? 'text-destructive' : 'text-foreground'}`}>{title}</h2>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
                <div className="min-w-0">{children}</div>
            </div>
        </Panel>
    );
}

export default async function BoardSettingsPage({ params }: { params: { id: string } }) {
    const t = await getDictionary();
    const board = await getOwnedBoard(params.id);
    if (!board) notFound();

    const dict = t.board_settings;

    return (
        <div className="space-y-4 md:space-y-6">
            <Section title={dict.general_title} description={dict.general_desc}>
                <GeneralSettingsForm boardId={board.id} name={board.name} slug={board.slug} dict={dict} errors={t.errors} />
            </Section>

            <Section title={dict.notify_title}>
                <NotifyToggle boardId={board.id} initial={board.notifyNewIdeas} dict={dict} />
            </Section>

            <Section title={dict.tags_title} description={dict.tags_desc}>
                <TagsManager boardId={board.id} tags={board.tags} dict={dict} errors={t.errors} />
            </Section>

            <Section title={dict.danger_zone} danger>
                <DangerZone boardId={board.id} dict={dict} />
            </Section>
        </div>
    );
}
