import { getPublishedBlogs, getAllCategories, getAllKeywords } from '../admin/blogs/actions'
import BlogGrid from './BlogGrid'
import BlogFilters from './BlogFilters'

export default async function BlogsPage(props) {
    const searchParams = await props.searchParams
    const page = parseInt(searchParams.page) || 1
    const search = searchParams.search || ''
    const category = searchParams.category || ''
    const keyword = searchParams.keyword || ''

    const { blogs, pagination } = await getPublishedBlogs({ page, search, category, keyword })
    const categories = await getAllCategories()
    const keywords = await getAllKeywords()

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Our Blog
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Insights, tutorials, and updates from our team
                    </p>
                </div>

                {/* Filters */}
                <BlogFilters
                    categories={categories}
                    keywords={keywords}
                    currentSearch={search}
                    currentCategory={category}
                    currentKeyword={keyword}
                />

                {/* Blog Grid */}
                <BlogGrid blogs={blogs} pagination={pagination} />
            </div>
        </div>
    )
}
