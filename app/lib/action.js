// app/lib/actions.js
'use server'
import { signIn } from '../../auth'

export async function authenticate(prevState, formData) {
    try {
        const email = formData.get('email')
        const password = formData.get('password')

        await signIn('credentials', {
            email,
            password,
            redirectTo: "/admin",
        })

    } catch (error) {
        // 1. SKIP REDIRECTS: If successful, Next.js throws a redirect "error". 
        // We must let this pass through so the page changes.
        if (error.message === 'NEXT_REDIRECT' ||
            error.message.includes('NEXT_REDIRECT') ||
            error.digest?.includes('NEXT_REDIRECT')) {
            throw error
        }

        // 2. CHECK LOGIN ERRORS MANUALLY (No "instanceof" needed)
        // NextAuth attaches .type to the error object automatically.
        if (error.type === 'CredentialsSignin' || error.code === 'credentials') {
            return 'Invalid credentials.'
        }

        // Log unexpected errors for debugging
        console.error('Login error:', error)
        return 'Something went wrong.'
    }
}