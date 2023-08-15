import { Permission } from "./Permission";

export type Groups = {
    id: number;
    name: string;
}

export type Group = {
    id: number;
    name: string;
    permissions: Permission[]
}


export type ApiGetOneGroup = {
    group: Group
}

export type ApiGetGroupsCompanie = {
    groups: Groups[]
}