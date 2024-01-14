import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/redux/store'
import { api } from './api'
import { setClearUser, setUser } from 'src/redux/reducers/authReducer'
import { ApiGetAuthentication, ApiSigin } from 'src/models/Auth'

const localStorageItem = 'AUTH_ACCESS'

export const useAuth = () => {
    const auth = useSelector((state: RootState) => state.auth)

    const dispatch = useDispatch()

    const checkPermission = (permissionCodename: string) => {
        if (auth.user.enterprise.is_owner) return true;
      
        return auth.user.enterprise.permissions.some(e => e.codename == permissionCodename)
    }

    const checkAuthentication = async () => {
        const accessToken = localStorage.getItem(localStorageItem);

        const response = await api<ApiGetAuthentication>('auth/user', 'get', {}, accessToken);

        if (response.errorCode) return 'not_authenticated'

        dispatch(setUser({
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            enterprise: {
                permissions: response.data.enterprise.permissions,
                is_owner: response.data.enterprise.is_owner
            },
            auth: {
                jwt_access: accessToken
            }
        }));

        return 'authenticated'
    }

    const signIn = async (email: string, password: string) => {
        const response = await api<ApiSigin>('auth/login', 'post', { email, password });

        if (!response.errorCode) {
            dispatch(setUser({
                id: response.data.user.id,
                name: response.data.user.name,
                email: response.data.user.email,
                enterprise: {
                    permissions: response.data.enterprise.permissions,
                    is_owner: response.data.enterprise.is_owner
                },
                auth: {
                    jwt_access: response.data.access
                }
            }));

            localStorage.setItem(localStorageItem, response.data.access)
        }

        return response.errorCode ? false : true
    }

    const signOut = () => {
        dispatch(setClearUser())
        localStorage.removeItem(localStorageItem)
    }

    return {
        isLogged: auth.user.id > 0,
        user: auth.user,
        checkPermission,
        checkAuthentication,
        signIn,
        signOut
    }
}
