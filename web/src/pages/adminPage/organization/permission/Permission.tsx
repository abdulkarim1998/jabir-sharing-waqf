import DataTable from '@/components/dataTable/DataTable'
import useUsers from '@/hooks/useUsers'
import { User } from '@/interfaces'
import { Button, Select } from '@mantine/core'
import { MRT_ColumnDef as ColumnDef } from 'mantine-react-table'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

const Permission = (): JSX.Element => {
  const { organizationId } = useParams()
  const {
    orgaUser,
    data,
    isLoading,
    error,
    deleteUserFromOrg,
    addUserToOrg,
    isSaving,
  } = useUsers(organizationId)

  const userNotSelected =
    data &&
    data?.filter((u) => !orgaUser?.some((orgUser) => orgUser.id === u.id))

  const [seletedUser, setSeletedUser] = useState('')

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'firstName',
        header: 'الإسم الأول',
      },
      {
        accessorKey: 'lastName',
        header: 'الإسم الثاني',
      },
      {
        accessorKey: 'email',
        header: 'البريد الإلكتروني',
      },
      {
        accessorKey: 'phone',
        header: 'رقم الهاتف',
      },
    ],
    []
  )
  return (
    <div className="mt-4">
      <DataTable
        columns={columns}
        data={orgaUser}
        isLoading={isLoading}
        isSaving={isSaving}
        primaryButtonTitle="إضافة مستخدم"
        error={error}
        openDeleteConfirmModal={deleteUserFromOrg}
        createModal={(table) => (
          <div className="min-h-[15rem] min-w-[15rem]">
            <p>إضافة مستخدم للمؤسسة</p>
            <div>
              <Select
                label="مستخدم"
                placeholder="أضف مستخدم"
                dropdownPosition="bottom"
                searchable
                data={userNotSelected?.map((user) => ({
                  value: user.id,
                  label: `${user.firstName} ${user.lastName}`,
                }))}
                onChange={(selectedOption) => {
                  setSeletedUser(selectedOption)
                }}
              />
            </div>
            <div className="mt-20 flex justify-between items-center">
              <Button
                radius="lg"
                size="lg"
                className="px-4 py-2 text-white  min-w-[10rem] min-h-[3rem] text-lg"
                onClick={() => {
                  addUserToOrg(seletedUser)
                  table.setCreatingRow(null)
                }}
              >
                حفظ
              </Button>

              <Button
                variant="light"
                color="orange"
                radius="lg"
                size="lg"
                className="px-4 py-2 bg-gray-300  min-w-[10rem] min-h-[3rem] text-lg"
                onClick={() => table.setCreatingRow(null)}
              >
                إلغاء
              </Button>
            </div>
          </div>
        )}
      />
    </div>
  )
}

export default Permission
