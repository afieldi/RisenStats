import express, { Response } from "express";

export interface TypedResponse<T> extends Response {
    json: (data: T) => this;
}
