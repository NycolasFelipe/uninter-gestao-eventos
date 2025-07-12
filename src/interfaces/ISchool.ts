export interface ISchool {
  id: number;
  name: string;
  address: string | null;
}

export interface ISchoolCreate {
  name: string;
  address?: string;
}

export interface ISchoolCreateResponse extends ISchool { }