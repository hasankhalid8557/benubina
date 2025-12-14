import { auth } from '../../../../auth'
import { redirect } from 'next/navigation'
import BlogForm from '../BlogForm'

export default async function NewBlogPage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Create New Blog Post</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Fill in the details below to create a new blog post
                    </p>
                </div>

                <BlogForm />
            </div>
        </div>
    )
}
