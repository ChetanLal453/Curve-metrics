import { createCollectionHandlers } from '../_utils/crud.js'

const handlers = createCollectionHandlers({
  tableName: 'contact',
  listKey: 'submissions',
  itemKey: 'submission',
  selectColumns: ['id', 'name', 'email', 'phone', 'subject', 'message', 'status', 'created_at'],
  createFields: ['name', 'email', 'phone', 'subject', 'message', 'status'],
  requiredCreateFields: ['name', 'email', 'message'],
  defaultCreateValues: { status: 'new' },
  orderBy: 'created_at DESC, id DESC',
  requireAdminForRead: true,
})

export const GET = handlers.GET
export const POST = handlers.POST
