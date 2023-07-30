export type User = {
    id: number;
    name: string;
    email: string;
}

type UserPermission = {
    id: number;
    label: string;
    codename: string;
}

type UserEnterprise = {
    is_owner: boolean;
    permissions: UserPermission[]
}

export type UserWithInfos = {
    id: number;
    name: string;
    email: string;
    enterprise: UserEnterprise;
    auth: {
        jwt_access: string
    }

}

export type ApiSigin = {
    user: User,
    enterprise: UserEnterprise,
    refresh: string,
    access: string
}

export type ApiGetAuthentication = {
    user: User,
    enterprise: UserEnterprise
}