<div align="center">
  <h1>CastelAPI</h1>
</div>

## Introduction

**CastelAPI** is a lightweight JavaScript library designed to simplify HTTP requests in web applications. It offers a clean and intuitive API for performing CRUD operations, handling loading states, caching responses, and managing retries. Whether you're building a small project or a large-scale application, CastelAPI helps streamline your API interactions. This library is framework-agnostic, so it can be used for both front-end and back-end projects. For front-end applications, it's SSR-friendly and can be used with Nuxt, Next, Nest, etc.

## Breaking change in 1.4.0

If you configure your baseUrl, it would alway be apply to your endpoint:
```typescript
//by default config.baseUrl = ''
const response = await get('https://api.example.com/endpoint') // Works because config.baseUrl is NOT set

//now we configure baseUrl
config.baseUrl = 'https://api.example.com'
const response = await get('https://api.example.com/endpoint')//Doesn't work anymore
const response = await get('/endpoint')//works. Use this instead

```

## New Features

- [Cache Management]: This version adds two new strategies. You can now change the cache management strategy and use localStorage or sessionStorage for a front-end application. These features include a parser to make life easier for you, and it's still SSR-friendly. If `window` is not available, this feature won't be enabled. The cache management section has been updated.
- [TypeScript]: Better type tracking with TypeScript than in the previous version. Some changes in the build. You can now use the power of generic functions :smile: !

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Configuration](#configuration)
  - [Use TypeScript to Keep Track of Types](#use-typescript-to-keep-track-of-types)
  - [GET Requests](#get-requests)
  - [POST Requests](#post-requests)
  - [PUT Requests](#put-requests)
  - [DELETE Requests](#delete-requests)
  - [Loading Management](#loading-management)
  - [Cache Management](#cache-management)
  - [Retry Management](#retry-management)
  - [Transforming Responses](#transforming-responses)
  - [Options Type](#options-type)
  - [Error Handling](#error-handling)
- [FAQ](#faq)
  - [How do I handle authentication?](#how-do-i-handle-authentication)
  - [Can I use CastelAPI with other libraries like Axios?](#can-i-use-castelapi-with-other-libraries-like-axios)
  - [How do I enable CORS?](#how-do-i-enable-cors)
- [Features in progress](#features-in-progress)
- [Contributing](#contributing)
- [License](#license)

## Key Features

- **Simplified HTTP Requests**: Easily perform GET, POST, PUT, DELETE, etc., requests.
- **Loading Indicators**: Automatically display loading indicators during requests.
- **Caching**: Cache request responses to improve your application's performance.
- **Global Configuration**: Configure global parameters such as default headers, base URL, and error handlers.
- **Automatic Parser**: Auto parser included to parse your data from JSON to plain JavaScript objects, text, boolean, etc.

## Installation

You can install CastelAPI via NPM:

```bash
npm install castelapi
```

## Usage

### Configuration

Configuration is optional.
The `config` object allows you to set global parameters for CastelAPI. Below are the available options:

- `baseUrl`: The base URL for all API requests.
- `headers`: Default headers to include with every request.
  Example:

```typescript
import { apiInstance, config } from 'castelapi'

config.baseUrl = 'https://api.example.com'
config.headers = {
  'Content-Type': 'application/json',
}
```

### Use TypeScript to Keep Track of Types

The following example demonstrates how to use TypeScript with generic functions:

```typescript
// You can pass a type to the generic function
type User = { id: number; name: string }
const responseC: User = await get<User>('/endpoint')
```
Here how your IDE will describe this function :
```typescript
(alias) get<User>(url: string, options?: Options): Promise<ResponseWrapper<User>>
import get
// Fetches data from the specified URL.
// @param url — The endpoint or URL to fetch data from.
// @param options — The request options.
// @returns — - A promise that resolves with the fetched data.
// @throws — {Error} - Throws an error if the request fails.
```

### GET Requests

To make a GET request, use the get function:

```typescript
import { get } from 'castelapi'

async function fetchData() {
  try {
    const response = await get('https://api.example.com/endpoint')
    console.log(response)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

fetchData()
```

Details:

```typescript

function get<T>(url: string, options?: Options): Promise<ResponseWrapper<T>>

const response = await get('https://api.example.com/endpoint') // Works
const responseB = await get('/endpoint') // Works if config.baseUrl is set
const { data, status } = await get('/endpoint') // Destructure response from ResponseWrapper type
```

### POST Requests

To make a POST request, use the post function:

```typescript
import { post } from 'castelapi'

async function createData() {
  try {
    const data = { name: 'John Doe', age: 30 }
    const response = await post('https://api.example.com/users', {
      body: data,
    })
    console.log(response)
  } catch (error) {
    console.error('Error creating data:', error)
  }
}

createData()

function post<T>(url: string, options?: PostOptions): Promise<ResponseWrapper<T>>
```

### PUT Requests

To make a PUT request, use the put function:

```typescript
async function updateData() {
  try {
    const data = { name: 'John Doe', age: 31 }
    const response = await put('https://api.example.com/users/1', {
      body: data,
    })
    console.log(response)
  } catch (error) {
    console.error('Error updating data:', error)
  }
}

updateData()
```

### DELETE Requests

To make a DELETE request, use the remove function:

```typescript
import { remove } from 'castelapi'

async function deleteData(id: string) {
  const parameters = new Map()
  parameters.set('id', id)
  try {
    const response = await remove('/endpoint', parameters)
    console.log(response)
  } catch (error) {
    console.error('Error deleting data:', error)
  }
}
const id = '1Ldhio1561dsfdsNUIsd'
deleteData(id)
```

### Loading Management

To monitor the loading state of requests, use the loading function:

```typescript
import { loading } from 'castelapi'

if (loading()) {
  console.log('Request is loading...')
} else {
  console.log('Request is not loading.')
}
```

### Cache Management

You can use cache to prevent outgoing requests.

```typescript
import { get } from 'castelapi'

const result = await get('/endpoint', {
  cache: { enabled: true, cacheTime: 3000 },
})
const cachedResult = await get('/endpoint')
setTimeout(async () => {
  // if cache value is expired, the request is made again
  const resultWithoutCache = await get('/endpoint')
}, 4000)
```

New features: cache strategy management. You can now choose what type of cache to use.

- instanceCache (Default): It should be used for SPA and back-end apps.
- localStorageCache: It should be used for front-end applications without SSR like Vue, React. If you want to keep your cache across multiple windows, see: [localStorage documentation](https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage)
- sessionStorageCache: It should be used for front-end applications without SSR like Vue, React. See: [sessionStorage documentation](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)

```typescript
setCacheStrategy(cacheStrategy: InstanceCache | LocalStorageCache | SessionStorageCache): void
```

```typescript
import { get, setCacheStrategy, localStorageCache } from 'castelapi'

setCacheStrategy(localStorageCache)
// Now cache used is localStorage with parser
const result = await get('/endpoint', {
  cache: { enabled: true, cacheTime: 3000 },
})
const cachedResult = await get('/endpoint')
setTimeout(async () => {
  // if cache value is expired, the request is made again
  const resultWithoutCache = await get('/endpoint')
}, 4000)
```

You can even use one of the three instances if you wish; they implement the cache interface with a parser included. This could be useful if you use `localStorage` or `sessionStorage` in your app:

```typescript
type ResponseWrapper<T> = {
  data: T
  status: number
  url: string
}
type CachedValue<T> = ResponseWrapper<T> && {
  timeStamp: number
}

interface Cache {
  get<T>(key: string): CachedValue<T> | null
  set<T>(key: string, value: T, cacheTime: number): void
  isExpired(cachedResponse: CachedValue): boolean
  clear(): void
  delete(key: string): void
}
```

```typescript
import { sessionStorageCache } from 'castelapi'

sessionStorageCache.set('id', { myId: 123 }, 1000)
const cachedValue = sessionStorageCache.get('id')
```

### Retry Management

You can set an option to retry.

```typescript
import { get } from 'castelapi'

// If the GET request to /endpoint fails, CastelAPI will retry 3 times.
const result = await get('/endpoint', {
  retry: 3,
})
```

### Transforming Responses

You can transform responses before they are returned to your application.

```typescript
import { config } from 'castelapi'

config.responseInterceptor = function <T>(response: ResponseWrapper<T>): ResponseWrapper<T> {
  response.data = transformData(response.data)
  return response
}

function transformData(data) {
  // Custom transformation logic
  return data
}
```

### Options Type

Here the type option you can pass on:

```typescript
type Options = {
  retry?: number
  headers?: Partial<Headers> | Record<string, string> | null | undefined
  method?: string
  parameters?: Map<string, any>
  cache?: { enabled: boolean; cacheTime: number }
}

type PostOptions = Options & {
  body?: Record<string, any>
}
```

## Error Handling

CastelAPI throws errors for network issues, server errors, and other request failures. You can catch these errors using try-catch blocks.

Example:

```typescript
import { get } from 'castelapi'

async function fetchData() {
  try {
    const response = await get('https://api.example.com/endpoint')
    console.log(response)
  } catch (error) {
    if (error instanceof NetworkError) {
      console.error('Network error:', error.message)
    } else if (error instanceof ServerError) {
      console.error('Server error:', error.message)
    } else {
      console.error('Unexpected error:', error)
    }
  }
}

fetchData()
```

## FAQ

### How do I handle authentication?

You can set authentication headers in the global configuration.

```typescript
import { config } from 'castelapi'

config.headers = {
  Authorization: 'Bearer YOUR_API_KEY',
}
```

### Can I use CastelAPI with other libraries like Axios?

yes, but CastelAPI is a standalone library for managing HTTP requests, and it does not depend on Axios or other libraries.

### How do I enable CORS?

CORS must be enabled on the server-side. CastelAPI does not handle CORS directly.

For any other questions, feel free to open an issue on GitHub.

## Features in progress

-Custom Request Interceptors
-timeout config
-disable parser with config
-disable parser with option
-expose parser

## Contributions

Contributions are welcome! Here's how you can contribute:

1. **Report Issues**: If you find a bug, please open an issue on GitHub.
2. **Suggest Features**: If you have an idea for a new feature, please suggest it in the issues section.
3. **Submit Pull Requests**: If you'd like to contribute code, please fork the repository and submit a pull request.
4. **Improve Documentation**: Help us improve this documentation by suggesting changes or adding more examples.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
