import { prisma } from '../lib/prisma.js';
import bcryptjs from 'bcryptjs';

async function main() {
  console.log('Starting database seeding...');

  // Create a demo user
  const hashedPassword = await bcryptjs.hash('password123', 10);
  
  const user = await prisma.users.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      id: crypto.randomUUID(),
      email: 'demo@example.com',
      name: 'Demo User',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log('Created user:', user.email);

  // Create sample blog posts
  const blogPosts = [
    {
      id: crypto.randomUUID(),
      title: 'Getting Started with Next.js',
      slug: 'getting-started-with-nextjs',
      content: 'Next.js is a powerful React framework that makes building web applications easier. In this post, we will explore the basics of Next.js and how to get started with your first project.',
      excerpt: 'Learn the basics of Next.js and start building modern web applications.',
      category: 'Web Development',
      keywords: ['nextjs', 'react', 'javascript', 'web development'],
      coverImage: '/images/nextjs-cover.jpg',
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: user.id,
    },
    {
      id: crypto.randomUUID(),
      title: 'Understanding Prisma ORM',
      slug: 'understanding-prisma-orm',
      content: 'Prisma is a next-generation ORM that makes database access easy and type-safe. This guide will help you understand the core concepts of Prisma and how to use it in your projects.',
      excerpt: 'A comprehensive guide to understanding and using Prisma ORM.',
      category: 'Database',
      keywords: ['prisma', 'orm', 'database', 'postgresql'],
      coverImage: '/images/prisma-cover.jpg',
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: user.id,
    },
    {
      id: crypto.randomUUID(),
      title: 'Building Modern Web Apps',
      slug: 'building-modern-web-apps',
      content: 'Modern web applications require a combination of great tools and best practices. In this article, we explore the essential technologies and patterns for building scalable web applications.',
      excerpt: 'Explore the essential technologies for building modern web apps.',
      category: 'Web Development',
      keywords: ['web apps', 'javascript', 'frontend', 'backend'],
      coverImage: '/images/modern-web-cover.jpg',
      published: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: user.id,
    },
  ];

  for (const post of blogPosts) {
    const blog = await prisma.blogs.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
    console.log('Created blog post:', blog.title);
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
