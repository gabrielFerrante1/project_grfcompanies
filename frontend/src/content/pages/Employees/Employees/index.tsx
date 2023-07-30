import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react'
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Container } from '@mui/material';
import TableEmployees from 'src/components/Employees/TableEmployees';
import { api } from 'src/utils/api';
import { useAuth } from 'src/utils/auth';
import { ApiGetEmployees, Employees } from 'src/models/Employee';

const EmployeesPage = () => {
    const [loadingAPI, setLoadingAPI] = useState(true);
    const [employees, setEmployees] = useState<Employees[]>([])

    const { user } = useAuth()

    const loadEmployees = async () => {
        const res = await api<ApiGetEmployees>('companies/employees', 'get', {}, user.auth.jwt_access)

        setEmployees(res.data.employees)
        setLoadingAPI(false)
    }

    useEffect(() => { loadEmployees() }, [])

    return (
        <>
            <Helmet>
                <title>Funcionários</title>
            </Helmet>
            <PageTitleWrapper>
                <PageTitle
                    heading="Funcionários"
                    subHeading="Consulte os funcionários da empresa e execute ações em cada funcionário"
                />
            </PageTitleWrapper>

            <Container maxWidth="xl" sx={{
                opacity: loadingAPI ? 0 : 1,
                marginX: loadingAPI ? '-10%' : 0,
                transition: 'all .5s'
            }}>
                <TableEmployees
                    refreshList={loadEmployees}
                    employeesList={employees}
                />
            </Container>
        </>
    )
}

export default EmployeesPage;