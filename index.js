async function sleep(interval) {
  return new Promise(resolve => setTimeout(resolve, interval));
}

async function retryFetch(url, options, retry, interval) {
  console.log(`Retrying in ${interval}ms...`);
  await sleep(interval);
  return fetchPlus(url, options, retry - 1, interval);
}

async function defaultShouldRetry(response) {
  return response.status >= 400;
}

async function fetchPlus(url, options, retry = 0, interval = 1000, shouldRetry = defaultShouldRetry) {
  try {
    const response = await fetch(url, options);
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      console.log(...response.headers)
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else if (contentType && contentType.includes('text/plain')) {
        return response.text();
      } else {
        return response;
      }
    } else if (retry > 0 && shouldRetry(response)) {
      console.error(`HTTP error! status: ${response.status}`);
      return await retryFetch(url, options, retry - 1, interval);
    }
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }

  throw new Error(`There was a problem with the fetch operation`);
}

const a = async () => {
  const r = await fetchPlus("http://localhost:3000", {}, 3);
  console.log(r)
}

a();
// module.exports = fetchPlus;