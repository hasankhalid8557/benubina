import { auth } from '../../../auth'
import { redirect } from 'next/navigation'
import { getAllBlogs } from './actions'
import BlogList from './BlogList'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AdminBlogsPage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/login')
    }

    const blogs = await getAllBlogs()

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Blog Management</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Create, edit, and manage your blog posts
                        </p>
                    </div>
                    <Link href="/admin/blogs/new" className='mt-12 text-center text-xl font-semibold'>
                        <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                            <svg className="w-5 h-5 mr-2 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create New Post
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="ml-5">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Posts</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{blogs.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="ml-5">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Published</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {blogs.filter(b => b.published).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-5">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Drafts</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {blogs.filter(b => !b.published).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Blog List */}
                <BlogList blogs={blogs} />
            </div>
        </div>
    )
}
