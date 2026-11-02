import { LayoutGrid } from "lucide-react";
import type { Dictionary } from "@/i18n/types";
import CreateBoardForm from "./CreateBoardForm";

export default function DashboardEmptyState({ dict }: { dict: Dictionary['dashboard_index'] }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-4 py-14 text-center md:py-20">
            <div className="mb-5 grid h-14 w-14 place-items-center rounded-xl bg-[#FFF0E8] text-[#FF5C00]">
                <LayoutGrid className="h-7 w-7" aria-hidden="true" />
            </div>
            <h2 className="max-w-sm font-heading text-xl font-bold tracking-tight text-foreground md:text-2xl">
                {dict.empty_title}
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground md:text-base">
                {dict.empty_subtitle}
            </p>
            <CreateBoardForm dict={dict} autoFocus className="mt-6 max-w-md" />
        </div>
    );
}
