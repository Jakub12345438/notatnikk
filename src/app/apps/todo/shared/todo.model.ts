import {AppUser} from "../../../auth/account/shared/appuser.model";

export interface Todo {
    id?: number;
    title?: string;
    shortDesc?: string;
    content: string;
    contributors: AppUser[];
    creator: AppUser;
    lastUpdatedBy: AppUser;
    createdAt: string;
    updatedAt: string;
    startDate: string;
    endDate: string;
}
