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

type Props = {
    employeesList: Employees[],
    refreshList: () => void
}

const EmployeesTable = ({ employeesList, refreshList }: Props) => {
    const { user, checkPermission } = useAuth();

    const theme = useTheme();
    const navigate = useNavigate()

    const handleEditEmployee = (id: number) => {
        navigate(`/employees/edit/${id}`)
    }

    const handleDeleteEmployee = async (id: number) => {
        await api(`companies/employees/${id}`, 'delete', {}, user.auth.jwt_access)

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
                                <TableCell>Email</TableCell>
                                <TableCell align="right">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employeesList.map((employee) => {
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
                                        <TableCell>
                                            <Typography
                                                variant="body1"
                                                fontWeight="bold"
                                                color="text.primary"
                                                gutterBottom
                                                noWrap
                                            >
                                                {employee.email}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            {checkPermission('change_employee') &&
                                                <Tooltip title="Editar funcionário" arrow>
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
                                                        <EditTwoToneIcon onClick={() => handleEditEmployee(employee.id)} fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            }
                                            {checkPermission('delete_employee') &&
                                                <Tooltip title="Demitir funcionário" arrow>
                                                    <IconButton
                                                        sx={{
                                                            '&:hover': { background: theme.colors.error.lighter },
                                                            color: theme.palette.error.main
                                                        }}
                                                        color="inherit"
                                                        size="small"
                                                    >
                                                        <DeleteTwoToneIcon onClick={() => handleDeleteEmployee(employee.id)} fontSize="small" />
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


export default EmployeesTable;
