import { LoginResult } from "./Login.type";

export interface RegisterResponse extends LoginResult {
    session_id: string;
    message: string;
}