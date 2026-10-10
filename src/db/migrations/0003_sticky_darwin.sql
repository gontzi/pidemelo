CREATE INDEX "boards_user_id_idx" ON "boards" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ideas_board_id_idx" ON "ideas" USING btree ("board_id");--> statement-breakpoint
CREATE INDEX "ideas_tag_id_idx" ON "ideas" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "tags_board_id_idx" ON "tags" USING btree ("board_id");--> statement-breakpoint
CREATE INDEX "votes_idea_id_idx" ON "votes" USING btree ("idea_id");--> statement-breakpoint
DELETE FROM "votes" a USING "votes" b WHERE a."idea_id" = b."idea_id" AND a."anonymous_fingerprint" = b."anonymous_fingerprint" AND a."created_at" > b."created_at";--> statement-breakpoint
CREATE UNIQUE INDEX "votes_idea_fingerprint_unique" ON "votes" USING btree ("idea_id","anonymous_fingerprint");