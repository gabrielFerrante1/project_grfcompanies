import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react'
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Container } from '@mui/material';
import TableGroups from 'src/components/Groups/TableGroups';
import { api } from 'src/utils/api';
import { useAuth } from 'src/utils/auth';
import { ApiGetGroupsCompanie, Groups } from 'src/models/Group';

const GroupsPage = () => {
    const [loadingAPI, setLoadingAPI] = useState(true);
    const [groups, setGroups] = useState<Groups[]>([])

    const { user } = useAuth()

    const loadGroups = async () => {
        const res = await api<ApiGetGroupsCompanie>('companies/groups', 'get', {}, user.auth.jwt_access)

        setGroups(res.data.groups)
        setLoadingAPI(false)
    }

    useEffect(() => { loadGroups() }, [])

    return (
        <>
            <Helmet>
                <title>Cargos</title>
            </Helmet>
            <PageTitleWrapper>
                <PageTitle
                    heading="Cargos"
                    subHeading="Consulte os cargos da sua empresa e execute ações em cada cargo"
                />
            </PageTitleWrapper>

            <Container maxWidth="xl" sx={{
                opacity: loadingAPI ? 0 : 1,
                marginX: loadingAPI ? '-10%' : 0,
                transition: 'all .5s'
            }}>
                <TableGroups
                    refreshList={loadGroups}
                    groupsList={groups}
                />
            </Container>
        </>
    )
}

export default GroupsPage;