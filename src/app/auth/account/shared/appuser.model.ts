export interface AppUser{
    id: number;
    firstName: string;
    lastName?: string;
    username: string;
    enabled: boolean;
}