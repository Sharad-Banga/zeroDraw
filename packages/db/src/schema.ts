import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* =========================
   Users
========================= */

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  photo: text("photo").notNull(),
});

/* =========================
   Rooms
========================= */

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),

  adminId: uuid("admin_id")
    .notNull()
    .references(() => users.id),
});

/* =========================
   chats
========================= */

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),

  roomId: integer("room_id")
    .notNull()
    .references(() => rooms.id),

  message: text("message").notNull(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
});



/* =========================
   Relations
========================= */

export const usersRelations = relations(users, ({ many }) => ({
  rooms: many(rooms),
  chats: many(chats),
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  admin: one(users, {
    fields: [rooms.adminId],
    references: [users.id],
  }),
  chats: many(chats),
}));

export const chatsRelations = relations(chats, ({ one }) => ({
  room: one(rooms, {
    fields: [chats.roomId],
    references: [rooms.id],
  }),
  user: one(users, {
    fields: [chats.userId],
    references: [users.id],
  }),
}));