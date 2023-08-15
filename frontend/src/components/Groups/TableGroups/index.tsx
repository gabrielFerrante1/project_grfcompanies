import {
    Tooltip,
    Container,
    Card,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Typography,
    useTheme
} from '@mui/material';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { Employees } from 'src/models/Employee';
import { useAuth } from 'src/utils/auth';
import { api } from 'src/utils/api';
import { useNavigate } from 'react-router';
import { Groups } from 'src/models/Group';

type Props = {
    groupsList: Groups[],
    refreshList: () => void
}

const GroupsTable = ({ groupsList, refreshList }: Props) => {
    const { user, checkPermission } = useAuth();

    const theme = useTheme();
    const navigate = useNavigate()

    const handleEditGroup = (id: number) => {
        navigate(`/groups/edit/${id}`)
    }

    const handleDeleteGroup = async (id: number) => {
        await api(`companies/groups/${id}`, 'delete', {}, user.auth.jwt_access)

        refreshList()
    }

    return (
        <Container maxWidth='lg'>
            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nome</TableCell>
                                <TableCell align="right">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {groupsList.map((employee) => {
                                return (
                                    <TableRow hover key={employee.id}>
                                        <TableCell>
                                            <Typography
                                                variant="body1"
                                                fontWeight="bold"
                                                color="text.primary"
                                                gutterBottom
                                                noWrap
                                            >
                                                #{employee.id}
                                            </Typography>
                                        </TableCell>
                                       
                                        <TableCell>
                                            <Typography
                                                variant="body1"
                                                fontWeight="bold"
                                                color="text.primary"
                                                gutterBottom
                                                noWrap
                                            >
                                                {employee.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            {checkPermission('change_group') &&
                                                <Tooltip title="Editar Cargo" arrow>
                                                    <IconButton
                                                        sx={{
                                                            '&:hover': {
                                                                background: theme.colors.primary.lighter
                                                            },
                                                            color: theme.palette.primary.main
                                                        }}
                                                        color="inherit"
                                                        size="small"
                                                    >
                                                        <EditTwoToneIcon onClick={() => handleEditGroup(employee.id)} fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            }
                                            {checkPermission('delete_group') &&
                                                <Tooltip title="Remover cargo" arrow>
                                                    <IconButton
                                                        sx={{
                                                            '&:hover': { background: theme.colors.error.lighter },
                                                            color: theme.palette.error.main
                                                        }}
                                                        color="inherit"
                                                        size="small"
                                                    >
                                                        <DeleteTwoToneIcon onClick={() => handleDeleteGroup(employee.id)} fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            }
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Container>
    );
};


export default GroupsTable;
