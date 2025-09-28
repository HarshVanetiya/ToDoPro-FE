import { Link } from "react-router-dom";
import { CheckSquare, Zap, Shield, BarChart3, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
    {
        icon: CheckSquare,
        title: "Smart Task Management",
        description:
            "Organize your tasks with priorities, due dates, and categories for maximum productivity.",
    },
    {
        icon: BarChart3,
        title: "Advanced Analytics",
        description:
            "Track your productivity with detailed insights and performance metrics.",
    },
    {
        icon: Zap,
        title: "Lightning Fast",
        description:
            "Built with modern technology for instant responses and smooth interactions.",
    },
    {
        icon: Shield,
        title: "Secure & Private",
        description:
            "Your data is encrypted and secure with enterprise-grade security measures.",
    },
];

// const testimonials = [
//   {
//     name: 'Sarah Johnson',
//     role: 'Product Manager',
//     content: 'ToDoPro has transformed how I manage my daily tasks. The analytics feature is incredible!',
//     rating: 5
//   },
//   {
//     name: 'Mike Chen',
//     role: 'Software Developer',
//     content: 'Clean interface, powerful features. Exactly what I needed for project management.',
//     rating: 5
//   },
//   {
//     name: 'Emily Davis',
//     role: 'Freelancer',
//     content: 'The priority system and due date tracking keep me organized and on schedule.',
//     rating: 5
//   }
// ]

export default function Landing() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                                <CheckSquare className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">
                                ToDoPro
                            </span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link to="/login">
                                <Button variant="ghost">Sign In</Button>
                            </Link>
                            <Link to="/register">
                                <Button>Get Started</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
                            Organize Your Life with
                            <span className="text-primary block">
                                Beautiful Simplicity
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            ToDoPro is the most elegant way to manage your
                            tasks, track your progress, and achieve your goals.
                            Built for professionals who demand excellence.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register">
                                <Button size="lg" className="text-lg px-8 py-6">
                                    Start Free Today
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Everything you need to stay productive
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Powerful features designed to help you organize,
                            prioritize, and accomplish more.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                            >
                                <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                                    <CardContent className="p-6 text-center">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                                            <feature.icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600">
                                            {feature.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Loved by thousands of users
                        </h2>
                    </div>

                    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div> */}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                            Ready to transform your productivity?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Join thousands of users who have already made the
                            switch to ToDoPro.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register">
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="text-lg px-8 py-6"
                                >
                                    Get Started Free
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                        <p className="text-sm text-blue-200 mt-4">
                            No credit card required • Free forever plan
                            available
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                                    <CheckSquare className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <span className="text-lg font-bold">
                                    ToDoPro
                                </span>
                            </div>
                            <p className="text-gray-400">
                                Beautiful task management for modern
                                professionals.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Product</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Pricing
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Security
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Company</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a href="#" className="hover:text-white">
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Careers
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Support</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Help Center
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Contact
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Privacy
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 ToDoPro. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
