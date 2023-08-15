import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react'
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Button, Container, Grid, LinearProgress, TextField, Snackbar } from '@mui/material';
import { api } from 'src/utils/api';
import { useAuth } from 'src/utils/auth';
import type { Employee } from 'src/models/Employee';
import type { Groups, ApiGetGroupsCompanie } from 'src/models/Group';

type EmployeeData = Employee & { password: string }

const EmployeeAdd = () => {
    const [snackbar, setSnackbar] = useState('')
    const [loadingAPI, setLoadingAPI] = useState(false);
    const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null)
    const [groupsCompanie, setGroupsCompanie] = useState<Groups[]>([])

    const { user, checkPermission } = useAuth()

    const loadGroupsOfCompanie = async () => {
        const res = await api<ApiGetGroupsCompanie>(`companies/groups`, 'get', {}, user.auth.jwt_access)

        if (!res.errorCode) setGroupsCompanie(res.data.groups)
    }

    const handleAdd = async () => {
        if (!employeeData) {
            setSnackbar('Preencha todos os campos')
            return;
        }

        const { name, email, password } = employeeData

        setLoadingAPI(true)
        const response = await api(`companies/employees`, 'post', { name, email, password }, user.auth.jwt_access)
        if (response.errorCode != '') {
            setSnackbar('Não foi possível criar esta conta')
        }
        setLoadingAPI(false)
    }


    useEffect(() => {
        loadGroupsOfCompanie()
    }, [])

    return (
        <>
            <Helmet>
                <title>Adicionar um funcionário</title>
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
                    heading="Adicionar um funcionário"
                    subHeading="Adicione um funcionário e configure seu nome, email, senha, grupos, permissões e etc"
                />
            </PageTitleWrapper>

            {checkPermission('add_employee') &&
                <Container maxWidth="lg">
                    <Grid maxWidth={700}>
                        <TextField
                            autoFocus
                            required
                            label="Nome"
                            value={employeeData ? employeeData.name : ''}
                            onChange={loadingAPI ? () => null : e => setEmployeeData({ ...employeeData, name: e.target.value })}
                            fullWidth
                            InputProps={{
                                readOnly: loadingAPI
                            }}
                        />
                        <TextField
                            required
                            label="Email"
                            value={employeeData ? employeeData.email : ''}
                            onChange={loadingAPI ? () => null : e => setEmployeeData({ ...employeeData, email: e.target.value })}
                            sx={{ mt: 3 }}
                            fullWidth
                            InputProps={{
                                readOnly: loadingAPI
                            }}
                        />
                        <TextField
                            required
                            label="Senha"
                            value={employeeData ? employeeData.password : ''}
                            onChange={loadingAPI ? () => null : e => setEmployeeData({ ...employeeData, password: e.target.value })}
                            sx={{ mt: 3 }}
                            fullWidth
                            InputProps={{
                                readOnly: loadingAPI
                            }}
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

export default EmployeeAdd;
