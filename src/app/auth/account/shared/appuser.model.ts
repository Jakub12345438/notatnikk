export interface AppUser{
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    enabled: boolean;
}

export interface AppUserDTO{
    id?: number;
    firstName?: string;
    lastName?: string;
    username?: string;
    enabled?: boolean;
}