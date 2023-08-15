export type Permission = {
    id: number,
    name: string,
    codename: string
}

export type ApiGetPermissions = {
    permissions: Permission[]
}