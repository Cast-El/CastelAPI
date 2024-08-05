# CastelAPI

**CastelAPI** is a powerful and easy-to-use JavaScript library for managing HTTP requests in your web applications. Designed to simplify interactions with APIs, CastelAPI offers an intuitive interface and advanced features such as error handling, loading indicators, and response caching.

## Key Features:
- **Simplified HTTP Requests**: Easily perform GET, POST, PUT, DELETE, etc., requests.
- **Error Handling**: Consistently handle errors and display custom error messages.
- **Loading Indicators**: Automatically display loading indicators during requests.
- **Caching**: Cache request responses to improve your application's performance.
- **Global Configuration**: Configure global parameters such as default headers, base URL, and error handlers.

## Installation:
You can install CastelAPI via NPM:
```bash
npm install castelapi
```
## Usage:
Here is an example of configuring and using CastelAPI in your project:
```typescript
import CastelAPI from 'castelapi';

const api = new CastelAPI({
  baseURL: 'https://api.example.com',
  headers: {
    'Authorization': 'Bearer your-token'
  }
});

// Example usage in a GET request with caching
async function fetchData() {
  try {
    const response = await api.get('/your-endpoint', {}, true);
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchData();

```
## Contributions:
Contributions are welcome! Feel free to open issues or submit pull requests to improve CastelAPI.