import { createItemHandlers } from '../../_utils/crud.js'

const handlers = createItemHandlers({
  tableName: 'contact',
  itemKey: 'submission',
  selectColumns: ['id', 'name', 'email', 'phone', 'subject', 'message', 'status', 'created_at'],
  updateFields: ['name', 'email', 'phone', 'subject', 'message', 'status'],
})

export const GET = handlers.GET
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE
