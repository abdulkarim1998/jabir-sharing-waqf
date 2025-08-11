import { type MRT_ColumnDef as ColumnDef } from 'mantine-react-table'
import { ModalsProvider, modals } from '@mantine/modals'
import { Project } from '@/interfaces'
import { schema } from './validation'
import { useForm, zodResolver } from '@mantine/form'
import { Text, Switch, Box } from '@mantine/core'
import { useMemo } from 'react'
import useProjects from '@/hooks/useProjects'
import DataTable from '@/components/dataTable/DataTable'
import { useParams } from 'react-router-dom'

const AdminProjects = (): JSX.Element => {
  const { organizationId } = useParams()
  const {
    data: projects,
    deleteProject,
    updateProject,
    addProject,
    isLoading,
    isSaving,
    error,
  } = useProjects(organizationId)

  const handleCreateProject = () => {
    const valid = project.validate()
    if (valid.hasErrors) {
      return
    }
    addProject(project.values)
    project.reset()
  }

  const handleSaveProject = (ProjectId: string) => {
    updateProject(project.values, ProjectId)
    project.reset()
  }

  const openDeleteConfirmModal = (id: string) => {
    modals.openConfirmModal({
      title: 'تأكيد الحذف',
      children: <Text>هل أنت متأكد تريد حذف المشروع ؟</Text>,
      labels: { confirm: 'حذف', cancel: 'تراجع' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteProject(id),
      zIndex: 10000,
    })
  }

  const project = useForm<Project>({
    validate: zodResolver(schema),
    initialValues: {
      id: '',
      title: '',
      description: '',
      address: '',
      isActive: false,
      isComplete: false,
      value: 0,
    },
  })

  const columns = useMemo<ColumnDef<Project>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'اسم المشروع',
        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          ...project.getInputProps('title'),
        },
      },
      {
        accessorKey: 'description',
        header: 'وصف المشروع',
        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          ...project.getInputProps('description'),
        },
      },
      {
        accessorKey: 'address',
        header: 'مكان المشروع',
        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          ...project.getInputProps('address'),
        },
      },
      {
        accessorKey: 'value',
        header: 'قيمة المشروع',
        mantineEditTextInputProps: {
          type: 'number',
          required: true,
          ...project.getInputProps('value'),
        },
      },
      {
        accessorKey: 'isActive',
        header: 'فعالية المشروع',
        editVariant: 'select',
        required: true,
        Cell: ({ row }) => (
          <div>{row.original.isActive ? 'نشط' : 'غير نشط'}</div>
        ),
        Edit: () => (
          <Box>
            <Text size="sm" mb={4}>
              فعالية المشروع:
            </Text>
            <Switch
              label={project.values.isActive ? 'نشط' : 'غير نشط'}
              checked={project.values.isActive}
              onChange={(event) =>
                project.setValues((prev) => ({
                  ...prev,
                  isActive: event.target.checked,
                }))
              }
            />
          </Box>
        ),
      },
      {
        accessorKey: 'isComplete',
        header: ' حالة المشروع',
        required: true,
        Cell: ({ row }) => (
          <div>{row.original.isComplete ? 'مكتمل' : 'غير مكتمل'}</div>
        ),
        Edit: () => (
          <Box>
            <Text size="sm" mb={4}>
              حالة المشروع:
            </Text>
            <Switch
              label={project.values.isComplete ? 'مكتمل' : 'غير مكتمل'}
              checked={project.values.isComplete}
              onChange={(event) =>
                project.setValues((prev) => ({
                  ...prev,
                  isComplete: event.target.checked,
                }))
              }
            />
          </Box>
        ),
      },
    ],
    [project]
  )

  return (
    <ModalsProvider>
      <DataTable
        columns={columns}
        data={projects}
        handleCreate={handleCreateProject}
        handleSave={handleSaveProject}
        openDeleteConfirmModal={openDeleteConfirmModal}
        primaryButtonTitle="إضافة مشروع"
        rowData={project}
        isLoading={isLoading}
        isSaving={isSaving}
        error={error}
      />
    </ModalsProvider>
  )
}

export default AdminProjects
