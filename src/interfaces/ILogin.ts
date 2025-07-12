import type { NavigateFunction } from "react-router-dom";

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface ILoginMutationVariables {
  credentials: ILoginCredentials;
  navigate: NavigateFunction;
} 