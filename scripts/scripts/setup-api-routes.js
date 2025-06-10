// scripts/setup-api-routes.js
const fs = require('fs')
const path = require('path')

// Auth Sign In Route
const AUTH_SIGNIN_ROUTE = `import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    const users = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    if (users.length === 0) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const user = users[0]
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    const response = NextResponse.json(
      { message: 'Sign in successful', user: { id: user.id, email: user.email, name: user.name } },
      { status: 200 }
    )

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7
    })

    return response
  } catch (error) {
    console.error('Sign in error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  )
}
`

// Auth Sign Up Route
const AUTH_SIGNUP_ROUTE = `import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const existingUsers = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const result = await query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    )

    return NextResponse.json(
      { message: 'User created successfully', user: result[0] },
      { status: 201 }
    )
  } catch (error) {
    console.error('Sign up error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  )
}
`

// Experiences Route
const EXPERIENCES_ROUTE = `import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const city = searchParams.get('city')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let queryText = \`
      SELECT e.*, u.name as host_name, u.profile_image as host_image,
             ei.image_url as primary_image
      FROM experiences e
      JOIN users u ON e.host_id = u.id
      LEFT JOIN experience_images ei ON e.id = ei.experience_id AND ei.is_primary = true
      WHERE e.is_active = true
    \`
    const queryParams = []
    let paramCount = 0

    if (category) {
      paramCount++
      queryText += \` AND e.category = $\${paramCount}\`
      queryParams.push(category)
    }

    if (city) {
      paramCount++
      queryText += \` AND e.city ILIKE $\${paramCount}\`
      queryParams.push(\`%\${city}%\`)
    }

    queryText += \` ORDER BY e.rating DESC, e.created_at DESC LIMIT $\${paramCount + 1} OFFSET $\${paramCount + 2}\`
    queryParams.push(limit, offset)

    const experiences = await query(queryText, queryParams)
    return NextResponse.json({ experiences }, { status: 200 })
  } catch (error) {
    console.error('Error fetching experiences:', error)
    return NextResponse.json(
      { message: 'Failed to fetch experiences' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const price = parseFloat(formData.get('price') as string)
    const duration = formData.get('duration') as string
    const maxGuests = parseInt(formData.get('maxGuests') as string)
    const location = formData.get('location') as string

    if (!title || !description || !category || !price || !location) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const locationParts = location.split(',').map(part => part.trim())
    const city = locationParts[0] || location
    const province = locationParts[locationParts.length - 1] || 'Unknown'

    const experienceResult = await query(
      \`INSERT INTO experiences (host_id, title, description, category, price, duration, max_guests, location, city, province)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *\`,
      [user.userId, title, description, category, price, duration, maxGuests, location, city, province]
    )

    const experience = experienceResult[0]

    // Add placeholder image
    await query(
      \`INSERT INTO experience_images (experience_id, image_url, is_primary, display_order)
       VALUES ($1, $2, $3, $4)\`,
      [experience.id, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', true, 1]
    )

    return NextResponse.json(
      { message: 'Experience created successfully', id: experience.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating experience:', error)
    return NextResponse.json(
      { message: 'Failed to create experience' },
      { status: 500 }
    )
  }
}
`

// Profile Route
const PROFILE_ROUTE = `import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userResult = await query(
      \`SELECT u.*, ARRAY_AGG(i.name) as interests
       FROM users u
       LEFT JOIN user_interests ui ON u.id = ui.user_id
       LEFT JOIN interests i ON ui.interest_id = i.id
       WHERE u.id = $1
       GROUP BY u.id\`,
      [user.userId]
    )

    if (userResult.length === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    const userProfile = userResult[0]
    userProfile.interests = userProfile.interests.filter(interest => interest !== null)
    delete userProfile.password

    return NextResponse.json(userProfile, { status: 200 })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { message: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { name, bio, age, location, interests } = await request.json()

    const updateResult = await query(
      \`UPDATE users 
       SET name = $1, bio = $2, age = $3, location = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *\`,
      [name, bio, age, location, user.userId]
    )

    if (updateResult.length === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    if (interests && Array.isArray(interests)) {
      await query('DELETE FROM user_interests WHERE user_id = $1', [user.userId])

      for (const interestName of interests) {
        let interestResult = await query(
          'SELECT id FROM interests WHERE name = $1',
          [interestName]
        )

        let interestId
        if (interestResult.length === 0) {
          const newInterest = await query(
            'INSERT INTO interests (name, category) VALUES ($1, $2) RETURNING id',
            [interestName, 'Other']
          )
          interestId = newInterest[0].id
        } else {
          interestId = interestResult[0].id
        }

        await query(
          'INSERT INTO user_interests (user_id, interest_id) VALUES ($1, $2)',
          [user.userId, interestId]
        )
      }
    }

    const updatedUserResult = await query(
      \`SELECT u.*, ARRAY_AGG(i.name) as interests
       FROM users u
       LEFT JOIN user_interests ui ON u.id = ui.user_id
       LEFT JOIN interests i ON ui.interest_id = i.id
       WHERE u.id = $1
       GROUP BY u.id\`,
      [user.userId]
    )

    const updatedProfile = updatedUserResult[0]
    updatedProfile.interests = updatedProfile.interests.filter(interest => interest !== null)
    delete updatedProfile.password

    return NextResponse.json(updatedProfile, { status: 200 })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { message: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
`

// Auth utility
const LIB_AUTH = `import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { query } from './db'

export interface JWTPayload {
  userId: number
  email: string
  iat?: number
  exp?: number
}

export async function verifyToken(request: NextRequest): Promise<JWTPayload | null> {
  try {
    const authHeader = request.headers.get('authorization')
    let token = authHeader?.replace('Bearer ', '')

    if (!token) {
      token = request.cookies.get('token')?.value
    }

    if (!token) {
      return null
    }

    const decoded = jwt.verify(
      token, 
      process.env.NEXTAUTH_SECRET || 'fallback-secret'
    ) as JWTPayload

    const userResult = await query(
      'SELECT id, email FROM users WHERE id = $1',
      [decoded.userId]
    )

    if (userResult.length === 0) {
      return null
    }

    return decoded
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

export function generateToken(payload: { userId: number; email: string }): string {
  return jwt.sign(
    payload,
    process.env.NEXTAUTH_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  )
}
`

// Database utility
const LIB_DB = `import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

export async function query(text: string, params?: any[]) {
  const start = Date.now()
  const client = await pool.connect()
  
  try {
    const res = await client.query(text, params)
    const duration = Date.now() - start
    console.log('Executed query', { text: text.substring(0, 50) + '...', duration, rows: res.rowCount })
    return res.rows
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  } finally {
    client.release()
  }
}
`

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    console.log(`✅ Created directory: ${dirPath}`)
  }
}

function createFile(filePath, content, fileName) {
  try {
    ensureDirectoryExists(path.dirname(filePath))
    fs.writeFileSync(filePath, content)
    console.log(`✅ Created ${fileName}: ${filePath}`)
  } catch (error) {
    console.error(`❌ Failed to create ${fileName}:`, error.message)
  }
}

function setupApiRoutes() {
  console.log('🔧 Setting up API routes and utilities...')
  
  const appDir = path.join(process.cwd(), 'app')
  const libDir = path.join(process.cwd(), 'lib')
  
  const files = [
    {
      path: path.join(appDir, 'api', 'auth', 'signin', 'route.ts'),
      content: AUTH_SIGNIN_ROUTE,
      name: 'Sign In API route'
    },
    {
      path: path.join(appDir, 'api', 'auth', 'signup', 'route.ts'),
      content: AUTH_SIGNUP_ROUTE,
      name: 'Sign Up API route'
    },
    {
      path: path.join(appDir, 'api', 'experiences', 'route.ts'),
      content: EXPERIENCES_ROUTE,
      name: 'Experiences API route'
    },
    {
      path: path.join(appDir, 'api', 'profile', 'route.ts'),
      content: PROFILE_ROUTE,
      name: 'Profile API route'
    },
    {
      path: path.join(libDir, 'auth.ts'),
      content: LIB_AUTH,
      name: 'Auth utility'
    },
    {
      path: path.join(libDir, 'db.ts'),
      content: LIB_DB,
      name: 'Database utility'
    }
  ]
  
  files.forEach(file => {
    createFile(file.path, file.content, file.name)
  })
  
  console.log('🎉 API routes setup completed!')
  console.log('')
  console.log('📁 Created API structure:')
  console.log('   app/api/auth/signin/route.ts - User authentication')
  console.log('   app/api/auth/signup/route.ts - User registration')
  console.log('   app/api/experiences/route.ts - Experience management')
  console.log('   app/api/profile/route.ts - Profile management')
  console.log('   lib/auth.ts - JWT token utilities')
  console.log('   lib/db.ts - Database connection')
  console.log('')
  console.log('💡 Next steps:')
  console.log('   1. Install dependencies: npm install bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken')
  console.log('   2. Run: npm run dev')
  console.log('   3. Test API endpoints')
}

if (require.main === module) {
  setupApiRoutes()
}

module.exports = { setupApiRoutes }
