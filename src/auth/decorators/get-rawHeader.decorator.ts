import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as request from 'supertest';


export const RawHeaders = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {

        const request = ctx.switchToHttp().getRequest();
        const headers = request.rawHeaders;


        return headers;
    }
);