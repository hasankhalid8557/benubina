'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '../../../auth'

// Create a new blog post
export async function createBlog(formData) {
    try {
        const session = await auth()
        if (!session?.user) {
            return { error: 'Unauthorized' }
        }

        // Get user ID from email
        const user = await prisma.users.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return { error: 'User not found' }
        }

        const title = formData.get('title')
        const content = formData.get('content')
        const excerpt = formData.get('excerpt')
        const category = formData.get('category')
        const keywords = formData.get('keywords')?.split(',').map(k => k.trim()).filter(Boolean) || []
        const coverImage = formData.get('coverImage')
        const published = formData.get('published') === 'true'

        // Generate slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

        const blog = await prisma.blogs.create({
            data: {
                title,
                slug,
                content,
                excerpt,
                category,
                keywords,
                coverImage,
                published,
                authorId: user.id,
            },
        })

        revalidatePath('/admin/blogs')
        revalidatePath('/blogs')

        return { success: true, blog }
    } catch (error) {
        console.error('Create blog error:', error)
        return { error: error.message }
    }
}

// Update a blog post
export async function updateBlog(id, formData) {
    try {
        const session = await auth()
        if (!session?.user) {
            return { error: 'Unauthorized' }
        }

        const title = formData.get('title')
        const content = formData.get('content')
        const excerpt = formData.get('excerpt')
        const category = formData.get('category')
        const keywords = formData.get('keywords')?.split(',').map(k => k.trim()).filter(Boolean) || []
        const coverImage = formData.get('coverImage')
        const published = formData.get('published') === 'true'

        // Generate slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

        const blog = await prisma.blogs.update({
            where: { id: parseInt(id) },
            data: {
                title,
                slug,
                content,
                excerpt,
                category,
                keywords,
                coverImage,
                published,
            },
        })

        revalidatePath('/admin/blogs')
        revalidatePath('/blogs')
        revalidatePath(`/blogs/${slug}`)

        return { success: true, blog }
    } catch (error) {
        console.error('Update blog error:', error)
        return { error: error.message }
    }
}

// Delete a blog post
export async function deleteBlog(id) {
    try {
        const session = await auth()
        if (!session?.user) {
            return { error: 'Unauthorized' }
        }

        await prisma.blogs.delete({
            where: { id: parseInt(id) },
        })

        revalidatePath('/admin/blogs')
        revalidatePath('/blogs')

        return { success: true }
    } catch (error) {
        console.error('Delete blog error:', error)
        return { error: error.message }
    }
}

// Get all blogs (admin)
export async function getAllBlogs() {
    try {
        const blogs = await prisma.blogs.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: { name: true, email: true }
                }
            }
        })
        return blogs
    } catch (error) {
        console.error('Get all blogs error:', error)
        return []
    }
}

// Get published blogs with pagination and filters (public)
export async function getPublishedBlogs({ page = 1, limit = 6, search = '', category = '', keyword = '' }) {
    try {
        const skip = (page - 1) * limit

        const where = {
            published: true,
            ...(search && {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { excerpt: { contains: search, mode: 'insensitive' } },
                    { content: { contains: search, mode: 'insensitive' } },
                ]
            }),
            ...(category && { category }),
            ...(keyword && { keywords: { has: keyword } }),
        }

        const [blogs, total] = await Promise.all([
            prisma.blogs.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    author: {
                        select: { name: true, email: true }
                    }
                }
            }),
            prisma.blogs.count({ where })
        ])

        return {
            blogs,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        }
    } catch (error) {
        console.error('Get published blogs error:', error)
        return { blogs: [], pagination: { total: 0, pages: 0, currentPage: 1, limit } }
    }
}

// Get all categories
export async function getAllCategories() {
    try {
        const blogs = await prisma.blogs.findMany({
            where: { published: true },
            select: { category: true },
            distinct: ['category']
        })
        return blogs.map(b => b.category)
    } catch (error) {
        console.error('Get categories error:', error)
        return []
    }
}

// Get all keywords
export async function getAllKeywords() {
    try {
        const blogs = await prisma.blogs.findMany({
            where: { published: true },
            select: { keywords: true }
        })
        const allKeywords = new Set()
        blogs.forEach(blog => {
            blog.keywords.forEach(keyword => allKeywords.add(keyword))
        })
        return Array.from(allKeywords)
    } catch (error) {
        console.error('Get keywords error:', error)
        return []
    }
}

// Get single blog by slug
export async function getBlogBySlug(slug) {
    try {
        const blog = await prisma.blogs.findUnique({
            where: { slug },
            include: {
                author: {
                    select: { name: true, email: true }
                }
            }
        })
        return blog
    } catch (error) {
        console.error('Get blog by slug error:', error)
        return null
    }
}
