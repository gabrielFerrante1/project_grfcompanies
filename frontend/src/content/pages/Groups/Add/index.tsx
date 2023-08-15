import { Button, Container, Grid, LinearProgress, Snackbar, TextField } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import PermissionsOptions from 'src/components/Groups/PermissionsOptions';
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { api } from 'src/utils/api';
import { useAuth } from 'src/utils/auth';


const GroupAdd = () => {
    const [snackbar, setSnackbar] = useState('')
    const [loadingAPI, setLoadingAPI] = useState(false);
    const [inputName, setInputName] = useState('') 
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])

    const { user, checkPermission } = useAuth()

    const navigate = useNavigate()
 
    const handleAdd = async () => {
        const name = inputName

        if (!name) {
            setSnackbar('Preencha todos os campos')
            return;
        }

        setLoadingAPI(true)
        await api('companies/groups', 'post', {
            name,
            permissions: selectedPermissions.join(',')
        }, user.auth.jwt_access)

        navigate('/groups')
    }
 
    return (
        <>
            <Helmet>
                <title>Adicionar um cargo</title>
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
                    heading="Adicionar um cargo"
                    subHeading="Adicione um cargo e configure seu nome e suas permissões"
                />
            </PageTitleWrapper>

            {checkPermission('add_group') &&
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
                            onClick={loadingAPI ? () => null : handleAdd}
                            disabled={loadingAPI}
                        >Adicionar</Button>
                    </Grid>
                </Container>
            }

        </>
    )
}

export default GroupAdd;
