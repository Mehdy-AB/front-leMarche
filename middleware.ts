// middleware.ts

import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const hour = new Date().getHours()

  let theme = 'theme-night'
  if (hour >= 5 && hour < 8) theme = 'theme-sunrise'
  else if (hour >= 8 && hour < 16) theme = 'theme-midday'
  else if (hour >= 16 && hour < 19) theme = 'theme-sunset'

  const response = NextResponse.next()
  response.cookies.set('theme', theme, {
    path: '/',
    httpOnly: false, // must be accessible from JS in the layout
  })

  return response
}
