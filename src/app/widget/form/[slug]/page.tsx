import { db } from "@/db";
import { boards } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import SubmitIdeaForm from "../../../board/[slug]/SubmitIdeaForm";
import { getDictionary } from "@/i18n";
import { getWidgetTheme, type WidgetSearchParams, type WidgetTheme } from "@/lib/widget-theme";
import { Suspense } from "react";
import WidgetSkeleton from "@/components/WidgetSkeleton";
import WidgetShell, { WidgetFrame } from "../../WidgetShell";

export const dynamic = 'force-dynamic';

export default function WidgetFormPage({
    params,
    searchParams
}: {
    params: { slug: string },
    searchParams: WidgetSearchParams
}) {
    const theme = getWidgetTheme(searchParams);

    return (
        <WidgetFrame theme={theme}>
            <Suspense fallback={<WidgetSkeleton variant="form" />}>
                <FormContent slug={params.slug} theme={theme} />
            </Suspense>
        </WidgetFrame>
    );
}

async function FormContent({ slug, theme }: { slug: string; theme: WidgetTheme }) {
    const t = await getDictionary(theme.lang);

    const board = await db.query.boards.findFirst({
        where: eq(boards.slug, slug),
        with: { tags: true },
    });

    if (!board) notFound();

    return (
        <WidgetShell
            theme={theme}
            title={t.widget_page.form_title}
            subtitle={t.widget_page.form_subtitle.replace('%s', board.name)}
            footerLink={{ href: `https://pidemelo.app/board/${board.slug}`, label: t.widget_page.see_all }}
            poweredBy={t.public_board_client.powered_by}
        >
            <SubmitIdeaForm
                boardId={board.id}
                boardSlug={board.slug}
                dict={t.submit_idea_form}
                imageDict={t.image_upload}
                tags={board.tags}
            />
        </WidgetShell>
    );
}
