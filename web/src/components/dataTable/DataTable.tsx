import {
  MRT_EditActionButtons as EditActionButtons,
  MantineReactTable,
  type MRT_ColumnDef as ColumnDef,
  useMantineReactTable,
  type MRT_TableInstance as TableInstance,
  type MRT_Row as Row,
} from 'mantine-react-table'
import { ActionIcon, Button, Flex, Stack, Title, Tooltip } from '@mantine/core'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { MRT_Localization_AR as LocalizationAr } from '@/locales/ar'
import { UseFormReturnType } from '@mantine/form'
import { useState } from 'react'
import useUser from '@/context/user'
import { UserRole } from '@/interfaces'

interface DataTableProps<T extends { id: string }> {
  data: T[]
  columns: ColumnDef<T>[]
  isLoading: boolean
  handleCreate?: () => void
  handleSave?: (id: string) => void
  openDeleteConfirmModal?: (id: string) => void
  primaryButtonTitle?: string
  rowData?: UseFormReturnType<T, (values: T) => T>
  isSaving?: boolean
  error?: boolean
  onRowClick?: (rowId: string) => void
  createModal?: (table: TableInstance<T>, row: Row<T>) => JSX.Element
}

const DataTable = <T extends { id: string }>({
  data,
  columns,
  primaryButtonTitle,
  handleCreate,
  handleSave,
  openDeleteConfirmModal,
  rowData,
  isLoading,
  isSaving,
  error,
  onRowClick,
  createModal,
}: DataTableProps<T>): JSX.Element => {
  const [id, setId] = useState('')
  const { user } = useUser()
  const isAdmin = user.role == UserRole.ADMIN
  const organizationPage = location.pathname === `/waqf/organization`

  const table = useMantineReactTable({
    columns,
    localization: LocalizationAr,
    data: data ?? [],
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableDensityToggle: false,
    enableEditing: (isAdmin && organizationPage) || !organizationPage,
    getRowId: (row) => row.id,
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: () => onRowClick(row.id),
      sx: {
        cursor: 'pointer',
      },
    }),
    onRowSelectionChange: (row) => console.log(row),
    mantineToolbarAlertBannerProps: error
      ? {
          color: 'red',
          children: 'حدث خطأ أثناء تحميل البيانات',
        }
      : undefined,
    onCreatingRowCancel: () => rowData.reset(),
    onCreatingRowSave: () => {
      handleCreate(), table.setCreatingRow(false)
    },
    onEditingRowCancel: () => rowData.reset(),
    onEditingRowSave: () => {
      handleSave(id)
      table.setEditingRow(null)
    },
    renderCreateRowModalContent: ({ table, row, internalEditComponents }) =>
      createModal ? (
        createModal(table, row)
      ) : (
        <Stack>
          <Title order={3}>{primaryButtonTitle}</Title>
          {internalEditComponents}
          <Flex justify="flex-end" mt="xl">
            <EditActionButtons variant="text" table={table} row={row} />
          </Flex>
        </Stack>
      ),
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>تعديل البيانات</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
        {handleSave && (
          <Tooltip label="تعديل">
            <ActionIcon
              onClick={(e) => {
                e.stopPropagation()
                table.setEditingRow(row)
                rowData.setValues(row.original)
                setId(row.id)
              }}
            >
              <IconEdit />
            </ActionIcon>
          </Tooltip>
        )}
        {openDeleteConfirmModal && (
          <Tooltip label="حذف">
            <ActionIcon
              color="red"
              onClick={(e) => {
                e.stopPropagation()
                openDeleteConfirmModal(row.id)
              }}
            >
              <IconTrash />
            </ActionIcon>
          </Tooltip>
        )}
      </Flex>
    ),

    renderTopToolbarCustomActions: ({ table }) =>
      !isAdmin && organizationPage ? null : (
        <Button
          onClick={() => {
            table.setCreatingRow(true)
          }}
          style={{
            backgroundColor: '#228be6',
            padding: '0.5rem',
            height: '3rem',
            width: '10rem',
            margin: '1rem 0',
          }}
        >
          {primaryButtonTitle}
        </Button>
      ),
    state: {
      isLoading: isLoading,
      isSaving: isSaving,
      showAlertBanner: error,
      showProgressBars: isLoading,
    },
  })

  return <MantineReactTable table={table} />
}

export default DataTable
