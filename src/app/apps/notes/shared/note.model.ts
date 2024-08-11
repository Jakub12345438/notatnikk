import {AppUser} from "../../../auth/account/shared/appuser.model";

export interface Note{
    id: number;
    shortDesc: string
    title: string;
    content: string;
    createdAt: string;
    updatedAt?: string;
    contributors: AppUser[];
    owner: any;
}