export enum SelectedTab {
  organizations = 'organizations',
  projects = 'projects',
}

export const selectedTabs = [
  {
    key: SelectedTab.organizations,
    label: 'المؤسسات الوقفية',
    value: 'organizations',
  },
  { key: SelectedTab.projects, label: 'المشاريع الوقفية', value: 'projects' },
]
