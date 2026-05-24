import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'placeholder',
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

  // Prevent clients from accessing other clients' routes
  if (user && isClientRoute && !isAdmin) {
    const pathSlug = url.pathname.split('/')[1];
    
    // Always allow the fallback '/client'
    if (pathSlug !== 'client') {
      try {
        const { data: clientData } = await supabase
          .from('clients')
          .select('slug')
          .eq('user_id', user.id)
          .maybeSingle();
        
        // If they have a custom slug and it doesn't match the current path slug, redirect to unauthorized
        if (!clientData || clientData.slug !== pathSlug) {
          url.pathname = '/unauthorized';
          return NextResponse.redirect(url);
        }
      } catch (e) {
        // If clients table doesn't exist, we only allow '/client'
        url.pathname = '/unauthorized';
        return NextResponse.redirect(url);
      }
    }
  }

  // Redirect signed-in users away from login
  if (user && url.pathname === '/login') {
    if (isAdmin) {
      url.pathname = '/admin'
    } else {
      // Query the client slug with fallback to profiles table
      try {
        const { data: clientData } = await supabase
          .from('clients')
          .select('slug')
          .eq('user_id', user.id)
          .maybeSingle();

        if (clientData?.slug) {
          url.pathname = `/${clientData.slug}`;
        } else {
          // Fallback to profiles role check
          const { data: profileData } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();

          if (profileData?.role === 'client') {
            url.pathname = '/client';
          } else {
            url.pathname = '/unauthorized';
          }
        }
      } catch (err) {
        // Table doesn't exist or database query failed: check profiles table role
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (profileData?.role === 'client') {
          url.pathname = '/client';
        } else {
          url.pathname = '/unauthorized';
        }
      }
    }
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
