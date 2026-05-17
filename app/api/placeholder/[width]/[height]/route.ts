import { ImageResponse } from 'next/og'

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

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontSize: 32,
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          {width}x{height}
        </div>
      ),
      {
        width,
        height,
      }
    )
  } catch (error) {
    return new Response('Failed to generate image', { status: 500 })
  }
}
