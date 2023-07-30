import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserWithInfos } from "src/models/Auth";


const userDefault = { id: 0, name: '', email: '', enterprise: { permissions: [], is_owner: false }, auth: { jwt_access: '' } }

export const authReducer = createSlice({
    name: 'auth',
    initialState: {
        user: userDefault as UserWithInfos
    },
    reducers: {
        setUser: (state, action: PayloadAction<UserWithInfos>) => {
            state.user = action.payload
        },
        setClearUser: (state) => {
            state.user = userDefault
        }
    }
})

export const { setUser, setClearUser } = authReducer.actions

export default authReducer.reducer
