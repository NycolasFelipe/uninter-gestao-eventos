// Venue
export interface IVenue {
  id: number;
  schoolId: number;
  name: string;
  address: string;
  capacity: number;
  isInternal: boolean;
  venuePictures?: IVenuePicture[];
}

export interface IVenueCreate {
  schoolId: number;
  name: string;
  address?: string;
  capacity?: number;
  isInternal?: boolean;
}

export interface IVenueCreateResponse extends IVenue { }


// Venue Picture
export interface IVenuePicture {
  id: number;
  venueId: number;
  pictureUrl: string;
}

export interface IVenuePictureCreate {
  venueId: number;
  pictureUrl: string;
}

export interface IVenuePictureCreateResponse extends IVenuePicture { }
