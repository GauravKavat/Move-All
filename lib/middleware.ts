import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const adminEmails = ['gauravkavat@gmail.com', 'support.moveall@gmail.com']
  const isAdmin = user && user.email && adminEmails.includes(user.email)
  const isClient = user && !isAdmin

  const url = request.nextUrl.clone()

  // Protect client and admin routes
  const isAdminRoute = url.pathname.startsWith('/admin');
  const isAuthRoute = url.pathname.startsWith('/login') || url.pathname.startsWith('/auth');
  const isClientRoute = !isAdminRoute && !isAuthRoute && url.pathname !== '/' && url.pathname !== '/unauthorized';

  if (!user && (isClientRoute || isAdminRoute)) {
    url.pathname = '/unauthorized'
    return NextResponse.redirect(url)
  }

  // Prevent clients from accessing admin routes
  if (user && isAdminRoute && !isAdmin) {
    url.pathname = '/unauthorized'
    return NextResponse.redirect(url)
  }

  // Prevent admins from accessing client routes
  if (user && isClientRoute && isAdmin) {
    url.pathname = '/unauthorized'
    return NextResponse.redirect(url)
  }

  // Redirect signed-in users away from login
  if (user && url.pathname === '/login') {
    if (isAdmin) {
      url.pathname = '/admin'
    } else {
      // Query the client slug
      const { data } = await supabase.from('clients').select('slug').eq('user_id', user.id).single();
      if (data?.slug) {
        url.pathname = `/${data.slug}`;
      } else {
        // If no client profile found, redirect to unauthorized or setup page
        url.pathname = '/unauthorized';
      }
    }
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
