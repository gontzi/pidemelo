import { pgTable, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum('status', ['pending', 'planned', 'done']);

export const boards = pgTable('boards', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').notNull(), // Clerk User ID
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const ideas = pgTable('ideas', {
    id: uuid('id').primaryKey().defaultRandom(),
    boardId: uuid('board_id').references(() => boards.id, { onDelete: 'cascade' }).notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    status: statusEnum('status').default('pending').notNull(),
    authorFingerprint: text('author_fingerprint').default('').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const votes = pgTable('votes', {
    id: uuid('id').primaryKey().defaultRandom(),
    ideaId: uuid('idea_id').references(() => ideas.id, { onDelete: 'cascade' }).notNull(),
    anonymousFingerprint: text('anonymous_fingerprint').notNull(), // Hash de IP o Cookie para votos anónimos
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

import { relations } from 'drizzle-orm';

export const boardsRelations = relations(boards, ({ many }) => ({
    ideas: many(ideas),
}));

export const ideasRelations = relations(ideas, ({ one, many }) => ({
    board: one(boards, {
        fields: [ideas.boardId],
        references: [boards.id],
    }),
    votes: many(votes),
}));

export const votesRelations = relations(votes, ({ one }) => ({
    idea: one(ideas, {
        fields: [votes.ideaId],
        references: [ideas.id],
    }),
}));
