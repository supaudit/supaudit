import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const DICT_URL = 'https://raw.githubusercontent.com/maurosoria/dirsearch/refs/heads/master/db/dicc.txt'
const MAX_ITERATIONS = 10

interface Result {
  url: string
  statusCode: number
  bodySize: number
}

interface RequestBody {
  baseUrl: string
}

const fetchPathsList = async (): Promise<string> => {
  const response = await fetch(DICT_URL)
  if (!response.ok) {
    throw new Error(`Error fetching paths list: ${response.statusText}`)
  }
  return await response.text()
}

const processPaths = (pathsContent: string): string[] => {
  return pathsContent.split('\n').filter(path => path.trim() !== '')
}

const joinUrl = (baseUrl: string, path: string): string => {
  return `${baseUrl}/${path}`
}

const makeHttpRequest = async (url: string): Promise<Result> => {
  const response = await fetch(url)
  const bodyText = await response.text()
  const bodySize = bodyText.length

  return {
    url,
    statusCode: response.status,
    bodySize,
  }
}

const processUrls = async (baseUrl: string): Promise<Result[]> => {
  const pathsContent = await fetchPathsList()

  const results: Result[] = []
  let iterationCount = 0

  for (const path of processPaths(pathsContent)) {
    if (iterationCount >= MAX_ITERATIONS) {
      console.log(`Limit of ${MAX_ITERATIONS} iterations reached`)
      break
    }

    const url = joinUrl(baseUrl, path)
    console.log(url)
    try {
      const result = await makeHttpRequest(url)
      results.push(result)
    } catch (error) {
      console.error(`Failed to fetch ${url}:`, error)
    }
    iterationCount++
  }

  return results
}

Deno.serve(async (req) => {
  try {
    const { url } = await req.json() as RequestBody

    const results = await processUrls(url)

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error)
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
