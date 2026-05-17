export async function GET(
  request: Request,
  { params }: { params: { width: string; height: string } }
) {
  try {
    const width = parseInt(params.width, 10)
    const height = parseInt(params.height, 10)

    if (!width || !height || width < 1 || height < 1) {
      return new Response('Invalid dimensions', { status: 400 })
    }

    // Create an SVG placeholder image
    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#667eea;stop-opacity:1"/><stop offset="100%" style="stop-color:#764ba2;stop-opacity:1"/></linearGradient></defs><rect width="${width}" height="${height}" fill="url(#grad)"/><text x="50%" y="50%" font-size="32" fill="white" font-weight="bold" text-anchor="middle" dominant-baseline="middle">${width}x${height}</text></svg>`

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    return new Response('Failed to generate image', { status: 500 })
  }
}
