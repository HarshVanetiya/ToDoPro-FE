import { useQuery } from '@tanstack/react-query'
import { BarChart3, TrendingUp, Clock, Target, CheckCircle2, Circle, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
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

export default function Analytics() {
  // Fetch todos for analytics
  const { data: todosData, error: todosError, isLoading: todosLoading } = useQuery({
    queryKey: ['todos', { limit: 1000 }],
    queryFn: () => todosApi.list({ limit: 1000 }),
  })

  const { data: statsData, error: statsError, isLoading: statsLoading } = useQuery({
    queryKey: ['todos-stats'],
    queryFn: () => todosApi.stats(),
  })

  // Debug logging
  console.log('📊 [ANALYTICS] Todos data:', todosData)
  console.log('📊 [ANALYTICS] Todos error:', todosError)
  console.log('📊 [ANALYTICS] Todos loading:', todosLoading)
  console.log('📊 [ANALYTICS] Stats data:', statsData)
  console.log('📊 [ANALYTICS] Stats error:', statsError)
  console.log('📊 [ANALYTICS] Stats loading:', statsLoading)

  const todos: Todo[] = todosData?.data || []
  const stats = statsData?.data || { total: 0, pending: 0, done: 0 }

  console.log('📊 [ANALYTICS] Processed todos:', todos)
  console.log('📊 [ANALYTICS] Processed stats:', stats)

  // Calculate analytics
  const completionRate = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0
  
  // Priority distribution
  const priorityStats = todos.reduce((acc, todo) => {
    acc[todo.priority] = (acc[todo.priority] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Weekly completion trend (last 7 days)
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dateStr = date.toISOString().split('T')[0]
    
    const completed = todos.filter(todo => 
      todo.completedAt && 
      todo.completedAt.startsWith(dateStr)
    ).length
    
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      completed
    }
  })

  // Overdue tasks
  const overdueTasks = todos.filter(todo => 
    todo.status === 'pending' && 
    todo.dueDate && 
    new Date(todo.dueDate) < new Date()
  ).length

  // Average completion time (mock calculation)
  const avgCompletionTime = todos
    .filter(todo => todo.completedAt)
    .reduce((acc, todo) => {
      const created = new Date(todo.createdAt)
      const completed = new Date(todo.completedAt!)
      return acc + (completed.getTime() - created.getTime())
    }, 0) / todos.filter(todo => todo.completedAt).length || 0

  const avgDays = Math.round(avgCompletionTime / (1000 * 60 * 60 * 24))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Track your productivity and task completion patterns</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-500 mt-1">All time</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-3xl font-bold text-green-600">{completionRate}%</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.done} of {stats.total} completed
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Completion</p>
                  <p className="text-3xl font-bold text-purple-600">{avgDays || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">days per task</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue Tasks</p>
                  <p className="text-3xl font-bold text-red-600">{overdueTasks}</p>
                  <p className="text-xs text-gray-500 mt-1">need attention</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Completion Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Weekly Completion Trend</span>
              </CardTitle>
              <CardDescription>
                Tasks completed over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyData.map((day, index) => {
                  const maxCompleted = Math.max(...weeklyData.map(d => d.completed), 1)
                  const percentage = (day.completed / maxCompleted) * 100
                  
                  return (
                    <div key={day.date} className="flex items-center space-x-3">
                      <div className="w-12 text-sm text-gray-600">{day.date}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="bg-primary h-3 rounded-full"
                        />
                      </div>
                      <div className="w-8 text-sm text-gray-900 text-right">{day.completed}</div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Priority Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Priority Distribution</span>
              </CardTitle>
              <CardDescription>
                Breakdown of tasks by priority level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { key: 'high', label: 'High Priority', color: 'bg-red-500', count: priorityStats.high || 0 },
                  { key: 'medium', label: 'Medium Priority', color: 'bg-yellow-500', count: priorityStats.medium || 0 },
                  { key: 'low', label: 'Low Priority', color: 'bg-green-500', count: priorityStats.low || 0 },
                ].map((priority, index) => {
                  const percentage = stats.total > 0 ? (priority.count / stats.total) * 100 : 0
                  
                  return (
                    <div key={priority.key} className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded ${priority.color}`} />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">{priority.label}</span>
                          <span className="text-gray-900 font-medium">{priority.count}</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`h-2 rounded-full ${priority.color}`}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Task Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Task Status Overview</span>
            </CardTitle>
            <CardDescription>
              Current status of all your tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Completed Tasks</p>
                      <p className="text-sm text-green-700">Well done!</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{stats.done}</div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-3">
                    <Circle className="w-8 h-8 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-900">Pending Tasks</p>
                      <p className="text-sm text-yellow-700">Keep going!</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <motion.path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeDasharray={`${completionRate}, 100`}
                      initial={{ strokeDasharray: "0, 100" }}
                      animate={{ strokeDasharray: `${completionRate}, 100` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{completionRate}%</div>
                      <div className="text-xs text-gray-500">Complete</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
