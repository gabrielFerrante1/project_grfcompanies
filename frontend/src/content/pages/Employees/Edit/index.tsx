import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react'
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Button, Container, Grid, LinearProgress, TextField, Autocomplete, Snackbar } from '@mui/material';
import { api } from 'src/utils/api';
import { useAuth } from 'src/utils/auth';
import type { ApiGetOneEmployee, Employee } from 'src/models/Employee';
import { Router, useNavigate, useParams, useRoutes } from 'react-router';
import Chip from '@mui/material/Chip';
import type { Groups, ApiGetGroupsCompanie } from 'src/models/Group';

const EmployeeEdit = () => {
    const [loadingAPI, setLoadingAPI] = useState(true);
    const [employeeData, setEmployeeData] = useState<Employee | null>(null)
    const [groupsCompanie, setGroupsCompanie] = useState<Groups[]>([])

    const { user, checkPermission } = useAuth()
    const { id } = useParams();
    const navigate = useNavigate();

    const loadDataEmployee = async () => {
        const res = await api<ApiGetOneEmployee>(`companies/employees/${id}`, 'get', {}, user.auth.jwt_access)

        setEmployeeData(res.data);

        setLoadingAPI(false)
    }

    const loadGroupsOfCompanie = async () => {
        const res = await api<ApiGetGroupsCompanie>(`companies/groups`, 'get', {}, user.auth.jwt_access)

        if (!res.errorCode) setGroupsCompanie(res.data.groups)
    }

    const handleEdit = async () => {
        const { name, email } = employeeData
        const groups = (employeeData.groups.map((item) => item.id)).join(',')

        setLoadingAPI(true)
        await api(`companies/employees/${id}`, 'put', { name, email, groups }, user.auth.jwt_access)
        setLoadingAPI(false)

        navigate('/employees')
    }

    const defaultGroups = () => {
        let gp = []
        employeeData.groups.forEach(iE => { gp.push(groupsCompanie.find(i => i.id == iE.id)) })
        return gp
    }

    useEffect(() => {
        loadDataEmployee();
        loadGroupsOfCompanie()
    }, [])

    return (
        <>
            <Helmet>
                <title>Editar um funcionário</title>
            </Helmet>

            {loadingAPI && <LinearProgress sx={{ height: 2 }} color="primary" />}

            <PageTitleWrapper>
                <PageTitle
                    heading="Editar um funcionário"
                    subHeading="Edite um funcionário e altere nome, email,  grupos, permissões e etc"
                />
            </PageTitleWrapper>

            {checkPermission('change_employee') && employeeData ?
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

                        {groupsCompanie.length >= 1 &&
                            <Autocomplete
                                multiple
                                sx={{ mt: 3 }}
                                options={groupsCompanie}
                                getOptionLabel={(option) => typeof option == 'string' ? '' : option.name}
                                defaultValue={defaultGroups()}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            key={option.id}
                                            variant="filled"
                                            label={option.name}
                                            size="small"
                                            {...getTagProps({ index })}
                                        />
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Grupos do funcionário"
                                        placeholder="Escolher grupos"
                                    />
                                )}
                                onChange={(event, value) => setEmployeeData({ ...employeeData, groups: value })}
                            />

                        }
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

export default EmployeeEdit;
