import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/i18n/types";
import { createBoard } from "./actions";
import CreateBoardSubmit from "./CreateBoardSubmit";

export default function CreateBoardForm({
    dict,
    className,
    autoFocus = false,
}: {
    dict: Dictionary['dashboard_index'];
    className?: string;
    autoFocus?: boolean;
}) {
    return (
        <form action={createBoard} className={cn("flex w-full gap-2", className)}>
            <Input
                name="name"
                aria-label={dict.new_board_label}
                placeholder={dict.new_board_ph}
                required
                maxLength={80}
                autoComplete="off"
                autoFocus={autoFocus}
                className="min-w-0 flex-1"
            />
            <CreateBoardSubmit label={dict.create_btn} pendingLabel={dict.creating} />
        </form>
    );
}
