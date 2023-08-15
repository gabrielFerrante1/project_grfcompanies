import styled from '@emotion/styled';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ApiGetPermissions, Permission } from 'src/models/Permission';
import { RootState } from 'src/redux/store';
import { api } from 'src/utils/api';
import { useAuth } from 'src/utils/auth';

type Props = {
    selectedPermissions: number[],
    setSelectedPermissions: (id: number[]) => void
}

const PermissionsContainer = styled.div`
    margin-top: 30px;
    margin-left: 4px;
    user-select: none;
`;

const PermissionsLabel = styled.span`
    display: block;
    font-weight: 600;
    font-size: 16.5px;
    margin-bottom: 5px;
`;

export default ({ selectedPermissions, setSelectedPermissions }: Props) => {
    const { user } = useAuth()

    const [loading, setLoading] = useState(true)
    const [permissions, setPermissions] = useState<Permission[]>([])


    const handleChange = (ev: ChangeEvent<HTMLInputElement>, permission_id: number) => {
        const { checked } = ev.target;

        if (checked) {
            setSelectedPermissions([...selectedPermissions, permission_id])
        } else {
            setSelectedPermissions(selectedPermissions.filter(fId => fId != permission_id))
        }
    }

    useEffect(() => {
        const getPermissions = async () => {
            const permissions = await api<ApiGetPermissions>('companies/permissions', 'get', {}, user.auth.jwt_access)

            setPermissions(permissions.data.permissions)
            setLoading(false)
        }

        getPermissions();
    }, [])

    return (
        <PermissionsContainer>
            <PermissionsLabel>Permissões do cargo:</PermissionsLabel>

            {!loading &&
                <FormGroup>
                    {permissions.map((value, key) => (
                        <FormControlLabel
                            key={key}
                            control={
                                <Checkbox
                                    checked={selectedPermissions.find((id) => id == value.id) != undefined}
                                    onChange={e => handleChange(e, value.id)}
                                />
                            }
                            label={value.name}
                        />
                    ))}
                </FormGroup>
            }
        </PermissionsContainer>
    )
}