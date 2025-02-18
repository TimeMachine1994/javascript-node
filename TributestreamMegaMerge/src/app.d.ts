// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			jwt_token?: string;
			user_id?: string;
			user?: {
				displayName: string;
				email: string;
				nicename: string;
				roles: string[];
				isAdmin: boolean;
				userMeta: Record<string, any>;
			};
			jwt?: string;
		 
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
