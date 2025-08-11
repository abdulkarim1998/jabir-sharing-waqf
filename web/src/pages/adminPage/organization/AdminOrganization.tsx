import AdminPage from '@/layouts/AdminPage'
import { MRT_ColumnDef as ColumnDef } from 'mantine-react-table'
import { ModalsProvider, modals } from '@mantine/modals'
import { Organization } from '@/interfaces'
import { schema } from './validation'
import { useForm, zodResolver } from '@mantine/form'
import { FileInput, Switch, Text, Box } from '@mantine/core'
import { useMemo } from 'react'
import useOrganizations from '@/hooks/useOrganizations'
import { toBase64 } from '@/utils/toBase64'
import { useNavigate } from 'react-router-dom'
import DataTable from '@/components/dataTable/DataTable'

const Organizations = (): JSX.Element => {
  const navigate = useNavigate()
  const {
    data: organizations,
    deleteOrganization,
    updateOrganization,
    addOrganization,
    isLoading,
    isSaving,
    error,
  } = useOrganizations()

  const handleCreateOrganization = () => {
    const valid = organization.validate()
    if (valid.hasErrors) {
      return
    }
    addOrganization(organization.values)
    organization.reset()
  }

  const handleSaveOrganization = (OrganizationId: string) => {
    updateOrganization(organization.values, OrganizationId)
    organization.reset()
  }

  const openDeleteConfirmModal = (id: string) => {
    modals.openConfirmModal({
      title: 'تأكيد الحذف',
      children: <Text>هل أنت متاكد تريد حذف المؤسسة ؟</Text>,
      labels: { confirm: 'حذف', cancel: 'تراجع' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteOrganization(id),
      zIndex: 10000,
    })
  }

  const organization = useForm<Organization>({
    validate: zodResolver(schema),
    initialValues: {
      id: '',
      name: '',
      description: '',
      location: '',
      email: '',
      phone: 0,
      isActive: false,
      twitter: '',
      instagram: '',
      website: '',
      logo: '',
    },
  })

  const columns = useMemo<ColumnDef<Organization>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'اسم المؤسسة',
        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          ...organization.getInputProps('name'),
        },
      },
      {
        accessorKey: 'description',
        header: 'وصف المؤسسة',
        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          ...organization.getInputProps('description'),
        },
      },
      {
        accessorKey: 'email',
        header: 'البريد الإلكتروني',
        mantineEditTextInputProps: {
          type: 'email',
          required: true,
          ...organization.getInputProps('email'),
        },
      },
      {
        accessorKey: 'phone',
        header: 'رقم الهاتف',
        mantineEditTextInputProps: {
          type: 'number',
          required: true,
          ...organization.getInputProps('phone'),
        },
      },
      {
        accessorKey: 'logo',
        header: 'شعار المؤسسة',
        Cell: ({ row }) => (
          <div>
            <img
              src={`data:image/jpeg;base64,${row.original.logo.split(',')[1]}`}
              alt="شعار المؤسسة"
              width={50}
              height={50}
            />
          </div>
        ),
        Edit: () => (
          <FileInput
            placeholder="اختر ملف.."
            label="شعار المؤسسة"
            accept="image/png,image/jpeg"
            withAsterisk
            onChange={async (v) => {
              const base64img = await toBase64(v)
              organization.setValues((prev) => ({
                ...prev,
                logo: base64img,
              }))
            }}
          />
        ),
      },
      {
        accessorKey: 'location',
        header: 'مكان المؤسسة',
        mantineEditTextInputProps: {
          type: 'text',
          ...organization.getInputProps('location'),
        },
      },
      {
        accessorKey: 'isActive',
        header: 'حالة المؤسسة',
        editVariant: 'select',
        required: true,
        Cell: ({ row }) => (
          <div>{row.original.isActive ? 'نشطة' : 'غير نشطة'}</div>
        ),
        Edit: () => (
          <Box>
            <Text size="sm" mb={4}>
              حالة المؤسسة:
            </Text>
            <Switch
              label={organization.values.isActive ? 'نشطة' : 'غير نشطة'}
              checked={organization.values.isActive}
              onChange={(event) =>
                organization.setValues((prev) => ({
                  ...prev,
                  isActive: event.target.checked,
                }))
              }
            />
          </Box>
        ),
      },
      {
        accessorKey: 'twitter',
        header: 'تويتر',
        mantineEditTextInputProps: {
          type: 'text',
          ...organization.getInputProps('twitter'),
        },
      },
      {
        accessorKey: 'instagram',
        header: 'انستجرام',
        mantineEditTextInputProps: {
          type: 'text',
          ...organization.getInputProps('instagram'),
        },
      },
      {
        accessorKey: 'website',
        header: 'الموقع الإلكتروني',
        mantineEditTextInputProps: {
          type: 'text',
          ...organization.getInputProps('website'),
        },
      },
    ],
    [organization]
  )

  return (
    <AdminPage>
      <div className="mt-4">
        <p className="flex flex-wrap gap-5 justify-between items-end text-[#392C45] mt-12 mb-8 pb-2 border-b-2 w-full">
          المؤسسات
        </p>
        <ModalsProvider>
          <DataTable
            columns={columns}
            data={organizations}
            handleCreate={handleCreateOrganization}
            handleSave={handleSaveOrganization}
            openDeleteConfirmModal={openDeleteConfirmModal}
            primaryButtonTitle="إضافة مؤسسة"
            rowData={organization}
            isLoading={isLoading}
            isSaving={isSaving}
            error={error}
            onRowClick={(rowId) => navigate(`/organization/${rowId}`)}
          />
        </ModalsProvider>
      </div>
    </AdminPage>
  )
}

export default Organizations
