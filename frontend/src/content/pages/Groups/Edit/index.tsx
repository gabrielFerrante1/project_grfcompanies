import { Button, Container, Grid, LinearProgress, Snackbar, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router';
import PermissionsOptions from 'src/components/Groups/PermissionsOptions';
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import type { ApiGetOneGroup } from 'src/models/Group';
import { api } from 'src/utils/api';
import { useAuth } from 'src/utils/auth';

const GroupEdit = () => {
    const [snackbar, setSnackbar] = useState('')
    const [loadingAPI, setLoadingAPI] = useState(true);
    const [inputName, setInputName] = useState('')
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])

    const { user, checkPermission } = useAuth()
    const { id } = useParams();
    const navigate = useNavigate();

    const loadDataGroup = async () => {
        const { data } = await api<ApiGetOneGroup>(`companies/groups/${id}`, 'get', {}, user.auth.jwt_access)

        let defaultArray = []

        data.group.permissions.forEach((item) => defaultArray.push(item.id))

        setSelectedPermissions(defaultArray)
        setInputName(data.group.name)

        setLoadingAPI(false)
    }

    const handleEdit = async () => {
        const name = inputName

        if (!name) {
            setSnackbar('Preencha todos os campos')
            return;
        }

        setLoadingAPI(true)
        await api(`companies/groups/${id}`, 'put', {
            name,
            permissions: selectedPermissions.join(',')
        }, user.auth.jwt_access)

        navigate('/groups')
    }

    useEffect(() => {
        loadDataGroup();
    }, [])

    return (
        <>
            <Helmet>
                <title>Editar um cargo</title>
            </Helmet>

            <Snackbar
                open={snackbar != ''}
                autoHideDuration={6000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                message={snackbar}
            />

            {loadingAPI && <LinearProgress sx={{ height: 2 }} color="primary" />}

            <PageTitleWrapper>
                <PageTitle
                    heading="Editar um cargo"
                    subHeading="Edite um cargo e altere nome e permissões"
                />
            </PageTitleWrapper>

            {checkPermission('change_group') ?
                <Container maxWidth="lg">
                    <Grid maxWidth={700}>
                        <TextField
                            autoFocus
                            required
                            label="Nome"
                            value={inputName}
                            onChange={loadingAPI ? () => null : e => setInputName(e.target.value)}
                            fullWidth
                            InputProps={{
                                readOnly: loadingAPI
                            }}
                        />

                        <PermissionsOptions
                            selectedPermissions={selectedPermissions}
                            setSelectedPermissions={setSelectedPermissions}
                        />

                        <Button
                            variant='outlined'
                            sx={{ width: 90, mt: 3.4 }}
                            onClick={loadingAPI ? () => null : handleEdit}
                            disabled={loadingAPI}
                        >Editar</Button>
                    </Grid>
                </Container>
                : ''}

        </>
    )
}

export default GroupEdit;
