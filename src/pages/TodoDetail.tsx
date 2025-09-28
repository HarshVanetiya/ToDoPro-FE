import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Edit2, Trash2, CheckCircle2, Circle, Calendar, Flag, Save, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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

export default function TodoDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
  })

  // Fetch todo
  const { data, isLoading, error } = useQuery({
    queryKey: ['todo', id],
    queryFn: () => todosApi.get(id!),
    enabled: !!id,
  })

  const todo: Todo | undefined = data?.data

  // Mutations
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => todosApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo', id] })
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      setIsEditing(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: todosApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      navigate('/todos')
    },
  })

  const toggleMutation = useMutation({
    mutationFn: todosApi.toggle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo', id] })
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const handleEdit = () => {
    if (todo) {
      setEditData({
        title: todo.title,
        description: todo.description || '',
        priority: todo.priority,
        dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '',
      })
      setIsEditing(true)
    }
  }

  const handleSave = () => {
    if (todo) {
      updateMutation.mutate({
        id: todo._id,
        data: {
          ...editData,
          dueDate: editData.dueDate || undefined,
        }
      })
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !todo) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link to="/todos">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Todos
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-600">Todo not found or failed to load</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/todos">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Todos
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleMutation.mutate(todo._id)}
            disabled={toggleMutation.isLoading}
          >
            {todo.status === 'done' ? (
              <>
                <Circle className="w-4 h-4 mr-2" />
                Mark Pending
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark Done
              </>
            )}
          </Button>
          
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteMutation.mutate(todo._id)}
            disabled={deleteMutation.isLoading}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Todo Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleMutation.mutate(todo._id)}
                  className="transition-colors"
                  disabled={toggleMutation.isLoading}
                >
                  {todo.status === 'done' ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
                
                {isEditing ? (
                  <Input
                    value={editData.title}
                    onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                    className="text-2xl font-bold border-none p-0 h-auto bg-transparent"
                    placeholder="Todo title"
                  />
                ) : (
                  <CardTitle className={`text-2xl ${
                    todo.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}>
                    {todo.title}
                  </CardTitle>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Description */}
              <div>
                <Label className="text-base font-medium">Description</Label>
                {isEditing ? (
                  <Textarea
                    value={editData.description}
                    onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Add a description..."
                    rows={4}
                    className="mt-2"
                  />
                ) : (
                  <div className="mt-2 text-gray-700">
                    {todo.description ? (
                      <p className="whitespace-pre-wrap">{todo.description}</p>
                    ) : (
                      <p className="text-gray-500 italic">No description provided</p>
                    )}
                  </div>
                )}
              </div>

              {/* Priority and Due Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-medium">Priority</Label>
                  {isEditing ? (
                    <select
                      value={editData.priority}
                      onChange={(e) => setEditData(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full h-10 px-3 py-2 text-sm bg-background border border-input rounded-md mt-2"
                    >
                      <option value="low">🟢 Low</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="high">🔴 High</option>
                    </select>
                  ) : (
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                        priorityColors[todo.priority]
                      }`}>
                        {priorityIcons[todo.priority]} {todo.priority}
                      </span>
                    </div>
                  )}
                </div>
                
                <div>
                  <Label className="text-base font-medium">Due Date</Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editData.dueDate}
                      onChange={(e) => setEditData(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="mt-2"
                    />
                  ) : (
                    <div className="mt-2">
                      {todo.dueDate ? (
                        <div className="flex items-center space-x-2 text-gray-700">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(todo.dueDate).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No due date set</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Edit Actions */}
              {isEditing && (
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={updateMutation.isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`flex items-center space-x-3 p-3 rounded-lg ${
                todo.status === 'done' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-yellow-50 border border-yellow-200'
              }`}>
                {todo.status === 'done' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Completed</p>
                      {todo.completedAt && (
                        <p className="text-sm text-green-700">
                          {new Date(todo.completedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <Circle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-900">Pending</p>
                      <p className="text-sm text-yellow-700">In progress</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Created</Label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(todo.createdAt).toLocaleString()}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(todo.updatedAt).toLocaleString()}
                </p>
              </div>
              
              {todo.completedAt && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Completed</Label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(todo.completedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
