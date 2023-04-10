async function sleep(interval) {
  return new Promise((resolve) => setTimeout(resolve, interval));
}

async function retryFetch(url, options, retry, interval) {
  console.log(`Retrying in ${interval}ms...`);
  await sleep(interval);
  return fetchPlus(url, options, retry - 1, interval);
}

async function defaultShouldRetry(response) {
  return response.status >= 400;
}

async function readStream(stream, contentType) {
  const reader = stream.getReader();
  let data = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    const chunk = value;

    const decoder = new TextDecoder();
    data += decoder.decode(chunk);
  }

  if (contentType === "application/json") {
    return JSON.parse(data);
  } else {
    return data;
  }
}

function headersToObject(headers) {
  const result = {};
  for (const [key, value] of headers.entries()) {
    result[key] = value;
  }

  return result;
}

async function getResponse(originResponse) {
  const response = {};
  response.headers = headersToObject(originResponse.headers);
  response.body = await readStream(originResponse.body, response.headers?.["content-type"]);
  response.bodyUsed = originResponse.bodyUsed;
  response.ok = originResponse.ok;
  response.redirected = originResponse.redirected;
  response.status = originResponse.status;
  response.statusText = originResponse.statusText;
  response.type = originResponse.type;
  response.url = originResponse.url;

  return response;
}

export async function fetchPlus(url, options, retry = 0, interval = 1000, shouldRetry = defaultShouldRetry) {
  try {
    const originResponse = await fetch(url, options);
    if (originResponse.ok) {
      return getResponse(originResponse);
    } else if (retry > 0 && shouldRetry(originResponse)) {
      console.error(`Request failed with status code ${originResponse.status}`);
      return await retryFetch(url, options, retry - 1, interval);
    } else {
      const error = new Error(`Request failed with status code ${originResponse.status}`);
      error.response = getResponse(originResponse);
      throw error;
    }
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error;
  }
}
