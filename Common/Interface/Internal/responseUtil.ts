import express, { Response, Request } from "express";

export interface TypedResponse<T> extends Response {
    json: (data: T) => this;
}

export interface TypedRequest<T> extends Request {
    body: T;
}