// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			jwt?: string;
			user?: {
				displayName: string;
				email: string;
				nicename: string;
				roles: string[];
				isAdmin: boolean;
				userMeta: Record<string, any>;
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
