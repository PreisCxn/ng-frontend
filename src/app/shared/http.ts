export class HttpError extends Error {
  public status: number;

  constructor(error: string, status: number) {
    super(error);
    this.name = 'HttpError';
    this.status = status;
  }

}

export class Http {
  private static readonly BASE_URL: string = 'http://127.0.0.1:8000/api';

  public static async GET<T, R>(uri: string, stringTFunction?: (s: string) => T, callback?: (t: T) => R | T, ...headers: string[]): Promise<R | T> {

    if(!stringTFunction) {
      stringTFunction = JSON.parse;
    }

    if(!callback) {
      callback = (s: T) => s;
    }

    const url = this.BASE_URL + uri;
    const options = {
      method: 'GET',
      headers: this.buildHeaders(headers)
    };

    return fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new HttpError("Failed to read data response...", response.status);
        }
        return response.text();
      })
      .then(body => stringTFunction!(body))
      .then(result => callback!(result))
      .catch(error => {
        throw error;
      });
  }

  public static async PUT<T, R>(uri: string, json: any, stringTFunction: (s: string) => T, callback: (t: T) => R, ...headers: string[]): Promise<R> {
    const url = this.BASE_URL + uri;
    const options = {
      method: 'PUT',
      headers: this.buildHeaders(headers, 'application/json'),
      body: JSON.stringify(json)
    };

    return fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new HttpError("Failed to update data response...", response.status);
        }
        return response.text();
      })
      .then(body => stringTFunction(body))
      .then(result => callback(result))
      .catch(error => {
        throw error;
      });
  }

  public static async POST<T, R>(uri: string, json: any, stringTFunction: (s: string) => T, callback: (t: T) => R, ...headers: string[]): Promise<R> {
    const url = this.BASE_URL + uri;
    const options = {
      method: 'POST',
      headers: this.buildHeaders(headers, 'application/json'),
      body: JSON.stringify(json)
    };

    return fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new HttpError("Failed to create data response...", response.status);
        }
        return response.text();
      })
      .then(body => stringTFunction(body))
      .then(result => callback(result))
      .catch(error => {
        throw error;
      });
  }

  private static buildHeaders(headers: string[], contentType?: string): Headers {
    const headersObj = new Headers();
    for (let i = 0; i < headers.length; i += 2) {
      headersObj.append(headers[i], headers[i + 1]);
    }
    if (contentType) {
      headersObj.append('Content-Type', contentType);
    }
    return headersObj;
  }
}
