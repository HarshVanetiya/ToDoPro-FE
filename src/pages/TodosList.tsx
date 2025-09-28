import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Trash2, CheckCircle2, Circle, Calendar, Flag, Eye, Loader2, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { todosApi, ApiError } from '@/lib/api'
import { useToast } from '@/components/ui/use-toast'

interface Todo {
  _id: string
  title: string
  description?: string
  status: 'pending' | 'done'
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
}

const priorityColors = {
  low: 'text-green-600 bg-green-50 border-green-200',
  medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  high: 'text-red-600 bg-red-50 border-red-200',
}

const priorityIcons = {
  low: '🟢',
  medium: '🟡', 
  high: '🔴',
}

function TodoCard({ todo, onToggle, onDelete }: {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group"
    >
      <Card className={`transition-all duration-200 hover:shadow-md ${
        todo.status === 'done' ? 'opacity-75 bg-gray-50' : 'bg-white'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <button
              onClick={() => onToggle(todo._id)}
              className="mt-1 transition-colors"
            >
              {todo.status === 'done' ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <Link to={`/todos/${todo._id}`}>
                  <h3 className={`font-medium hover:text-primary transition-colors ${
                    todo.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}>
                    {todo.title}
                  </h3>
                </Link>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link to={`/todos/${todo._id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(todo._id)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {todo.description && (
                <p className={`text-sm mt-1 line-clamp-2 ${
                  todo.status === 'done' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {todo.description}
                </p>
              )}
              
              <div className="flex items-center space-x-4 mt-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                  priorityColors[todo.priority]
                }`}>
                  {priorityIcons[todo.priority]} {todo.priority}
                </span>
                
                {todo.dueDate && (
                  <span className="inline-flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(todo.dueDate).toLocaleDateString()}
                  </span>
                )}
                
                <span className="text-xs text-gray-400">
                  {new Date(todo.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function TodoForm({
  onSave,
  onCancel,
  isSubmitting,
}: {
  onSave: (data: any) => Promise<unknown>
  onCancel: () => void
  isSubmitting: boolean
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [dueDate, setDueDate] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        onCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isSubmitting, onCancel])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    setFormError(null)

    try {
      await onSave({
        title: title.trim(),
        description: description ? description : undefined,
        priority,
        dueDate: dueDate || undefined,
      })
      setTitle('')
      setDescription('')
      setPriority('medium')
      setDueDate('')
    } catch (error) {
      let message = 'We could not create the todo. Please try again.'
      if (error instanceof ApiError) {
        message = error.message || message
      }
      setFormError(message)
    }
  }

  const handleOverlayClick = () => {
    if (!isSubmitting) {
      onCancel()
    }
  }

  const isSubmitDisabled = isSubmitting || !title.trim()

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleOverlayClick}
      />
      <motion.div
        className="relative w-full max-w-lg"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.2 }}
        onClick={(event) => event.stopPropagation()}
      >
        <Card className="border border-slate-200/80 bg-white/95 shadow-2xl backdrop-blur">
          <CardHeader className="space-y-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-2xl font-semibold text-slate-900">Add New Todo</CardTitle>
                <CardDescription>Capture a task with optional details and a due date.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="todo-title">Title</Label>
                <Input
                  id="todo-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  autoFocus
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="todo-description">Description</Label>
                <Textarea
                  id="todo-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add more details..."
                  rows={4}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="todo-priority">Priority</Label>
                  <select
                    id="todo-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="todo-due-date">Due Date</Label>
                  <Input
                    id="todo-due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>

              {formError ? (
                <div className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {formError}
                </div>
              ) : null}
            </CardContent>

            <CardFooter className="flex flex-col gap-3 border-t border-slate-100/80 bg-slate-50/60 p-6 pt-4 sm:flex-row sm:justify-end sm:gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitDisabled} className="w-full sm:w-auto">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Todo
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default function TodosList() {
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
  })
  const [showForm, setShowForm] = useState(false)
  const { toast } = useToast()
  
  const queryClient = useQueryClient()

  // Fetch todos
  const { data, isLoading, error } = useQuery({
    queryKey: ['todos', filters],
    queryFn: () => todosApi.list({
      ...filters,
      status: filters.status as any,
      priority: filters.priority as any,
      limit: 50,
    }),
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: todosApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      toast({
        id: 'create-todo-success',
        variant: 'success',
        title: 'Todo created',
        description: 'Your new task has been added.',
      })
      setShowForm(false)
    },
    onError: (error: unknown) => {
      let description = 'We could not create the todo. Please try again.'
      if (error instanceof ApiError) {
        description = error.message || description
      }
      toast({
        id: 'create-todo-error',
        variant: 'destructive',
        title: 'Failed to create todo',
        description,
      })
    },
  })

  const handleOpenForm = useCallback(() => {
    createMutation.reset()
    setShowForm(true)
  }, [createMutation])

  const handleCloseForm = useCallback(() => {
    if (createMutation.isPending) return
    setShowForm(false)
    createMutation.reset()
  }, [createMutation])

  const deleteMutation = useMutation({
    mutationFn: todosApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const toggleMutation = useMutation({
    mutationFn: todosApi.toggle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const todos = data?.data || []
  const stats = {
    total: todos.length,
    pending: todos.filter((t: Todo) => t.status === 'pending').length,
    done: todos.filter((t: Todo) => t.status === 'done').length,
  }

  const handleSaveTodo = (todoData: any) => createMutation.mutateAsync(todoData)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Todos</h1>
          <p className="text-gray-600">Manage and organize your tasks</p>
        </div>
        <Button onClick={handleOpenForm} className="shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Todo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Flag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Circle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.done}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search todos..."
                value={filters.search}
                onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
              className="h-10 px-3 py-2 text-sm bg-background border border-input rounded-md"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="done">Done</option>
            </select>
            
            <select
              value={filters.priority}
              onChange={(e) => setFilters(f => ({ ...f, priority: e.target.value }))}
              className="h-10 px-3 py-2 text-sm bg-background border border-input rounded-md"
            >
              <option value="">All Priority</option>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Todos List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-red-600">Failed to load todos</p>
            </CardContent>
          </Card>
        ) : todos.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No todos found</h3>
              <p className="text-gray-600 mb-4">
                {Object.values(filters).some(f => f) ? 'Try adjusting your filters' : 'Get started by adding your first task'}
              </p>
              <Button onClick={handleOpenForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Todo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence>
            {todos.map((todo: Todo) => (
              <TodoCard
                key={todo._id}
                todo={todo}
                onToggle={(id) => toggleMutation.mutate(id)}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Todo Form Modal */}
      <AnimatePresence>
        {showForm && (
          <TodoForm
            onSave={handleSaveTodo}
            onCancel={handleCloseForm}
            isSubmitting={createMutation.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
