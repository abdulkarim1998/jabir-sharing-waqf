import AdminPage from '@/layouts/AdminPage'
import { MRT_ColumnDef } from 'mantine-react-table'
import { ModalsProvider, modals } from '@mantine/modals'
import { User, UserRole } from '@/interfaces'
import useUsers from '@/hooks/useUsers'
import { schema } from './validation'
import { useForm, zodResolver } from '@mantine/form'
import { Text } from '@mantine/core'
import { useMemo } from 'react'
import DataTable from '@/components/dataTable/DataTable'

const User = (): JSX.Element => {
  const {
    data: users,
    deleteUser,
    updateUser,
    addUser,
    isLoading,
    isSaving,
    error,
  } = useUsers()

  // CREATE action

  const openDeleteConfirmModal = (id: string) => {
    modals.openConfirmModal({
      title: 'تأكيد الحذف',
      children: <Text>هل أنت متاكد تريد حذف المستخدم ؟</Text>,
      labels: { confirm: 'حذف', cancel: 'تراجع' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteUser(id),
      zIndex: 10000,
    })
  }

  const user = useForm<User>({
    validate: zodResolver(schema),
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: UserRole.ORGANIZATION,
      phone: 0,
      id: '',
    },
  })

  const handleCreateUser = () => {
    const valid = user.validate()
    if (valid.hasErrors) {
      return
    }
    addUser(user.values)
    user.reset()
  }

  const handleSaveUser = () => {
    updateUser(user.values)
    user.reset()
  }

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'firstName',
        header: 'الإسم الأول',
        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          ...user.getInputProps('firstName'),
        },
      },
      {
        accessorKey: 'lastName',
        header: 'الإسم الثاني',
        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          ...user.getInputProps('lastName'),
        },
      },
      {
        accessorKey: 'email',
        header: 'البريد الإلكتروني',
        mantineEditTextInputProps: {
          type: 'email',
          required: true,
          ...user.getInputProps('email'),
        },
      },
      {
        accessorKey: 'phone',
        header: 'رقم الهاتف',
        mantineEditTextInputProps: {
          type: 'number',
          required: true,
          ...user.getInputProps('phone'),
        },
      },
    ],
    [user]
  )

  return (
    <AdminPage>
      <div className="mt-4">
        <p className="flex flex-wrap gap-5 justify-between items-end text-[#392C45] mt-12 mb-8 pb-2 border-b-2 w-full">
          المستخدمين
        </p>
        <ModalsProvider>
          <DataTable
            columns={columns}
            data={users}
            handleCreate={handleCreateUser}
            handleSave={handleSaveUser}
            openDeleteConfirmModal={openDeleteConfirmModal}
            primaryButtonTitle="إضافة مستخدم"
            rowData={user}
            isLoading={isLoading}
            isSaving={isSaving}
            error={error}
          />
        </ModalsProvider>
      </div>
    </AdminPage>
  )
}

export default User
