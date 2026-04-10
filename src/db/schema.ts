import { pgTable, text, timestamp, uuid, pgEnum, boolean } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum('status', ['en_revision', 'planeado', 'en_progreso', 'completado', 'descartado', 'archivado']);

export const users = pgTable('users', {
    id: text('id').primaryKey(), // Clerk User ID
    email: text('email'),
    name: text('name'),
    isPremium: boolean('is_premium').default(false).notNull(),
    plan: text('plan'), // 'pro' | 'lifetime' | null
    subscriptionId: text('subscription_id'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const boards = pgTable('boards', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(), // Clerk User ID
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    notifyNewIdeas: boolean('notify_new_ideas').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tags = pgTable('tags', {
    id: uuid('id').primaryKey().defaultRandom(),
    boardId: uuid('board_id').references(() => boards.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    color: text('color').default('#FF5C00').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const ideas = pgTable('ideas', {
    id: uuid('id').primaryKey().defaultRandom(),
    boardId: uuid('board_id').references(() => boards.id, { onDelete: 'cascade' }).notNull(),
    tagId: uuid('tag_id').references(() => tags.id, { onDelete: 'set null' }),
    title: text('title').notNull(),
    description: text('description').notNull(),
    status: statusEnum('status').default('en_revision').notNull(),
    authorFingerprint: text('author_fingerprint').default('').notNull(),
    imageUrl: text('image_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const votes = pgTable('votes', {
    id: uuid('id').primaryKey().defaultRandom(),
    ideaId: uuid('idea_id').references(() => ideas.id, { onDelete: 'cascade' }).notNull(),
    anonymousFingerprint: text('anonymous_fingerprint').notNull(), // Hash de IP o Cookie para votos anónimos
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

import { relations } from 'drizzle-orm';

export const usersRelations = relations(users, ({ many }) => ({
    boards: many(boards),
}));

export const boardsRelations = relations(boards, ({ one, many }) => ({
    user: one(users, {
        fields: [boards.userId],
        references: [users.id],
    }),
    ideas: many(ideas),
    tags: many(tags),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
    board: one(boards, {
        fields: [tags.boardId],
        references: [boards.id],
    }),
    ideas: many(ideas),
}));

export const ideasRelations = relations(ideas, ({ one, many }) => ({
    board: one(boards, {
        fields: [ideas.boardId],
        references: [boards.id],
    }),
    tag: one(tags, {
        fields: [ideas.tagId],
        references: [tags.id],
    }),
    votes: many(votes),
}));

export const votesRelations = relations(votes, ({ one }) => ({
    idea: one(ideas, {
        fields: [votes.ideaId],
        references: [ideas.id],
    }),
}));

