import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';
import { logger, handleApiError } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    logger.info('Fetching experiences', 'API:experiences');
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const search = searchParams.get('search');

    logger.debug('Search parameters', { 
      category, location, priceMin, priceMax, search 
    }, 'API:experiences');

    let queryText = `
      SELECT e.*, u.first_name, u.last_name, u.profile_picture as host_picture
      FROM experiences e
      JOIN users u ON e.host_id = u.id
      WHERE e.active = true
    `;
    const queryParams: any[] = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      queryText += ` AND (e.title ILIKE $${paramCount} OR e.description ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    if (category) {
      paramCount++;
      queryText += ` AND e.category = $${paramCount}`;
      queryParams.push(category);
    }

    if (location) {
      paramCount++;
      queryText += ` AND e.location ILIKE $${paramCount}`;
      queryParams.push(`%${location}%`);
    }

    if (priceMin) {
      paramCount++;
      queryText += ` AND e.price >= $${paramCount}`;
      queryParams.push(parseFloat(priceMin));
    }

    if (priceMax) {
      paramCount++;
      queryText += ` AND e.price <= $${paramCount}`;
      queryParams.push(parseFloat(priceMax));
    }

    queryText += ' ORDER BY e.created_at DESC';

    logger.debug('Executing experiences query', { queryText }, 'API:experiences');
    const result = await query(queryText, queryParams);

    logger.info(`Experiences fetched successfully - count: ${result.rows.length}`, 'API:experiences');

    return NextResponse.json({
      success: true,
      experiences: result.rows,
    });
  } catch (error) {
    logger.error(error instanceof Error ? error : new Error(String(error)), 'API:experiences');
    handleApiError(error, 'GET /api/experiences');
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    logger.info('Creating new experience', 'API:experiences');
    
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      logger.warn('No auth token provided', 'API:experiences');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user from token
    const user = await getUserFromToken(token);
    if (!user) {
      logger.warn('Invalid auth token', 'API:experiences');
      return NextResponse.json(
        { error: 'Invalid authentication' },
        { status: 401 }
      );
    }

    logger.debug('User authenticated', { userId: user.id }, 'API:experiences');

    const {
      title,
      description,
      category,
      price,
      duration,
      location,
      maxParticipants,
      images,
      requirements,
    } = await request.json();

    logger.debug('Experience data received', { 
      title, category, price, location 
    }, 'API:experiences');

    // Validate required fields
    if (!title || !description || !category || !price || !duration || !location) {
      logger.warn('Missing required fields', 'API:experiences');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create experience
    logger.debug('Inserting experience into database', undefined, 'API:experiences');
    const result = await query(
      `INSERT INTO experiences (
        host_id, title, description, category, price, duration,
        location, max_participants, images, requirements, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()) RETURNING *`,
      [
        user.id,
        title,
        description,
        category,
        parseFloat(price),
        parseInt(duration),
        location,
        maxParticipants ? parseInt(maxParticipants) : null,
        JSON.stringify(images || []),
        requirements,
      ]
    );

    logger.info(`Experience created successfully - ID: ${result.rows[0].id}`, 'API:experiences');

    return NextResponse.json({
      success: true,
      experience: result.rows[0],
    });
  } catch (error) {
    logger.error(error instanceof Error ? error : new Error(String(error)), 'API:experiences');
    handleApiError(error, 'POST /api/experiences');
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    );
  }
}