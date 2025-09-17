CREATE TABLE "links" (
	"id" text PRIMARY KEY NOT NULL,
	"original_url" varchar(2048) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"access_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "links_slug_unique" UNIQUE("slug")
);
