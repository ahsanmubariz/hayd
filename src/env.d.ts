/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user?: {
      id: string;
      email: string;
      role: 'admin' | 'user';
    };
    session?: {
      id: string;
      userId: string;
      expiresAt: string;
    };
  }
}

interface ImportMetaEnv {
  readonly DATABASE_URL?: string;
  readonly SESSION_SECRET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
