import { createItemHandlers } from '../../_utils/crud.js'

const handlers = createItemHandlers({
  tableName: 'footers',
  itemKey: 'footer',
  selectColumns: [
    'id',
    'slug',
    'name',
    'columns',
    'copyright',
    'social_links',
    'bg_color',
    'settings',
    'created_at',
    'updated_at',
  ],
  updateFields: ['slug', 'name', 'columns', 'copyright', 'social_links', 'bg_color', 'settings'],
  jsonFields: ['columns', 'social_links', 'settings'],
  requireAdminForRead: true,
  requireAdminForWrite: true,
})

export const GET = handlers.GET
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE
