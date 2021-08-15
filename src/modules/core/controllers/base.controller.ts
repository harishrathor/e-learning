import express from 'express';

const HTTPStatusCodeMessage = {
    200: "OK",
    201: "Created",
    202: "Accepted",
    203: "Non-Authoritative Information",
    204: "No Content",
    205: "Reset Content",
    206: "Partial Content",
    207: "Multi-Status",
    208: "Already Reported",

    300: "Multiple Choice",
    301: "Moved Permanently",
    302: "Found",
    303: "See Other",
    304: "Not Modified",
    305: "Use Proxy",
    306: "unused",
    307: "Temporary Redirect",
    308: "Permanent Redirect",

    400	: 'BadRequest',
    401	: 'Unauthorized',
    402	: 'PaymentRequired',
    403	: 'Forbidden',
    404	: 'NotFound',
    405	: 'MethodNotAllowed',
    406	: 'NotAcceptable',
    407	: 'ProxyAuthenticationRequired',
    408	: 'RequestTimeout',
    409	: 'Conflict',
    410	: 'Gone',
    411	: 'LengthRequired',
    412	: 'PreconditionFailed',
    413	: 'PayloadTooLarge',
    414	: 'URITooLong',
    415	: 'UnsupportedMediaType',
    416	: 'RangeNotSatisfiable',
    417	: 'ExpectationFailed',
    418	: 'ImATeapot',
    421	: 'MisdirectedRequest',
    422	: 'UnprocessableEntity',
    423	: 'Locked',
    424	: 'FailedDependency',
    425	: 'UnorderedCollection',
    426	: 'UpgradeRequired',
    428	: 'PreconditionRequired',
    429	: 'TooManyRequests',
    431	: 'RequestHeaderFieldsTooLarge',
    451	: 'UnavailableForLegalReasons',
    500	: 'InternalServerError',
    501	: 'NotImplemented',
    502	: 'BadGateway',
    503	: 'ServiceUnavailable',
    504	: 'GatewayTimeout',
    505	: 'HTTPVersionNotSupported',
    506	: 'VariantAlsoNegotiates',
    507	: 'InsufficientStorage',
    508	: 'LoopDetected',
    509	: 'BandwidthLimitExceeded',
    510	: 'NotExtended',
    511	: 'NetworkAuthenticationRequired',
};
export default abstract class BaseController {


    protected _initialize() {

    }

    public unauthorized (res: express.Response, message?: string) {
        return this.sendResponse(res, 401);
    }

    public forbidden (res: express.Response, message?: string) {
        return this.sendResponse(res, 403);
    }

    public notFound (res: express.Response, message?: string) {
        return this.sendResponse(res, 404);
    }

    public serverError(res, errorObject, errorMessage) {
        this.sendResponse(res, 500, errorObject, errorMessage);
    }

    public async get(req: express.Request, res: express.Response) {
        this.sendResponse(res);
    };
    public async post(req: express.Request, res: express.Response) {
        this.sendResponse(res);
    };
    public async delete(req: express.Request, res: express.Response) {
        this.sendResponse(res);
    };
    public async put(req: express.Request, res: express.Response) {
        this.sendResponse(res);
    };
    public async patch(req: express.Request, res: express.Response) {
        this.sendResponse(res);
    };


    public sendResponse(res: express.Response, status = 200, data = {}, message = '') {
        var success = true;
        var textStatus = ''
        if (status >= 400) {
            success = false;
        } 
        if (HTTPStatusCodeMessage[status]) {
            textStatus = HTTPStatusCodeMessage[status];
        }
      const response = {
          success,
          status,
          textStatus,
          message,
          data,

      };
      res.status(status).send(response).end();
  }


}