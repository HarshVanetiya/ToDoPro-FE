import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckSquare, Mail, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { authApi } from '@/lib/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await authApi.forgotPassword({ email })
      setMessage(response.message || 'Reset instructions sent to your email')
    } catch (error: any) {
      setError(error.message || 'Failed to send reset email')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-2xl">
                <CheckSquare className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Forgot password?</CardTitle>
            <CardDescription>
              Enter your email and we'll send you reset instructions
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {message && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg"
                >
                  {message}
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send reset instructions'}
              </Button>

              <Link
                to="/login"
                className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to sign in
              </Link>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
