import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Filter, Edit2, Trash2, CheckCircle2, Circle, Calendar, Flag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { todosApi } from '@/lib/api'

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

function TodoCard({ todo, onToggle, onDelete, onEdit }: {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (todo: Todo) => void
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
                <h3 className={`font-medium ${
                  todo.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900'
                }`}>
                  {todo.title}
                </h3>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(todo)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
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
                <p className={`text-sm mt-1 ${
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

function TodoForm({ todo, onSave, onCancel }: {
  todo?: Todo
  onSave: (data: any) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(todo?.title || '')
  const [description, setDescription] = useState(todo?.description || '')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(todo?.priority || 'medium')
  const [dueDate, setDueDate] = useState(
    todo?.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : ''
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      title,
      description: description || undefined,
      priority,
      dueDate: dueDate || undefined,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <CardTitle>{todo ? 'Edit Todo' : 'Add New Todo'}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full h-10 px-3 py-2 text-sm bg-background border border-input rounded-md"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          
          <div className="flex justify-end space-x-2 p-6 pt-0">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {todo ? 'Update' : 'Add'} Todo
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  )
}

export default function Dashboard() {
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
  })
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [showForm, setShowForm] = useState(false)
  
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
      setShowForm(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => todosApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      setEditingTodo(null)
    },
  })

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

  const handleSaveTodo = (todoData: any) => {
    if (editingTodo) {
      updateMutation.mutate({ id: editingTodo._id, data: todoData })
    } else {
      createMutation.mutate(todoData)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="shrink-0">
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No todos yet</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first task</p>
              <Button onClick={() => setShowForm(true)}>
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
                onEdit={(todo) => setEditingTodo(todo)}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Todo Form Modal */}
      <AnimatePresence>
        {(showForm || editingTodo) && (
          <TodoForm
            todo={editingTodo || undefined}
            onSave={handleSaveTodo}
            onCancel={() => {
              setShowForm(false)
              setEditingTodo(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
